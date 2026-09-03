"""Low-memory sentiment inference using the bundled INT8 ONNX model."""

from pathlib import Path

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer


MODEL_DIR = Path(__file__).resolve().parent.parent / "model"
MODEL_PATH = MODEL_DIR / "model.onnx"
TOKENIZER_PATH = MODEL_DIR / "tokenizer.json"
LABELS = {0: "Negative", 1: "Positive"}


# Both objects are loaded once per worker, instead of once per request.
tokenizer = Tokenizer.from_file(str(TOKENIZER_PATH))
tokenizer.enable_truncation(max_length=512)
session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"],
)


def predict_sentiment(text: str):
    """Return the predicted IMDb sentiment and its softmax confidence."""
    encoding = tokenizer.encode(text)
    inputs = {
        "input_ids": np.asarray([encoding.ids], dtype=np.int64),
        "attention_mask": np.asarray([encoding.attention_mask], dtype=np.int64),
    }

    output = session.run(None, inputs)[0][0]
    probabilities = np.exp(output - np.max(output))
    probabilities /= probabilities.sum()
    predicted_class = int(np.argmax(probabilities))

    return LABELS[predicted_class], float(probabilities[predicted_class])
