from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import pandas as pd

app = FastAPI(title="AgroVision Crop Recommendation ML API")

model = joblib.load("crop_model.pkl")
encoder = joblib.load("label_encoder.pkl")


class CropInput(BaseModel):
    N: float = Field(..., ge=0)
    P: float = Field(..., ge=0)
    K: float = Field(..., ge=0)
    temperature: float = Field(..., ge=0)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Crop Recommendation ML API is running",
        "model": "RandomForest Crop Recommendation",
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "ok",
        "message": "ML service is healthy",
    }


@app.post("/predict")
def predict_crop(data: CropInput):
    sample = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall,
    }])

    print("\n==============================")
    print("INPUT RECEIVED BY ML MODEL")
    print(sample)
    print("==============================")

    prediction = model.predict(sample)
    probabilities = model.predict_proba(sample)[0]

    crop = encoder.inverse_transform(prediction)[0]
    confidence = round(float(max(probabilities)) * 100, 2)

    classes = encoder.inverse_transform(range(len(probabilities)))

    top_predictions = sorted(
        [
            {
                "crop": str(classes[i]),
                "confidence": round(float(probabilities[i]) * 100, 2),
            }
            for i in range(len(probabilities))
        ],
        key=lambda x: x["confidence"],
        reverse=True
    )[:5]

    print("PREDICTED CROP:", crop)
    print("CONFIDENCE:", confidence)
    print("TOP 5:", top_predictions)
    print("==============================\n")

    return {
        "success": True,
        "recommended_crop": crop,
        "confidence": confidence,
        "top_predictions": top_predictions,
        "received_input": {
            "N": data.N,
            "P": data.P,
            "K": data.K,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
            "rainfall": data.rainfall,
        }
    }