import { useState } from "react";
import { ArrowUpRight, LoaderCircle, Sparkles } from "lucide-react";
import { predictSentiment } from "./services/api";

const examples = [
  "A warm, beautifully made film with a brilliant ending.",
  "The story was slow, predictable, and difficult to finish.",
];

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const review = text.trim();
    if (!review || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await predictSentiment(review));
    } catch (requestError) {
      setError("Could not reach the prediction service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isPositive = result?.sentiment?.toLowerCase() === "positive";
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  return (
    <main className="page-shell">
      <nav className="topbar">
        <a className="brand" href="/" aria-label="Sentiment home">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>sentiment<span className="brand-dot">.</span></span>
        </a>
        <span className="model-note">DISTILBERT · IMDB</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">MOVIE REVIEW ANALYSIS</p>
        <h1>What does your review <em>feel</em> like?</h1>
        <p className="intro">Paste a review below and our fine-tuned model will read between the lines.</p>
      </section>

      <section className="analyzer-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="review">YOUR REVIEW</label>
          <textarea
            id="review"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="This movie made me laugh, cry, and want to watch it all over again..."
            maxLength={2000}
            disabled={loading}
          />
          <div className="form-footer">
            <span className="character-count">{text.length} / 2000</span>
            <button type="submit" disabled={!text.trim() || loading}>
              {loading ? <><LoaderCircle className="spin" size={17} /> Analyzing</> : <>Analyze sentiment <ArrowUpRight size={17} /></>}
            </button>
          </div>
        </form>

        <div className="examples">
          <span>TRY AN EXAMPLE</span>
          {examples.map((example) => (
            <button key={example} type="button" onClick={() => { setText(example); setResult(null); setError(""); }}>
              “{example}”
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error-message" role="alert">{error}</p>}

      {result && (
        <section className={`result-card ${isPositive ? "positive" : "negative"}`} aria-live="polite">
          <div>
            <p className="eyebrow">MODEL VERDICT</p>
            <h2>{result.sentiment}</h2>
            <p className="result-caption">The review reads as {result.sentiment.toLowerCase()}.</p>
          </div>
          <div className="confidence">
            <span>CONFIDENCE</span>
            <strong>{confidence}%</strong>
          </div>
        </section>
      )}

      <footer>Fine-tuned on the IMDb dataset · Built with React, FastAPI &amp; DistilBERT</footer>
    </main>
  );
}

export default App;
