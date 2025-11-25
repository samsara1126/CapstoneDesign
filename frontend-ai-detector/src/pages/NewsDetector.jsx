import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

export default function NewsDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5000/api/news", { text });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Error contacting backend. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">News Detector</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded"
        rows="6"
        placeholder="Paste news text here..."
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3 disabled:opacity-60"
        disabled={loading || !text.trim()}
      >
        {loading ? 'Detecting...' : 'Detect'}
      </button>
      {result && (
        <ResultCard title="Detection Result">
          <p>Label: {String(result.truth)}</p>
          <p>Confidence: {result.confidence}%</p>
          <p>Reason: {result.reason}</p>
        </ResultCard>
      )}
    </div>
  );
}
