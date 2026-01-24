from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, window, from_unixtime
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, LongType
import logging

# --- Настройка логирования ---
logging.basicConfig(level=logging.INFO)

# --- Spark ---
spark = SparkSession.builder.appName("ITMonitoringStream").getOrCreate()
spark.sparkContext.setLogLevel("WARN")

# --- Схема ---
schema = StructType([
    StructField("host", StringType(), True),
    StructField("metric_type", StringType(), True),
    StructField("value", IntegerType(), True),
    StructField("timestamp", LongType(), True)
])

# --- Чтение из Kafka ---
df_raw = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "it_metrics") \
    .option("startingOffsets", "latest") \
    .load()

df = df_raw.selectExpr("CAST(value AS STRING) as value")
df = df.withColumn("parsed", from_json(col("value"), schema)) \
       .select("parsed.*")
df = df.withColumn("timestamp_ts", from_unixtime(col("timestamp")).cast("timestamp"))

# --- Агрегация метрик за окно 10 секунд ---
agg_df = df.withWatermark("timestamp_ts", "20 seconds") \
    .groupBy(
        "host", "metric_type",
        window(col("timestamp_ts"), "10 seconds")
    ).avg("value").withColumnRenamed("avg(value)", "avg_value")


# --- Сохранение в Parquet ---
def save_batch(batch_df, batch_id):
    if batch_df.rdd.isEmpty():
        logging.info(f"[Batch {batch_id}] пустой, пропускаем")
        return
    try:
        batch_df.write.mode("append").parquet("metrics_parquet")
        logging.info(f"[Batch {batch_id}] сохранено {batch_df.count()} записей")
    except Exception as e:
        logging.error(f"[Batch {batch_id}] ошибка сохранения: {e}")

# --- Запуск стриминга ---
query = agg_df.writeStream.foreachBatch(save_batch).outputMode("update").start()
query.awaitTermination()
