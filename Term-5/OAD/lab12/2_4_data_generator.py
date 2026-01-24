import pandas as pd
import random
import time
from uuid import uuid4

users = [f"user_{i}" for i in range(1, 21)]
products = [f"product_{i}" for i in range(1, 31)]

rows = []
for _ in range(500):  # 500 исторических событий
    user_id = random.choice(users)
    product_id = random.choice(products)
    rating = random.randint(1, 5)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    rows.append({
        "user_id": user_id,
        "product_id": product_id,
        "rating": rating,
        "timestamp": timestamp
    })

df = pd.DataFrame(rows)
df.to_csv("recommendation_train.csv", index=False)
print("recommendation_train.csv создано")
