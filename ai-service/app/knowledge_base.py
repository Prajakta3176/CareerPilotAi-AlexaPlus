"""
Knowledge Base: Amazon Leadership Principles & Technical Interview Patterns
Grounding reference for RAG retrieval and candidate evaluation.
"""

AMAZON_LEADERSHIP_PRINCIPLES = [
    {
        "id": "customer_obsession",
        "name": "Customer Obsession",
        "description": "Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.",
        "sample_question": "Tell me about a time when you had to make a tough architectural trade-off to protect customer experience or latency.",
        "eval_criteria": "Demonstrates prioritizing customer reliability, P99 latency, or accessibility over short-term shortcuts."
    },
    {
        "id": "ownership",
        "name": "Ownership",
        "description": "Leaders are owners. They think long term and don’t sacrifice long-term value for short-term results. They never say 'that's not my job'.",
        "sample_question": "Describe a scenario where you identified a critical flaw or technical debt in a codebase outside your immediate ownership and fixed it.",
        "eval_criteria": "Proactively tackled legacy code, improved testing infrastructure, or stepped up during production outages."
    },
    {
        "id": "invent_and_simplify",
        "name": "Invent and Simplify",
        "description": "Leaders expect and require innovation and invention from their teams and always find ways to simplify.",
        "sample_question": "Give an example of a complex technical process or architecture that you radically simplified.",
        "eval_criteria": "Replaced convoluted microservices or fragile workflows with elegant, maintainable solutions."
    },
    {
        "id": "learn_and_be_curious",
        "name": "Learn and Be Curious",
        "description": "Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities and act to explore them.",
        "sample_question": "Tell me about a new technology or architecture pattern you learned independently and successfully introduced to your team.",
        "eval_criteria": "Self-driven exploration of distributed systems, new languages (Rust/Go/TypeScript), or modern cloud paradigms."
    },
    {
        "id": "dive_deep",
        "name": "Dive Deep",
        "description": "Leaders operate at all levels, stay connected to the details, audit frequently, and are skeptical when metrics and anecdotes differ.",
        "sample_question": "Walk me through the most challenging production bug or performance bottleneck you debugged down to root cause.",
        "eval_criteria": "Root cause analysis via distributed tracing, profiling memory leaks, inspecting database query plans, or network socket exhaustion."
    },
    {
        "id": "bias_for_action",
        "name": "Bias for Action",
        "description": "Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking.",
        "sample_question": "Tell me about a situation where you had to make a high-stakes technical decision with incomplete information.",
        "eval_criteria": "Recognized two-way door decisions, shipped an MVP or feature flag, gathered telemetry, and iterated rapidly."
    },
    {
        "id": "deliver_results",
        "name": "Deliver Results",
        "description": "Leaders focus on the key inputs for their business and deliver them with the right quality and in a timely fashion.",
        "sample_question": "Describe a project with tight deadlines where you successfully delivered critical business outcomes despite obstacles.",
        "eval_criteria": "Metrics-driven delivery: boosted performance by X%, delivered ahead of schedule, or maintained 99.99% uptime."
    }
]

TECHNICAL_PATTERNS = [
    {
        "topic": "AWS Serverless & Event-Driven Architecture",
        "core_concepts": ["AWS Lambda", "SQS", "SNS", "EventBridge", "Dead Letter Queues (DLQ)", "Idempotency"],
        "interview_tip": "Always mention idempotency keys when processing queue messages to prevent duplicate processing during retries."
    },
    {
        "topic": "Distributed Caching with Redis",
        "core_concepts": ["Cache-Aside", "Write-Through", "Cache Stampede / Dog-piling", "XFetch", "Eviction Policies (LRU/LFU)"],
        "interview_tip": "Explain how distributed mutex locking or probabilistic early expiration prevents hundreds of simultaneous database queries on cache expiry."
    },
    {
        "topic": "DynamoDB Single-Table Design",
        "core_concepts": ["Partition Keys (PK)", "Sort Keys (SK)", "Global Secondary Indexes (GSI)", "Hot Partitioning", "Query vs Scan"],
        "interview_tip": "Emphasize high cardinality partition keys to avoid thermal throttling across storage partitions."
    },
    {
        "topic": "Resilience & High Throughput",
        "core_concepts": ["Circuit Breakers", "Exponential Backoff with Jitter", "Rate Limiting", "P99 Latency SLIs/SLOs"],
        "interview_tip": "Highlight that averages hide tail latency; P99 shows the actual experience of users during peak traffic."
    }
]
