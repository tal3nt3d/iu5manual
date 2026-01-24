# consumer_aggregator.py
from confluent_kafka import Consumer, Producer
import json, time, csv
from collections import defaultdict
from datetime import datetime, timezone

BOOTSTRAP = "localhost:9092"
GROUP = "metrics-aggregator"
SRC_TOPIC = "web-logs"
ERROR_TOPIC = "error-logs"
STATS_FILE = "metrics_stats.csv"

consumer_conf = {
    'bootstrap.servers': BOOTSTRAP,
    'group.id': GROUP,
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_conf)
producer = Producer({'bootstrap.servers': BOOTSTRAP})

consumer.subscribe([SRC_TOPIC])

# Aggregation structures: { (minute, service, endpoint): {count, sum_resp, errors} }
agg = {}

def minute_key(ts_iso):
    dt = datetime.fromisoformat(ts_iso.replace("Z","+00:00"))
    return dt.replace(second=0, microsecond=0, tzinfo=timezone.utc).isoformat()

def flush_stats_to_csv():
    header = ["minute","service","endpoint","count","avg_response_ms","errors","avg_cpu","avg_mem"]
    with open(STATS_FILE, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for k, v in agg.items():
            minute, service, endpoint = k
            avg_resp = v['sum_resp']/v['count'] if v['count'] else 0
            avg_cpu = v.get('sum_cpu',0)/v['count'] if v['count'] else 0
            avg_mem = v.get('sum_mem',0)/v['count'] if v['count'] else 0
            writer.writerow([minute, service, endpoint, v['count'], round(avg_resp,2), v['errors'], round(avg_cpu,2), round(avg_mem,2)])
    print("Flushed stats to", STATS_FILE)

try:
    last_flush = time.time()
    print("Starting consumer...")
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            # periodically flush to file even if idle
            if time.time() - last_flush > 60:
                flush_stats_to_csv()
                last_flush = time.time()
            continue
        if msg.error():
            print("Consumer error:", msg.error())
            continue
        data = json.loads(msg.value().decode('utf-8'))
        ts = data.get("timestamp")
        service = data.get("service")
        level = data.get("level","INFO")
        endpoint = data.get("tags",{}).get("endpoint","-")
        metrics = data.get("metrics",{})
        resp = metrics.get("response_ms", 0)
        cpu = metrics.get("cpu_percent", 0)
        mem = metrics.get("mem_percent", 0)

        # Forward ERRORs to error-logs
        if level == "ERROR":
            producer.produce(ERROR_TOPIC, msg.value())
            producer.poll(0)

        # Aggregate
        minute = minute_key(ts)
        key = (minute, service, endpoint)
        if key not in agg:
            agg[key] = {'count':0, 'sum_resp':0, 'errors':0, 'sum_cpu':0, 'sum_mem':0}
        agg[key]['count'] += 1
        agg[key]['sum_resp'] += resp if isinstance(resp,(int,float)) else 0
        agg[key]['sum_cpu'] += cpu if isinstance(cpu,(int,float)) else 0
        agg[key]['sum_mem'] += mem if isinstance(mem,(int,float)) else 0
        if level == "ERROR":
            agg[key]['errors'] += 1

        # flush every 60 seconds
        if time.time() - last_flush > 60:
            flush_stats_to_csv()
            last_flush = time.time()

except KeyboardInterrupt:
    print("Stopping consumer and flushing stats")
finally:
    flush_stats_to_csv()
    consumer.close()
