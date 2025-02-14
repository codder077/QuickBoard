from fastapi import FastAPI
import numpy as np
import joblib
import xgboost as xgb  # Using a pretrained XGBoost model

# Load models and preprocessors
rf_model = joblib.load("random_forest_model.pkl")  # Pretrained Random Forest
xgb_model = joblib.load("xgboost_model.pkl")  # Pretrained XGBoost model
encoder = joblib.load("onehot_encoder.pkl")  # Pretrained OneHotEncoder
scaler = joblib.load("scaler.pkl")  # Pretrained Scaler

app = FastAPI()

@app.post("/predict")
async def predict(data: dict):
    try:
        # Extract numerical features
        num_features = [[data.get("ticket_bookings", 0),
                         data.get("cancellations", 0),
                         data.get("weather_factor", 1.0),
                         data.get("special_event", 0)]]

        # Process categorical features
        cat_features = [[data.get("time_slot", "Morning"),
                         data.get("day_of_week", "Monday"),
                         data.get("station", "Station A")]]
        
        # Transform features using the pretrained encoders
        num_scaled = scaler.transform(num_features)
        cat_encoded = encoder.transform(cat_features)
        processed_data = np.hstack((num_scaled, cat_encoded))

        # Predictions using pretrained models
        rf_pred = int(rf_model.predict(processed_data)[0])
        xgb_pred = float(xgb_model.predict(processed_data)[0])  # Using pretrained XGBoost

        return {"random_forest_prediction": rf_pred, "xgboost_prediction": round(xgb_pred, 2)}

    except Exception as e:
        return {"error": str(e)}
