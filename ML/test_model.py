import joblib
import pandas as pd

model = joblib.load("crop_model.pkl")
encoder = joblib.load("label_encoder.pkl")

sample = pd.DataFrame([{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.8,
    "humidity": 82,
    "ph": 6.5,
    "rainfall": 202
}])

prediction = model.predict(sample)
crop = encoder.inverse_transform(prediction)

print("Predicted crop:", crop[0])