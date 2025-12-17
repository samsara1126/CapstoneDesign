# AI 생성 가짜 뉴스 및 이미지 판별 시스템
**AI-Generated Fake News & Image Detection System**

> **경희대학교 컴퓨터공학과 2025-2 캡스톤디자인 프로젝트** > 누구나 쉽게 접근 가능한 웹 기반의 AI 생성 콘텐츠 진위 판별 서비스

## 프로젝트 소개 (Project Overview)
최근 생성형 AI(GANs, Diffusion Models 등)의 급격한 발전으로 정교한 가짜 뉴스와 딥페이크 이미지가 확산됨에 따라 사회적 문제가 대두되고 있습니다. 본 프로젝트는 전문적인 AI 지식이 없는 일반 사용자도 웹을 통해 손쉽게 **뉴스 기사와 이미지의 진위 여부를 판별할 수 있는 시스템**을 구축하는 것을 목표로 합니다.

* **웹사이트:** [https://capstone-design-476702.web.app/](https://capstone-design-476702.web.app/)
* **개발 기간:** 2025-2 학기

## 주요 기능 (Key Features)
* **이미지 판별 (Image Detection):** 사람의 얼굴 특징을 분석하여 실제 인물인지 AI가 생성한 인물인지 판별 (Deepfake 탐지).
* **텍스트 판별 (Text Detection):** 뉴스 기사 등의 텍스트 패턴과 분포를 분석하여 AI 생성 여부(Real/Fake) 판별.
* **웹 기반 서비스:** 별도의 설치 없이 웹 브라우저에서 바로 파일 업로드 및 결과 확인 가능.

## 시스템 아키텍처 (System Architecture)
Google Cloud Platform(GCP)을 기반으로 확장성과 비용 효율성을 고려한 서버리스(Serverless) 및 하이브리드 아키텍처를 설계했습니다.

### Infrastructure
* **Frontend:** React/Vue 기반의 웹 인터페이스.
* **Backend:** Python FastAPI (비동기 처리 지원).
* **Deployment:** Google Cloud Run (Serverless, Auto-scaling 적용).
* **Storage:** Google Cloud Storage (Data Lake & Model Registry).
* **Training:** Google Vertex AI (이미지) / Google Colab (텍스트).

## AI 모델 상세 (AI Models)

### 1. 이미지 판별 모델 (Image Detection)
* **Model:** **EfficientNet-B0** (Pre-trained on ImageNet).
* **Method:** Transfer Learning & Fine-tuning.
* **Dataset:** CIFAKE 및 Kaggle 얼굴 데이터셋 (Real/Fake 50:50 균형 조정).
* **Preprocessing:** 224x224 리사이징 및 정규화(Normalization).

### 2. 텍스트 판별 모델 (Text Detection)
* **Model:** **GAN (Generative Adversarial Network) Discriminator**.
* **Rationale:** BERT와 같은 거대 모델 대비 경량화되어 있으며, 기계적 텍스트 생성 패턴(분포 차이) 탐지에 효과적임.
* **Method:** TF-IDF 벡터화 후 GAN 판별자를 통해 Real/Fake 구분.
* **Deployment:** CPU 환경(Cloud Run)에서도 빠른 추론이 가능하도록 경량화 배포.

## 성능 및 결과 (Performance)
* **이미지 모델 정확도:** Test Accuracy 약 **94%** 달성.
* **정밀도/재현율:** FAKE/REAL 클래스 모두 0.94~0.95 수준의 균형 잡힌 성능 확보.
* **비용 최적화:** 텍스트/이미지 처리 파이프라인 분리 및 서버리스 도입으로 유휴 비용 최소화.

## 추후 개선 사항 (Future Improvements)
현재 시스템은 이미지와 텍스트를 독립적으로 판별하고 있어, 두 모달리티 간의 정합성(Consistency) 검증 기능을 추가하여 맥락적 조작까지 탐지하는 것을 목표로 합니다.
* **범용 이미지 판별로의 도메인 확장 (Domain Expansion to General Images):**
    * **현재 한계:** 현재 모델은 딥페이크 탐지를 목적으로 사람의 얼굴(Face) 특징과 아티팩트를 집중적으로 학습하여, 얼굴이 없는 풍경, 사물, 예술 작품 등의 이미지에 대해서는 판별 성능이 제한적일 수 있습니다.
    * **개선 방향:** 인물 사진뿐만 아니라 다양한 도메인(풍경, 사물 등)의 AI 생성 이미지 데이터셋을 추가 확보 및 학습시켜, 특정 피사체에 국한되지 않는 범용적인 이미지 위변조 판별 시스템으로 확장할 계획입니다.

* **이미지 모델 경량화 및 서버리스 전환 (Cost Optimization & Serverless Migration):**
    * **현재 한계:** 텍스트 모델은 Cloud Run을 통해 비용 효율적으로 운영되는 반면, 이미지 모델(Vertex AI)은 고성능 인스턴스 상시 가동이 필요하여 유지 비용이 높고 GPU 할당량 제약이 있습니다.
    * **개선 방향:** 이미지 모델에 양자화 및 경량화 기법을 적용하여 모델 사이즈를 줄이고, 텍스트 모델과 동일하게 Cloud Run 환경으로 완전 이관함으로써 트래픽이 없을 때의 유휴 비용을 제거할 계획입니다.

* **멀티모달 정합성 검증 (Multimodal Consistency Verification):**
    * **현재 한계:** 이미지와 텍스트를 각각 독립적으로 판별하기 때문에, '진짜 이미지'에 '거짓 텍스트'를 결합하여 맥락을 왜곡하는 경우 탐지가 어렵습니다.
    * **개선 방향:** 이미지 내의 객체나 상황 정보가 텍스트의 내용과 문맥적으로 일치하는지 비교 분석하는 기능을 도입할 예정입니다.
* **팩트 체크 기능 보완 (Fact Checking):**
    * **현재 한계:** 현재 텍스트 모델은 '누가 작성했는가(AI vs 인간)'를 판별하는 데 특화되어 있어, 내용의 사실 여부(Truthfulness) 자체는 검증하지 않습니다.
    * **개선 방향:** 생성 여부뿐만 아니라 텍스트 내용의 사실 관계 및 사회적 맥락의 진위까지 검증할 수 있는 로직에 대한 추가 연구가 필요합니다.
