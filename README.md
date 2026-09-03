# Sentiment Fine-Tuning with DistilBERT

Fine-tuning a pretrained DistilBERT model for binary sentiment classification using the IMDb movie review dataset.

## Project Goal

Classify movie reviews into:

- `0` = Negative
- `1` = Positive

## Dataset

IMDb Movie Reviews Dataset from Hugging Face.

- Training: 22,500 reviews
- Validation: 2,500 reviews
- Test: 25,000 reviews

## Model

`distilbert-base-uncased`

## Training Configuration

- Epochs: 2
- Batch Size: 16
- Learning Rate: 2e-5

## Results

- Validation Accuracy: 92.20%
- Test Accuracy: 93.17%
- Test Loss: 0.2232

## Before vs After Fine-Tuning

Before fine-tuning:

- Positive Probability: 53.48%

After fine-tuning:

- Positive Probability: 99.53%

## Tools

- Google Colab
- PyTorch
- Hugging Face Transformers
- Hugging Face Datasets
- GitHub

## Model Flow

Text Review  
↓  
Tokenizer  
↓  
Token IDs + Attention Mask  
↓  
DistilBERT  
↓  
Classification Head  
↓  
Positive / Negative
