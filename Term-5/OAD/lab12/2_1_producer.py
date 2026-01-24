# producer_simulator.py
import time, json, socket, random
from datetime import datetime, timezone
from confluent_kafka import Producer

KAFKA_BOOTSTRAP = "localhost:9092"
TOPIC = "web-logs"

p = Producer({'bootstrap.servers': KAFKA_BOOTSTRAP})

services = ["web-frontend", "auth-service", "catalog-service"]

def mk_msg(service):
    level = random.choices(["INFO","WARN","ERROR","DEBUG"], weights=[80,10,5,5])[0]
    response_ms = max(1, int(random.gauss(120, 80)))
    msg = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": service,
        "level": level,
        "message": "simulated metric",
        "metrics": {
            "response_ms": response_ms,
            "cpu_percent": round(random.uniform(1,80),2),
            "mem_percent": round(random.uniform(1,90),2)
        },
        "tags": {"endpoint": random.choice(["/","/api/items","/login"])}
    }
    return msg

def delivery_report(err, msg):
    if err:
        print("Delivery failed:", err)
    # else: print("Delivered", msg.key())

if __name__ == "__main__":
    try:
        print("Starting producer simulator...")
        while True:
            srv = random.choice(services)
            message = mk_msg(srv)
            p.produce(TOPIC, json.dumps(message).encode('utf-8'), callback=delivery_report)
            p.poll(0)  # serve delivery callbacks
            time.sleep(0.2)  # ~5 msgs/sec (регулируй)
    except KeyboardInterrupt:
        print("Stopping producer")
    finally:
        p.flush()
