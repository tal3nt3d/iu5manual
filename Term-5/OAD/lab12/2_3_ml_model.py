import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Тренируем модель один раз
df = pd.read_csv("fraud_train.csv")
X = df[["amount"]]
y = df["is_fraud"]
model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "fraud_model.pkl")
