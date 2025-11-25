import os
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import aiplatform

GCP_PROJECT_ID = "capstone-design-476702"
GCP_REGION = "us-central1"
VERTEX_ENDPOINT_ID = "9027772216808308736"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aiplatform.init(project=GCP_PROJECT_ID, location=GCP_REGION)
endpoint = aiplatform.Endpoint(VERTEX_ENDPOINT_ID)

@app.get("/")
def read_root():
    # 서버가 살아있는지 확인하는 용도
    return {"status": "AI Detector Backend is running!"}

@app.post("/predict")
async def handle_prediction(file: UploadFile = File(...)):
    """
    /predict 주소로 이미지 파일(POST)이 오면 이 함수가 실행됩니다.
    """
    try:
        image_bytes = await file.read()

        encoded_content = base64.b64encode(image_bytes).decode("utf-8")

        instances = [{"content": encoded_content}]

        prediction_response = endpoint.predict(instances=instances)

        prediction = prediction_response.predictions[0]
        max_confidence_index = prediction['confidences'].index(max(prediction['confidences']))
        label = prediction['displayNames'][max_confidence_index]
        confidence = prediction['confidences'][max_confidence_index]

        return {
            "is_ai": True if label == "ai" else False,
            "confidence": confidence,
            "label": label
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")