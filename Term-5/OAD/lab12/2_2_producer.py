import json
import time
import random
from datetime import datetime, timezone
from confluent_kafka import Producer

BOOTSTRAP = "localhost:9092"
TOPIC = "iot-sensors"

p = Producer({'bootstrap.servers': BOOTSTRAP})

NUM_DEVICES = 120
devices = [f"machine-{i}" for i in range(1, NUM_DEVICES+1)]

def make_reading(device_id):
    temp = random.gauss(60, 5)
    vib = random.gauss(3.0, 0.5)
    current = random.gauss(10, 1)
    load = random.uniform(20, 95)

    # вероятность аномалии 1%
    if random.random() < 0.01:
        temp += random.uniform(40, 80)
        vib += random.uniform(5, 15)
        current += random.uniform(5, 15)

    return {
        "device_id": device_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature": round(temp, 2),
        "vibration": round(vib, 2),
        "current": round(current, 2),
        "load": round(load, 2)
    }

print(f"Starting IoT data generator for {NUM_DEVICES} devices...")
while True:
    for d in devices:
        msg = make_reading(d)
        p.produce(TOPIC, json.dumps(msg).encode("utf-8"))
    p.poll(0)
    time.sleep(0.2)     # ~500 msg/sec
