"""FastAPI application entry point."""
from fastapi import FastAPI

from app.model import predict_sentiment
from app.schemas import SentimentRequest, SentimentResponse

app = FastAPI()


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