import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

export default function MediaDetector() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await axios.post("https://backend-ai-detector-1072427918203.us-central1.run.app/predict", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      <h2 className="text-2xl font-bold mb-4">Media Detector</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded mt-3 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload & Detect'}
      </button>
      {result && (
        <ResultCard title="Detection Result">
          {(() => {
            // The confidence to display is always the model's confidence in its own prediction.
            const confidencePercent = Math.round(result.confidence * 100);

                        let displayLabel;
            
                        // Determine the final display label based on the original label and confidence.
                        if (confidencePercent <= 50) {
                          displayLabel = "판별 불가";
                        } else {
                          // High confidence, trust the original label.
                          if (result.label === "fake") {
                            displayLabel = "AI 생성 이미지";
                          } else { // 'real'
                            displayLabel = "실제 사진";
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
