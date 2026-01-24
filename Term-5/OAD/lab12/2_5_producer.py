import json
import time
import random
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

hosts = ["host1", "host2", "host3"]
metrics = ["cpu", "memory", "disk"]

while True:
    for host in hosts:
        for metric in metrics:
            # UNIX timestamp
            ts_unix = int(time.time())  
            # ISO 8601 string
            ts_iso = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(ts_unix))

            msg = {
                "host": host,
                "metric_type": metric,
                "value": round(random.uniform(0, 100), 2),
                "timestamp": ts_unix,      # для Spark BIGINT -> конвертируем в TimestampType
                "timestamp_iso": ts_iso    # можно сразу использовать как строку
            }
            producer.send("it_metrics", value=msg)
            print(msg)
    time.sleep(1)
