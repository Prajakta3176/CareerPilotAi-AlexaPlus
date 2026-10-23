# CareerPilot AI — Python RAG & Vector Service 🧠

Retrieval-Augmented Generation (RAG) engine powered by **FastAPI** and **Qdrant Vector Database**.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Run the Service (Port 8000)

```bash
uvicorn app.main:app --port 8000 --reload
```

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 📋 Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check Qdrant collection status and points count |
| `POST` | `/rag/index` | Chunk & embed candidate resume + job posting into Qdrant |
| `POST` | `/rag/query` | Retrieve relevant chunks and generate grounded citations |
| `POST` | `/rag/interview-questions` | Generate tailored Amazon STAR interview questions |
| `GET` | `/rag/amazon-lps` | List Amazon Leadership Principles and technical criteria |
