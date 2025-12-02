import os
import base64
import joblib
import numpy as np
import torch
import torch.nn as nn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import aiplatform
from contextlib import asynccontextmanager

# --- 설정 ---
GCP_PROJECT_ID = "capstone-design-476702"
GCP_REGION = "us-central1"
VERTEX_ENDPOINT_ID = "9027772216808308736"

MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "D.pth")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")
MAX_FEATURES = 2000

# --- AI 텍스트 판별 모델 클래스 정의 ---
class Discriminator(nn.Module):
    def __init__(self, feature_dim):
        super().__init__()
        self.feature_extractor = nn.Sequential(
            nn.Linear(feature_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
        )
        self.adv_head = nn.Sequential(nn.Linear(256, 1), nn.Sigmoid())
        self.cls_head = nn.Sequential(nn.Linear(256, 1), nn.Sigmoid())

    def forward(self, x):
        h = self.feature_extractor(x)
        validity = self.adv_head(h)
        cls = self.cls_head(h)
        return validity, cls

# --- FastAPI 앱 생명주기(Lifespan) 설정 ---
app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- 서버 시작 시 실행될 코드 ---
    # 1. 이미지 판별 모델 초기화
    aiplatform.init(project=GCP_PROJECT_ID, location=GCP_REGION)
    app_state['image_endpoint'] = aiplatform.Endpoint(VERTEX_ENDPOINT_ID)
    
    # 2. 텍스트 판별 모델 로드
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    text_model = Discriminator(feature_dim=MAX_FEATURES).to(device)
    text_model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    text_model.eval()
    
    app_state['text_model'] = text_model
    app_state['text_vectorizer'] = joblib.load(VECTORIZER_PATH)
    app_state['device'] = device
    
    print("AI Models initialized.")
    yield
    # --- 서버 종료 시 실행될 코드 ---
    app_state.clear()
    print("AI Models cleaned up.")

# --- FastAPI 앱 생성 및 미들웨어 설정 ---
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API 엔드포인트 정의 ---
class TextItem(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "AI Detector Backend is running!"}

@app.post("/predict")
async def handle_image_prediction(file: UploadFile = File(...)):
    """/predict 주소로 이미지 파일(POST)이 오면 이미지 AI 생성 여부를 판별합니다."""
    try:
        image_bytes = await file.read()
        encoded_content = base64.b64encode(image_bytes).decode("utf-8")
        instances = [{"content": encoded_content}]
        
        prediction_response = app_state['image_endpoint'].predict(instances=instances)
        prediction = prediction_response.predictions[0]
        confidences = prediction['confidences']
        display_names = prediction['displayNames']
        
        max_confidence_index = confidences.index(max(confidences))
        label = display_names[max_confidence_index]
        confidence = confidences[max_confidence_index]
        
        is_ai_flag = label.lower() in ["fake", "ai"]
        return_label = "fake" if is_ai_flag else "real"
        
        return {
            "is_ai": is_ai_flag,
            "confidence": confidence,
            "label": return_label
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/predict/text")
async def handle_text_prediction(item: TextItem):
    """/predict/text 주소로 텍스트(POST)가 오면 텍스트 AI 생성 여부를 판별합니다."""
    try:
        text = item.text
        vectorizer = app_state['text_vectorizer']
        model = app_state['text_model']
        device = app_state['device']
        
        vec = vectorizer.transform([text]).toarray()
        feat = torch.from_numpy(vec).float().to(device)
        
        with torch.no_grad():
            _, cls_out = model(feat)
            prob_ai = cls_out.item()
        
        is_ai_flag = prob_ai > 0.5
        return_label = "fake" if is_ai_flag else "real"
        
        return {
            "is_ai": is_ai_flag,
            "confidence": prob_ai if is_ai_flag else 1 - prob_ai,
            "label": return_label
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")