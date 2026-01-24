import pandas as pd
import joblib
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf, col, from_json
from pyspark.sql.types import FloatType, StructType, StructField, StringType, DoubleType

# -------------------------------
# 1. Загружаем модель
# -------------------------------
model = joblib.load("fraud_model.pkl")

def predict_fraud(amount):
    # Модель обучена только на amount
    df_input = pd.DataFrame([{"amount": amount}])
    return float(model.predict(df_input)[0])

# UDF для Spark
predict_udf = udf(predict_fraud, FloatType())

# -------------------------------
# 2. Создаём Spark сессию
# -------------------------------
spark = SparkSession.builder.appName("FraudDetectionStream").getOrCreate()
spark.sparkContext.setLogLevel("WARN")

# -------------------------------
# 3. Схема транзакций (JSON)
# -------------------------------
schema = StructType([
    StructField("transaction_id", StringType()),
    StructField("user_id", StringType()),
    StructField("amount", DoubleType()),
    StructField("category", StringType()),
    StructField("timestamp", StringType()),
    StructField("location", StringType()),
    StructField("device", StringType())
])

# -------------------------------
# 4. Чтение потока из Kafka
# -------------------------------
df = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "transactions")
    .option("startingOffsets", "latest")
    .load()
)

# Kafka хранит данные в value как bytes -> приводим к строке
df = df.selectExpr("CAST(value AS STRING)")

# Разбираем JSON в колонки
df = df.withColumn("jsonData", from_json(col("value"), schema)) \
       .select("jsonData.*")

# -------------------------------
# 5. Применяем модель
# -------------------------------
fraud_df = df.withColumn("fraud_flag", predict_udf(col("amount")))

# -------------------------------
# 6. Пишем подозрительные транзакции в консоль
# -------------------------------
query = (
    fraud_df.filter(col("fraud_flag") == 1)
    .select("transaction_id", "user_id", "amount", "category",
            "timestamp", "location", "device", "fraud_flag")
    .writeStream
    .format("console")
    .outputMode("append")
    .start()
)

query.awaitTermination()
