"""FastAPI application entry point."""
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {
        "message": "Sentiment API is running"
    }