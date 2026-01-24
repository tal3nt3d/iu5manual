from pyspark.sql.types import StructType, StructField, StringType, DoubleType

transaction_schema = StructType([
    StructField("transaction_id", StringType()),
    StructField("user_id", StringType()),
    StructField("amount", DoubleType()),
    StructField("timestamp", StringType()),
    StructField("location", StringType()),
    StructField("device", StringType()),
    StructField("category", StringType())
])
