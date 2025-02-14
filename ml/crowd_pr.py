from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Crowd Prediction API is Running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        B = data.get("ticket_bookings", 0)  
        C = data.get("cancellations", 0)  
        W = data.get("weather_factor", 1.0)  
        E = data.get("special_event", 0)  
        T = 1 if data.get("time_slot", "Morning") in ["Morning", "Evening"] else 0  

        crowd_level = (B - C) * W * (1 + 0.3 * E + 0.2 * T)
        
        return jsonify({"predicted_crowd": round(crowd_level)})
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
