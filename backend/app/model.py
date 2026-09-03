"""Model loading and sentiment prediction logic."""
import os
from huggingface_hub import InferenceClient

MODEL_NAME = "pranavchauhann/sentiment-distilbert-imdb"

client = InferenceClient(
    model=MODEL_NAME,
    token=os.getenv("HF_TOKEN")
)


def predict_sentiment(text: str):
    result = client.text_classification(text)

    best = max(result, key=lambda x: x.score)

    sentiment = best.label
    confidence = best.score

    return sentiment, confidence