"""Model loading and sentiment prediction logic."""
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_NAME = "pranavchauhann/sentiment-distilbert-imdb"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)


def predict_sentiment(text: str):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(outputs.logits, dim=1)

    predicted_class = torch.argmax(probabilities, dim=1).item()
    confidence = probabilities[0][predicted_class].item()

    sentiment = "Positive" if predicted_class == 1 else "Negative"

    return sentiment, confidence