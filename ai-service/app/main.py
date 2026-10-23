"""
CareerPilot AI — Python FastAPI RAG Service
Exposes Retrieval-Augmented Generation endpoints powered by Qdrant Vector Database.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.rag import index_session_documents, query_rag, qdrant, COLLECTION_NAME
from app.knowledge_base import AMAZON_LEADERSHIP_PRINCIPLES, TECHNICAL_PATTERNS

app = FastAPI(
    title="CareerPilot AI - RAG & Vector Service",
    description="Qdrant-powered Retrieval-Augmented Generation for Amazon Alexa+ Track",
    version="0.1.0",
)

# Enable CORS for Express backend (3001) and Frontend (5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ──

class IndexRequest(BaseModel):
    session_id: str = Field(..., description="Unique session ID")
    resume_text: str = Field(..., description="Plain text of candidate resume")
    job_text: str = Field(..., description="Plain text of target job posting")

class QueryRequest(BaseModel):
    session_id: str = Field(..., description="Session ID to retrieve context from")
    query: str = Field(..., description="Candidate or interviewer question")
    top_k: int = Field(default=4, ge=1, le=10)

class InterviewQuestionsRequest(BaseModel):
    session_id: str
    topic: Optional[str] = None


# ── Endpoints ──

@app.get("/health")
def health_check():
    collection_info = qdrant.get_collection(COLLECTION_NAME)
    return {
        "status": "ok",
        "service": "careerpilot-ai-rag",
        "vector_database": "Qdrant (Embedded In-Memory)",
        "points_count": collection_info.points_count,
        "collection": COLLECTION_NAME,
    }


@app.post("/rag/index")
def index_documents(req: IndexRequest):
    """
    Chunks and indexes candidate resume and job description into Qdrant.
    """
    if not req.resume_text.strip() or not req.job_text.strip():
        raise HTTPException(status_code=400, detail="resume_text and job_text must not be empty.")

    result = index_session_documents(
        session_id=req.session_id,
        resume_text=req.resume_text,
        job_text=req.job_text,
    )
    return {
        "success": True,
        "message": f"Successfully indexed into Qdrant vector database for session {req.session_id}",
        "data": result,
    }


@app.post("/rag/query")
def query_context(req: QueryRequest):
    """
    Retrieves grounded context from Qdrant vector database and generates citations.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query must not be empty.")

    rag_result = query_rag(
        session_id=req.session_id,
        query=req.query,
        top_k=req.top_k,
    )
    return rag_result


@app.post("/rag/interview-questions")
def generate_interview_questions(req: InterviewQuestionsRequest):
    """
    Generates targeted STAR-method behavioral and technical questions grounded in candidate gaps.
    """
    topic_query = req.topic if req.topic else "architecture design cloud"
    rag_result = query_rag(session_id=req.session_id, query=topic_query, top_k=3)

    questions = []
    for lp in AMAZON_LEADERSHIP_PRINCIPLES[:3]:
        questions.append({
            "principle": lp["name"],
            "type": "behavioral_star",
            "question": lp["sample_question"],
            "evaluation_criteria": lp["eval_criteria"],
            "targeted_resume_context": rag_result["citations"][0]["snippet"] if rag_result["citations"] else "General engineering background",
        })

    return {
        "session_id": req.session_id,
        "topic": req.topic,
        "questions": questions,
        "grounding_citations": rag_result["citations"],
    }


@app.get("/rag/amazon-lps")
def get_amazon_leadership_principles():
    """Returns official Amazon Leadership Principles and evaluation criteria."""
    return {
        "count": len(AMAZON_LEADERSHIP_PRINCIPLES),
        "leadership_principles": AMAZON_LEADERSHIP_PRINCIPLES,
        "technical_patterns": TECHNICAL_PATTERNS,
    }
