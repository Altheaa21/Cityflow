# 🌆 CityFlow Portal  
*A Prompt-based POI Foot Traffic Forecasting System*

---

## 🧭 Overview

**CityFlow Portal** is an interactive web system for predicting **Point-of-Interest (POI) foot traffic** across multiple cities and categories.  

It integrates a **FastAPI backend** (serving Hugging Face T5-based forecasting models) with a **React + Tailwind frontend**, allowing users to query models in natural language and visualize predictions.

The portal is part of the **PromptCast research project**, exploring prompt-based time series forecasting and cross-city generalization.

---

## 🧱 Project Structure

```
CityFlow/
│
├── apps/
│   ├── api/                     # FastAPI backend
│   │   ├── main.py              # Entry point for API (includes CORS, routers)
│   │   ├── .env                 # Environment variables (HF_TOKEN, cache paths)
│   │   ├── data/
│   │   │   └── manifest/manifest.json   # City/category configuration for frontend
│   │   └── routes/
│   │       ├── forecast.py      # Core inference endpoint `/forecast`
│   │       ├── manifest.py      # Serves `/v1/manifest` for city/category list
│   │       └── __init__.py
│   │
│   └── web/                     # React frontend
│       ├── src/
│       │   ├── pages/           # Main UI pages (PredictPage)
│       │   ├── components/      # UI components (MessageList, PredictBox, NavBar)
│       │   ├── api/             # Client functions for backend calls
│       │   └── main.jsx         # App entry
│       └── public/              # Static assets
│
├── .hf_cache/                   # Local Hugging Face model cache (ignored)
├── .gitignore                   # Ignore cache, env, and build files
└── README.md
```

---

## 🧠 Key Technologies

| Layer | Technologies |
|-------|---------------|
| **Backend** | Python, FastAPI, Transformers (Hugging Face), Torch |
| **Frontend** | React, Tailwind CSS, Vite |
| **Model** | T5-small finetuned per category (Bar, CoffeeShop, MetroStation) |
| **Data Source** | Massive-STEPS POI check-in dataset |
| **Deployment (Planned)** | Render / Hugging Face Space (backend), Vercel (frontend) |

---

## ⚙️ Setup & Usage

### 1️⃣ Create .env inside apps/api/:

```
HF_TOKEN=your_huggingface_token
HF_HOME=.hf_cache
HF_HUB_CACHE=.hf_cache
```

### 2️⃣ Run Backend:

From project root:
```
PYTHONPATH=. uvicorn apps.api.main:app --reload --port 8000
```

### 3️⃣ Run Frontend:

```
cd apps/web
npm install
npm run dev
```
---

## 📊 Features
✅ Model selection (Baseline / Finetune)

✅ Dynamic city/category via manifest

✅ Real-time inference display

✅ Local model caching for faster load

🟡 (Planned) Confidence interval and suggestion generation (via LLaMA)

🟡 (Planned) Cloud deployment (Render + Vercel)