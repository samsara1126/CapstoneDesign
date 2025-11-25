# Frontend - AI Detector (English)

This is a React + Vite frontend for the AI-based synthetic news & media detector demo.
It provides pages to submit news text or upload media and shows demo visualization for results.

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## Notes

- The frontend expects a backend API at `http://127.0.0.1:5000/api/news` for text detection
  and `http://127.0.0.1:5000/api/media` for media detection. For testing you can mock responses.
- Tailwind CSS usage requires building with PostCSS; the project includes sample config files.
