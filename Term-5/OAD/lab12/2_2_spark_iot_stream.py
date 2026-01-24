import os
os.environ["JAVA_HOME"] = "/usr/lib/jvm/java-11-openjdk-amd64"
os.environ["SPARK_HOME"] = "/home/tal3nt3d/oad/lab12/spark-3.5.7-bin-hadoop3"
os.environ["PATH"] = os.environ["SPARK_HOME"] + "/bin:" + os.environ["JAVA_HOME"] + "/bin:" + os.environ["PATH"]

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *


spark = (
    SparkSession.builder
    .appName("IoT_Streaming")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("WARN")

# Схема данных IoT
schema = StructType([
    StructField("device_id", StringType()),
    StructField("timestamp", StringType()),
    StructField("temperature", DoubleType()),
    StructField("vibration", DoubleType()),
    StructField("current", DoubleType()),
    StructField("load", DoubleType())
])

# Чтение потока из Kafka
raw = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "iot-sensors")
    .option("startingOffsets", "latest")
    .load()
)

# value -> string
json_df = raw.selectExpr("CAST(value AS STRING)")

# JSON -> колонки
data = json_df.select(from_json(col("value"), schema).alias("d")).select("d.*")

# timestamp в нормальный тип
data = data.withColumn("ts", to_timestamp("timestamp"))

# Окно 1 минута, обновление каждые 10 секунд
windowed = (
    data
    .withWatermark("ts", "1 minute")
    .groupBy(window(col("ts"), "60 seconds", "10 seconds"), col("device_id"))
    .agg(
        avg("temperature").alias("avg_temp"),
        avg("vibration").alias("avg_vib"),
        avg("current").alias("avg_cur"),
        max("temperature").alias("max_temp")
    )
)

# Вывод в консоль (для отладки)
query1 = (
    windowed
    .writeStream
    .format("console")
    .outputMode("append")
    .option("truncate", False)
    .start()
)

# Обнаружение аномалий
anomalies = (
    data
    .filter(col("temperature") > 100)
    .filter(col("vibration") > 6)
    .select("device_id", "temperature", "vibration", "current", "ts")
)

query2 = (
    anomalies
    .writeStream
    .format("console")
    .outputMode("append")
    .option("truncate", False)
    .start()
)

query1.awaitTermination()
query2.awaitTermination()
