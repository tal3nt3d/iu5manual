import json
import time
import random
from uuid import uuid4
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

users = [f"user_{i}" for i in range(1, 11)]
locations = ["NY", "LA", "TX", "FL", "NV"]
devices = ["mobile", "desktop", "tablet"]
categories = ["electronics", "clothing", "books", "toys"]

def generate_transaction():
    return {
        "transaction_id": str(uuid4()),
        "user_id": random.choice(users),
        "amount": round(random.uniform(1, 2000), 2),
        "category": random.choice(categories),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "location": random.choice(locations),
        "device": random.choice(devices)
    }

if __name__ == "__main__":
    while True:
        txn = generate_transaction()
        producer.send("transactions", txn)
        print(f"Sent: {txn}")
        time.sleep(3)  # 1 транзакция в 3 секунды
