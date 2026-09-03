"""FastAPI application entry point."""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model import predict_sentiment
from app.schemas import SentimentRequest, SentimentResponse

app = FastAPI()

# Allow the Vercel-hosted frontend to call this API from the browser.
# Set FRONTEND_URL in Render to restrict this to the final Vercel domain.
frontend_url = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_url.split(",")],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def root():
    return {
        "message": "Sentiment API is running"
    }


@app.post("/predict", response_model=SentimentResponse)
def predict(request: SentimentRequest):
    sentiment, confidence = predict_sentiment(request.text)

    return {
        "sentiment": sentiment,
        "confidence": confidence
    }
