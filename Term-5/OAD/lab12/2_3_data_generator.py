import csv
import random
import time
from uuid import uuid4

# Настройки генерации
users = [f"user_{i}" for i in range(1, 21)]
locations = ["US", "DE", "FR", "RU", "CN"]
devices = ["mobile", "desktop", "tablet"]
categories = ["electronics", "clothing", "books", "gaming", "home"]

# Определяем вероятность мошенничества по простым правилам
def is_fraud(amount, category, device):
    # Пример простых правил: большие суммы + редкая категория + мобильное устройство
    if amount > 1500 and category in ["electronics", "gaming"] and device == "mobile":
        return 1
    if amount > 1000 and category == "electronics":
        return 1
    return 0

# Генерация CSV
with open("fraud_train.csv", mode="w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=[
        "transaction_id", "user_id", "amount", "category", 
        "timestamp", "location", "device", "is_fraud"
    ])
    writer.writeheader()

    for _ in range(5000):  # количество строк
        transaction = {
            "transaction_id": str(uuid4()),
            "user_id": random.choice(users),
            "amount": round(random.uniform(1, 2000), 2),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "location": random.choice(locations),
            "device": random.choice(devices),
            "category": random.choice(categories)
        }
        transaction["is_fraud"] = is_fraud(transaction["amount"], transaction["category"], transaction["device"])
        writer.writerow(transaction)

print("fraud_train.csv сгенерирован!")
