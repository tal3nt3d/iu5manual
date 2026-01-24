import json
import os
import pandas as pd
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from pyspark.ml.recommendation import ALS
from pyspark.ml.feature import StringIndexer

# --- Настройка Spark ---
spark = SparkSession.builder.appName("RecommendationStream").getOrCreate()
spark.sparkContext.setLogLevel("WARN")

# --- Схема данных из Kafka ---
schema = StructType([
    StructField("user_id", StringType(), True),
    StructField("product_id", StringType(), True),
    StructField("rating", IntegerType(), True)
])

# --- Чтение потока из Kafka ---
df_raw = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "user_events")
    .option("startingOffsets", "latest")
    .load()
)

df = df_raw.selectExpr("CAST(value AS STRING) as value")

# --- Парсинг JSON ---
df = df.withColumn("parsed", from_json(col("value"), schema)) \
       .select(col("parsed.user_id"), col("parsed.product_id"), col("parsed.rating"))

# --- Индексация пользователей и товаров ---
user_indexer = StringIndexer(inputCol="user_id", outputCol="user_idx", handleInvalid="skip")
product_indexer = StringIndexer(inputCol="product_id", outputCol="product_idx", handleInvalid="skip")

historical_df = spark.read.csv("recommendation_train.csv", header=True, inferSchema=True)
historical_df = historical_df.withColumn("rating", col("rating").cast(IntegerType()))
user_indexer_model = user_indexer.fit(historical_df)
product_indexer_model = product_indexer.fit(historical_df)

df_indexed = user_indexer_model.transform(df)
df_indexed = product_indexer_model.transform(df_indexed)
df_indexed = df_indexed.withColumn("rating", col("rating").cast(IntegerType()))

# --- ALS ---
als = ALS(
    userCol="user_idx",
    itemCol="product_idx",
    ratingCol="rating",
    rank=10,
    maxIter=5,
    regParam=0.01,
    coldStartStrategy="drop"
)

# --- Путь к директории с рекомендациями ---
RECOMMENDATION_DIR = "recommendation_parquet"
os.makedirs(RECOMMENDATION_DIR, exist_ok=True)

# --- Функция для сохранения рекомендаций ---
def save_recommendations(recs_df, batch_df):
    """
    Сохраняем рекомендации в директорию, добавляя каждый батч.
    recs_df: Spark DataFrame с колонками user_idx и recommendations
    batch_df: Spark DataFrame с колонкой user_id для сопоставления индекса с оригинальным ID
    """
    # Сопоставление user_idx -> user_id
    mapping_df = batch_df.select("user_id", "user_idx").distinct()
    recs_with_user_id = recs_df.join(mapping_df, on="user_idx", how="left")

    # Преобразуем в Pandas
    recs_pd = recs_with_user_id.toPandas()

    # Преобразуем список Struct в словарь
    recs_pd["recommendations"] = recs_pd["recommendations"].apply(
        lambda rec_list: [{"item": r["product_idx"], "rating": r["rating"]} for r in rec_list]
    )

    # Сохраняем батч в директорию Parquet с режимом append
    recs_pd[["user_id", "recommendations"]].to_parquet(
        os.path.join(RECOMMENDATION_DIR, f"batch_{pd.Timestamp.now().timestamp()}.parquet"),
        index=False
    )
    print("[INFO] Рекомендации сохранены в директорию recommendation_parquet")

# --- Функция обучения на каждом батче ---
def train_als(batch_df, batch_id):
    if batch_df.rdd.isEmpty():
        print(f"[Batch {batch_id}] пустой, пропускаем")
        return
    model = als.fit(batch_df)
    recs = model.recommendForAllUsers(5)
    print(f"[Batch {batch_id}] рекомендации:")
    recs.show(truncate=False)
    save_recommendations(recs, batch_df)

# --- Запуск стриминга ---
query = (
    df_indexed.writeStream
    .foreachBatch(train_als)
    .outputMode("update")
    .start()
)

query.awaitTermination()
