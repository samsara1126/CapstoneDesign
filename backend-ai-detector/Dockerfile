# 1. 파이썬 3.10 버전 환경을 가져옵니다.
FROM python:3.10-slim

# 2. 컨테이너 안의 /app 폴더에서 작업할 것입니다.
WORKDIR /app

# 3. 아까 만든 부품 목록(requirements.txt)을 복사합니다.
COPY requirements.txt .

# 4. 부품 목록대로 도구들을 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 5. 우리 코드 전체(main.py 등)를 /app 폴더로 복사합니다.
COPY . .

# 6. 이 컨테이너가 실행될 때 자동으로 이 명령어를 실행시킵니다.
# (Cloud Run이 지정해주는 $PORT 번호로 FastAPI 서버를 켭니다.)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]