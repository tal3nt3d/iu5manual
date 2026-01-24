from flask import Flask, request, jsonify
import pandas as pd
import os
import glob

app = Flask(__name__)

# Директория с Parquet-файлами рекомендаций
RECOMMENDATION_DIR = "recommendation_parquet"

# --- Загрузка всех рекомендаций из директории ---
def load_recommendations():
    if not os.path.exists(RECOMMENDATION_DIR):
        return pd.DataFrame(columns=["user_id", "recommendations"])

    # Находим все файлы Parquet в директории
    parquet_files = glob.glob(os.path.join(RECOMMENDATION_DIR, "*.parquet"))
    if not parquet_files:
        return pd.DataFrame(columns=["user_id", "recommendations"])

    # Читаем и объединяем все файлы
    try:
        df_list = [pd.read_parquet(f) for f in parquet_files]
        df = pd.concat(df_list, ignore_index=True)

        # Проверка на корректные колонки
        if "user_id" not in df.columns or "recommendations" not in df.columns:
            return pd.DataFrame(columns=["user_id", "recommendations"])

        return df
    except Exception as e:
        print(f"[ERROR] Ошибка при чтении Parquet: {e}")
        return pd.DataFrame(columns=["user_id", "recommendations"])

# --- Эндпоинт для рекомендаций ---
@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = request.args.get("user_id")
    df = load_recommendations()

    if df.empty:
        return jsonify({"user_id": user_id, "recommendations": []})

    # Ищем рекомендации для конкретного user_id
    rec_row = df[df.user_id.astype(str) == str(user_id)]
    if rec_row.empty:
        return jsonify({"user_id": user_id, "recommendations": []})

    rec_list = rec_row.iloc[0]["recommendations"]

    # Преобразуем список словарей в список item_id
    rec_items = [r["item"] for r in rec_list]
    return jsonify({"user_id": user_id, "recommendations": rec_items})

# --- Запуск сервера ---
if __name__ == "__main__":
    app.run(port=5001)
