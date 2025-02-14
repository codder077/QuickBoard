from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, "trains.csv")

try:
    data = pd.read_csv(csv_path)
    print("CSV Loaded Successfully!")
except FileNotFoundError:
    print(f"Error: CSV file not found at {csv_path}")
    data = pd.DataFrame(columns=["train_ID", "delay"])

def estimate_delay(train_ID):
    train_data = data[data['train_ID'].astype(str) == str(train_ID)]
    if not train_data.empty:
        if 'delay' in train_data.columns:
            valid_delays = train_data['delay'].dropna()
            return max(0, valid_delays.mean()) if not valid_delays.empty else 0
    return 0

def probability_missing_train_B(train_ID1, train_ID2):
    delay_train_A = estimate_delay(train_ID1)
    delay_train_B = estimate_delay(train_ID2)
    if delay_train_A > 0 and delay_train_B > 0:
        percentage = ((delay_train_A - delay_train_B) / delay_train_A) * 100
        return max(0, percentage)
    return 0

@app.route('/output', methods=['POST'])
def output():
    try:
        data = request.get_json()
        if not data or "D1" not in data or not isinstance(data["D1"], list) or len(data["D1"]) < 2:
            return jsonify({"error": "Invalid input. Expected JSON with 'D1' as a list of two train IDs."}), 400
        train_ID1, train_ID2 = data["D1"][:2]
        expected_delay1 = estimate_delay(train_ID1)
        expected_delay2 = estimate_delay(train_ID2)
        predicted_probability = probability_missing_train_B(train_ID1, train_ID2)
        response = {
            "train_ID1_delay": expected_delay1,
            "train_ID2_delay": expected_delay2,
            "probability_missing_train_B": predicted_probability
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
