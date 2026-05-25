# AgroVision AI 🌱

AgroVision AI is a smart farming platform that I built to help farmers make better decisions using machine learning, deep learning, live market prices, and weather-based insights.

The main idea behind this project is simple: a farmer should be able to enter their farm details once and then get useful suggestions like which crop to grow, whether a plant may be diseased, what the current mandi prices are, and what actions they should take next.

---

## Why I Built This

Many farmers depend on experience, local advice, and market uncertainty while making decisions. I wanted to build a practical system where data science and machine learning can support farming decisions in a simple way.

This project helped me understand how ML models, APIs, backend services, and frontend dashboards can work together in a real-world application.

---

## Main Features

### 1. Crop Recommendation using Machine Learning

I trained a Random Forest model to recommend suitable crops based on soil and climate parameters:

- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- pH
- Rainfall

The model predicts the most suitable crop and returns the result through a FastAPI service.

---

### 2. Crop Disease Detection using Deep Learning

I also worked on a deep learning-based crop disease detection module where a farmer can upload a leaf image and get disease prediction results.

The goal of this feature is to help farmers identify possible plant diseases early and take action before crop damage increases.

---

### 3. Live Mandi Price Integration

The platform uses the Data.gov.in Agmarknet API to fetch live mandi/market price data.

Farmers can check crop prices and compare market information before deciding where and when to sell their produce.

---

### 4. Farmer Profile Based Personalization

During signup, the farmer enters important information such as:

- State
- District
- Taluka
- Village
- Farm area
- Soil type
- Primary crop
- Irrigation type
- Season

This profile is used to personalize the dashboard, crop advice, market suggestions, and farming recommendations.

---

### 5. Smart Farmer Dashboard

The dashboard gives a quick overview of the farmer's profile and important insights.

It shows:

- Farm profile completion
- Primary crop
- Soil type
- Irrigation method
- Season
- Nearest market yard
- AI-based farming suggestions
- Quick access to crop advisor, disease scan, weather, and market prices

---

## Tech Stack

### Machine Learning / Data Science

- Python
- Scikit-learn
- Random Forest Classifier
- Pandas
- NumPy
- Deep Learning for plant disease detection

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- FastAPI for ML model serving

### Frontend

- React.js
- Vite
- Tailwind CSS

### APIs

- Data.gov.in Agmarknet API
- Weather API

---

## Project Architecture

```text
AgroVision AI
│
├── Frontend React App
│   ├── Login / Signup
│   ├── Dashboard
│   ├── Crop Advisor
│   ├── Disease Detection
│   ├── Market Prices
│   └── Settings
│
├── Express Backend
│   ├── Authentication
│   ├── Farmer Profile
│   ├── Market APIs
│   ├── Weather APIs
│   └── Recommendation APIs
│
├── FastAPI ML Service
│   ├── Crop Recommendation Model
│   └── Disease Detection Model
│
└── MongoDB Database
    └── Farmer profiles and application data
```

---

## Machine Learning Model

For crop recommendation, I used a Random Forest classifier.

The model takes soil and environmental features as input and predicts the crop that is most suitable for the given conditions.

Example input:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 21,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 200
}
```

Example output:

```json
{
  "recommended_crop": "rice",
  "confidence": 92.4
}
```

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Darshitsinh1718/AgroVision-AI.git
cd AgroVision-AI
```

---

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

### 4. Start ML Service

```bash
cd ML
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

ML service runs on:

```text
http://localhost:8000
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
DATA_GOV_API_KEY=your_data_gov_api_key
ML_SERVICE_URL=http://localhost:8000
```

Do not push real `.env` files to GitHub.

---

## What I Learned

While building this project, I learned:

- How to train and use ML models in a real application
- How to serve ML models using FastAPI
- How to connect a Python ML service with a Node.js backend
- How to use external APIs for live agricultural data
- How to build authentication and farmer profile management
- How to design a personalized dashboard using user data

---

## Future Improvements

Some improvements I plan to add:

- Improve crop disease detection accuracy with a larger dataset
- Add more regional languages like Gujarati and Hindi
- Add SMS or WhatsApp alerts for mandi prices and weather
- Add crop yield prediction
- Add fertilizer recommendation based on soil condition
- Deploy the full system online

---

## Project Status

This project is currently under active development.

The main ML-based crop recommendation, disease detection workflow, farmer profile, dashboard, and mandi price modules are implemented.
