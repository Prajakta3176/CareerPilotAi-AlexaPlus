"""
RAG Engine with Qdrant Vector Database
Handles chunking, vector embeddings, Qdrant index management, and grounded generation.
"""
import os
import re
import math
import hashlib
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from app.knowledge_base import AMAZON_LEADERSHIP_PRINCIPLES, TECHNICAL_PATTERNS

VECTOR_DIM = 128
COLLECTION_NAME = "careerpilot_rag"

# Initialize Qdrant in-memory client (embedded mode - no Docker needed)
qdrant = QdrantClient(":memory:")

# Initialize collection if not exists
try:
    qdrant.get_collection(COLLECTION_NAME)
except Exception:
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=VECTOR_DIM, distance=Distance.COSINE),
    )


def compute_deterministic_vector(text: str, dim: int = VECTOR_DIM) -> List[float]:
    """
    Computes a normalized dense vector using term hashing & semantic feature weights.
    Provides zero-cost, zero-latency vector embeddings without requiring external API keys.
    If an OpenAI key is set, this can optionally be routed to OpenAI text-embedding-3-small.
    """
    tokens = re.findall(r'\b[a-zA-Z0-9_\-\.]{2,}\b', text.lower())
    vector = [0.0] * dim

    if not tokens:
        return [0.0] * dim

    # Key tech domain weightings for higher semantic precision
    domain_weights = {
        "aws": 3.0, "serverless": 2.5, "lambda": 2.5, "sqs": 2.5, "dynamodb": 2.5,
        "redis": 2.5, "cache": 2.0, "latency": 2.0, "p99": 2.5, "docker": 2.0,
        "react": 2.0, "typescript": 2.0, "node": 2.0, "graphql": 2.0, "rest": 1.8,
        "ownership": 2.5, "customer": 2.5, "deep": 2.0, "results": 2.0, "simplify": 2.0
    }

    for token in tokens:
        weight = domain_weights.get(token, 1.0)
        h = int(hashlib.md5(token.encode('utf-8')).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if ((h >> 8) % 2 == 0) else -1.0
        vector[idx] += sign * weight

    # Normalize vector to unit length for cosine similarity
    norm = math.sqrt(sum(v * v for v in vector))
    if norm > 0:
        vector = [v / norm for v in vector]

    return vector


def chunk_document(text: str, source_type: str, session_id: str) -> List[Dict[str, Any]]:
    """
    Intelligently splits resumes or job postings into semantic section chunks.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    chunks: List[Dict[str, Any]] = []

    current_title = "General Overview"
    current_content: List[str] = []

    # Section header indicators
    header_pattern = re.compile(
        r'^(experience|education|skills|core skills|projects|summary|qualifications|responsibilities|requirements|about the role)',
        re.IGNORECASE
    )

    for line in lines:
        if header_pattern.match(line) or (len(line) < 40 and line.endswith(':')):
            if current_content:
                chunk_text = ' '.join(current_content)
                if len(chunk_text) > 20:
                    chunks.append({
                        "session_id": session_id,
                        "source": source_type,
                        "title": current_title,
                        "content": chunk_text
                    })
                current_content = []
            current_title = line.rstrip(':')
        else:
            current_content.append(line)

    if current_content:
        chunks.append({
            "session_id": session_id,
            "source": source_type,
            "title": current_title,
            "content": ' '.join(current_content)
        })

    # If no structured sections were found, split into paragraphs
    if not chunks and text.strip():
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        for idx, p in enumerate(paragraphs):
            chunks.append({
                "session_id": session_id,
                "source": source_type,
                "title": f"Section {idx + 1}",
                "content": p
            })

    return chunks


def index_knowledge_base():
    """Seeds the Qdrant index with Amazon Leadership Principles and Technical Patterns."""
    points = []
    
    for lp in AMAZON_LEADERSHIP_PRINCIPLES:
        content = f"{lp['name']}: {lp['description']} Question: {lp['sample_question']} Criteria: {lp['eval_criteria']}"
        vector = compute_deterministic_vector(content)
        point_id = int(hashlib.md5(f"lp_{lp['id']}".encode()).hexdigest()[:8], 16)
        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "session_id": "global_kb",
                    "source": "amazon_lp",
                    "title": lp["name"],
                    "content": content,
                    "metadata": lp
                }
            )
        )

    for tp in TECHNICAL_PATTERNS:
        content = f"Technical Architecture: {tp['topic']}. Core: {', '.join(tp['core_concepts'])}. Tip: {tp['interview_tip']}"
        vector = compute_deterministic_vector(content)
        point_id = int(hashlib.md5(f"tp_{tp['topic']}".encode()).hexdigest()[:8], 16)
        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "session_id": "global_kb",
                    "source": "technical_pattern",
                    "title": tp["topic"],
                    "content": content,
                    "metadata": tp
                }
            )
        )

    if points:
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)


# Seed KB on module load
index_knowledge_base()


def index_session_documents(session_id: str, resume_text: str, job_text: str) -> Dict[str, Any]:
    """
    Chunks candidate resume & job description and stores them in Qdrant vector index.
    """
    resume_chunks = chunk_document(resume_text, "resume", session_id)
    job_chunks = chunk_document(job_text, "job", session_id)

    all_chunks = resume_chunks + job_chunks
    points: List[PointStruct] = []

    for idx, chunk in enumerate(all_chunks):
        vector = compute_deterministic_vector(chunk["content"])
        point_id = int(hashlib.md5(f"{session_id}_{chunk['source']}_{idx}".encode()).hexdigest()[:8], 16)
        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "session_id": session_id,
                    "source": chunk["source"],
                    "title": chunk["title"],
                    "content": chunk["content"],
                }
            )
        )

    if points:
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)

    return {
        "session_id": session_id,
        "total_chunks_indexed": len(points),
        "resume_chunks_count": len(resume_chunks),
        "job_chunks_count": len(job_chunks),
    }


def query_rag(session_id: str, query: str, top_k: int = 4) -> Dict[str, Any]:
    """
    Performs retrieval-augmented query over candidate's resume, job posting, and Amazon KB.
    """
    query_vector = compute_deterministic_vector(query)

    # Search in candidate's session and global KB
    search_result = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        query_filter=Filter(
            should=[
                FieldCondition(key="session_id", match=MatchValue(value=session_id)),
                FieldCondition(key="session_id", match=MatchValue(value="global_kb")),
            ]
        ),
        limit=top_k,
    )

    retrieved = [
        {
            "source": hit.payload.get("source"),
            "title": hit.payload.get("title"),
            "content": hit.payload.get("content"),
            "score": round(hit.score, 3),
        }
        for hit in search_result.points
    ]

    resume_hits = [r for r in retrieved if r["source"] == "resume"]
    job_hits = [r for r in retrieved if r["source"] == "job"]
    kb_hits = [r for r in retrieved if r["source"] in ("amazon_lp", "technical_pattern")]
    lp_hits = [r for r in kb_hits if r["source"] == "amazon_lp"]
    tech_hits = [r for r in kb_hits if r["source"] == "technical_pattern"]

    # Synthesize grounded answer
    answer_parts = []
    citations = []

    if kb_hits and not resume_hits and not job_hits:
        # No documents uploaded yet — give a standalone knowledge-base answer
        hit = kb_hits[0]
        meta = None
        for h in search_result.points:
            if h.payload.get("title") == hit["title"]:
                meta = h.payload.get("metadata") or {}
                break

        if lp_hits:
            lp_meta = meta or {}
            answer_parts.append(
                f"**{hit['title']}** (Amazon Leadership Principle)\n\n"
                f"{lp_meta.get('description', hit['content'][:300])}\n\n"
                f"**Sample interview question:** {lp_meta.get('sample_question', 'Tell me about a time you demonstrated this principle.')}\n\n"
                f"**Evaluation criteria:** {lp_meta.get('eval_criteria', 'STAR structure, specificity, outcome focus.')}"
            )
        else:
            tp_meta = meta or {}
            answer_parts.append(
                f"**{hit['title']}** (Technical Architecture)\n\n"
                f"Core concepts: {', '.join(tp_meta.get('core_concepts', [hit['content'][:200]]))}\n\n"
                f"**Interview tip:** {tp_meta.get('interview_tip', hit['content'][-200:])}"
            )
        citations.append({"type": "knowledge_base", "topic": hit["title"], "snippet": hit["content"][:200]})

    else:
        # Documents are loaded — ground the answer in resume + job context
        if resume_hits:
            answer_parts.append(f"**From your Resume ({resume_hits[0]['title']}):**\n\"{resume_hits[0]['content'][:280]}...\"")
            citations.append({"type": "resume", "section": resume_hits[0]["title"], "snippet": resume_hits[0]["content"][:180]})

        if job_hits:
            answer_parts.append(f"**Target Job Expectation ({job_hits[0]['title']}):**\n\"{job_hits[0]['content'][:280]}...\"")
            citations.append({"type": "job", "section": job_hits[0]["title"], "snippet": job_hits[0]["content"][:180]})

        if kb_hits:
            answer_parts.append(f"**Interview Strategy Tip ({kb_hits[0]['title']}):**\n{kb_hits[0]['content'][:250]}")
            citations.append({"type": "knowledge_base", "topic": kb_hits[0]["title"], "snippet": kb_hits[0]["content"][:180]})

    if not answer_parts:
        summary_answer = (
            "I searched my knowledge base but could not find a strong match. "
            "Try asking about: AWS Lambda, DynamoDB, Redis caching, Amazon Leadership Principles, "
            "skill gaps, or your study plan."
        )
    else:
        summary_answer = "\n\n".join(answer_parts)

    # Build sources list for frontend to detect context type
    sources = list({r["source"] for r in retrieved})

    return {
        "query": query,
        "answer": summary_answer,
        "citations": citations,
        "sources": sources,
        "retrieved_count": len(retrieved),
        "chunks": retrieved
    }
