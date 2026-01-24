import json
import time
import random
from uuid import uuid4
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

users = [f"user_{i}" for i in range(1, 21)]
products = [f"product_{i}" for i in range(1, 51)]
categories = ["electronics", "clothing", "books", "toys"]

def generate_event():
    return {
        "event_id": str(uuid4()),
        "user_id": random.choice(users),
        "product_id": random.choice(products),
        "category": random.choice(categories),
        "timestamp": int(time.time()),
        "action": random.choice(["view", "cart", "purchase"]),
        "rating": random.randint(1, 5)
    }

if __name__ == "__main__":
    while True:
        event = generate_event()
        producer.send("user_events", event)
        print(f"Sent: {event}")
        time.sleep(1)  # ~1 событие/сек
