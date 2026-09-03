import { useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Frown,
  LoaderCircle,
  RotateCcw,
  Smile,
  Sparkles,
} from "lucide-react";
import { predictSentiment } from "./services/api";

const examples = [
  {
    label: "Positive",
    text: "A warm, beautifully made film with a brilliant ending.",
  },
  {
    label: "Negative",
    text: "The story was slow, predictable, and difficult to finish.",
  },
];

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze(review) {
    if (!review || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await predictSentiment(review));
    } catch {
      setError("The analyzer could not be reached. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    analyze(text.trim());
  }

  function useExample(example) {
    setText(example);
    setResult(null);
    setError("");
  }

  function resetAnalyzer() {
    setText("");
    setResult(null);
    setError("");
  }

  const isPositive = result?.sentiment?.toLowerCase() === "positive";
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="Sentiment home">
          <span className="brand-mark"><Sparkles size={16} strokeWidth={2.2} /></span>
          <span>sentiment<span className="brand-dot">.</span></span>
        </a>

        <div className="nav-meta">
          <span className="status-pill"><i /> API LIVE</span>
          <span className="model-note">DISTILBERT · IMDB</span>
        </div>
      </nav>

      <section className="workspace">
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> AI-POWERED SENTIMENT</p>
          <h1>Read the feeling behind <em>every review.</em></h1>
          <p className="intro">
            Turn unstructured movie reviews into a clear sentiment signal with
            a DistilBERT model fine-tuned on IMDb.
          </p>

          <dl className="model-stats">
            <div><dt>93.17%</dt><dd>Test accuracy</dd></div>
            <div><dt>67M</dt><dd>Parameters</dd></div>
            <div><dt>INT8</dt><dd>Optimized model</dd></div>
          </dl>

          <div className="how-it-works">
            <BrainCircuit size={19} />
            <p><strong>How it works</strong><span>The model compares language patterns learned from thousands of labeled movie reviews.</span></p>
          </div>
        </div>

        <div className="analyzer-column">
          <section className="analyzer-card">
            <div className="card-heading">
              <div>
                <span className="step-number">02</span>
                <h2>Analyze a review</h2>
              </div>
              {text && (
                <button className="reset-button" type="button" onClick={resetAnalyzer}>
                  <RotateCcw size={13} /> Clear
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="review">REVIEW TEXT</label>
              <div className="textarea-wrap">
                <textarea
                  id="review"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="This movie made me laugh, cry, and want to watch it all over again..."
                  maxLength={2000}
                  disabled={loading}
                />
                <span className="character-count">{text.length} / 2000</span>
              </div>

              <button className="analyze-button" type="submit" disabled={!text.trim() || loading}>
                {loading ? (
                  <><LoaderCircle className="spin" size={18} /> Reading the review...</>
                ) : (
                  <>Analyze sentiment <ArrowUpRight size={18} /></>
                )}
              </button>
            </form>
          </section>

          <div className="examples">
            <p>NOT SURE WHAT TO WRITE? TRY ONE.</p>
            <div className="example-grid">
              {examples.map((example) => (
                <button key={example.label} type="button" onClick={() => useExample(example.text)}>
                  <span className={example.label.toLowerCase()}>{example.label}</span>
                  <q>{example.text}</q>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-message" role="alert">{error}</p>}

          {result && (
            <section className={`result-card ${isPositive ? "positive" : "negative"}`} aria-live="polite">
              <div className="verdict-icon">
                {isPositive ? <Smile size={28} /> : <Frown size={28} />}
              </div>
              <div className="verdict-copy">
                <p>MODEL VERDICT</p>
                <h2>{result.sentiment}</h2>
                <span>This review reads as {result.sentiment.toLowerCase()}.</span>
              </div>
              <div className="confidence-meter" style={{ "--score": `${confidence * 3.6}deg` }}>
                <div><strong>{confidence}%</strong><span>confidence</span></div>
              </div>
              <p className="confidence-note">Confidence reflects this prediction, not guaranteed accuracy.</p>
            </section>
          )}
        </div>
      </section>

      <footer>
        <span>Fine-tuned on the IMDb dataset</span>
        <span>React · FastAPI · ONNX · DistilBERT</span>
      </footer>
    </main>
  );
}

export default App;
