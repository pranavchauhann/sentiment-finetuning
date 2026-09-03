const API_URL = import.meta.env.VITE_API_URL || "https://sentiment-finetuning-api.onrender.com";

export async function predictSentiment(text) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Prediction failed (${response.status})`);
  }

  return response.json();
}
