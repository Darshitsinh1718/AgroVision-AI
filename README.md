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
