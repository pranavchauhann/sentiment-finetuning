"""Model loading and sentiment prediction logic."""
import os
from huggingface_hub import InferenceClient

MODEL_NAME = "pranavchauhann/sentiment-distilbert-imdb"

client = InferenceClient(
    provider="hf-inference",
    api_key=os.environ["HF_TOKEN"]
)

def predict_sentiment(text: str):
    result = client.text_classification(
        text,
        model=MODEL_NAME
    )

    best = max(result, key=lambda x: x.score)

    sentiment = best.label
    confidence = best.score

    return sentiment, confidence