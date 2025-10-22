from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#Use destructuring import to get the router object to avoid attribute problems
from apps.api.routes.manifest import router as manifest_router

app = FastAPI(
    title="CityFlow API",
    description="Backend service for CityFlow portal",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Temporarily released during the development phase
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register
app.include_router(manifest_router)

@app.get("/ping")
def ping():
    return {"msg": "pong"}

@app.get("/forecast")
def forecast(city: str, category: str):
    """
    Temporary fake data interface: used for front-end testing prediction functions
    """
    return {
        "city": city,
        "category": category,
        "prediction": 123,
        "interval": [100, 150],
        "confidence": "medium",
        "advice": "It's a bit crowded in the morning, so it's recommended to go after 10:30"
    }