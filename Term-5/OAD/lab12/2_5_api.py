from flask import Flask, request, jsonify
import pandas as pd
import os
import glob
import time

app = Flask(__name__)
METRICS_DIR = "metrics_parquet"

def load_metrics():
    if not os.path.exists(METRICS_DIR):
        return pd.DataFrame(columns=["host", "metric_type", "avg_value", "window"])
    
    files = glob.glob(os.path.join(METRICS_DIR, "*.parquet"))
    if not files:
        return pd.DataFrame(columns=["host", "metric_type", "avg_value", "window"])

    try:
        dfs = [pd.read_parquet(f) for f in files]
        return pd.concat(dfs, ignore_index=True)
    except Exception as e:
        print(f"[ERROR] чтение метрик: {e}")
        return pd.DataFrame(columns=["host", "metric_type", "avg_value", "window"])

@app.route("/metrics", methods=["GET"])
def metrics():
    import datetime

    host = request.args.get("host")
    metric_type = request.args.get("metric_type")

    df = load_metrics()

    if df.empty:
        return jsonify([])

    if host:
        df = df[df.host == host]
    if metric_type:
        df = df[df.metric_type == metric_type]

    df = df.copy()

    def convert(val):
        if val is None:
            return None
        # Если это INT (наносекунды) → преобразуем
        if isinstance(val, int):
            # parquet timestamp в ns → переводим в секунды
            return datetime.datetime.utcfromtimestamp(val / 1_000_000_000).isoformat()
        # Если это pandas Timestamp → превращаем в строку
        if hasattr(val, "isoformat"):
            return val.isoformat()
        return None

    df["start"] = df["window"].apply(lambda w: convert(w["start"]))
    df["end"]   = df["window"].apply(lambda w: convert(w["end"]))

    df = df.drop(columns=["window"])

    return jsonify(df.to_dict(orient="records"))



if __name__ == "__main__":
    app.run(port=5002)
