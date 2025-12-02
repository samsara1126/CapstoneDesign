import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

const API_URL = "https://backend-ai-detector-1072427918203.us-central1.run.app/predict/text";

export default function NewsDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      setError("");
      setResult(null);
      
      const res = await axios.post(API_URL, { text });
      
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Error contacting the backend. Please check the API server status and URL.');
      alert('Error contacting the backend. Please check the API server status and URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Text Detector</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
        rows="8"
        placeholder="Enter text to analyze here..."
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full sm:w-auto disabled:opacity-60 hover:bg-blue-700 transition-colors"
        disabled={loading || !text.trim()}
      >
        {loading ? 'Analyzing...' : 'Analyze Text'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {result && (
        <ResultCard title="Detection Result">
          {(() => {
            const confidencePercent = Math.round(result.confidence * 100);
            let displayLabel;

            if (confidencePercent <= 50) {
              displayLabel = "판별 불가";
            } else {
              if (result.label === "fake") {
                displayLabel = "AI 생성 텍스트";
              } else { // 'real'
                displayLabel = "사람이 작성한 텍스트";
              }
            }
            return (
              <>
                <p>판별 결과: {displayLabel}</p>
                <p>모델 신뢰도: {confidencePercent}%</p>
              </>
            );
          })()}
        </ResultCard>
      )}
    </div>
  );
}
