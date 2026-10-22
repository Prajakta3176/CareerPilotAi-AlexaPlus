import { repository } from "../storage/repository";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

export type Quiz = {
  quizId: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
};

export type QuizSubmission = {
  questionId: string;
  selectedOption: string;
  correctOption: string;
};

export type QuizResult = {
  quizId: string;
  topic: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  passed: boolean;
  feedback: string;
  adaptedTopic?: string;
  newPlanDayAdded?: number;
};

const quizRepository: Record<string, QuizQuestion[]> = {
  'AWS': [
    {
      id: 'q1',
      question: 'In an event-driven system using AWS SQS and Lambda, how do you handle messages that continually fail to process?',
      options: [
        'A: Configure a Dead-Letter Queue (DLQ) with a maxReceiveCount threshold',
        'B: Infinite retry with zero delay',
        'C: Discard the message immediately to prevent queue blocking',
        'D: Increase Lambda timeout to 15 minutes',
      ],
      correctOption: 'A: Configure a Dead-Letter Queue (DLQ) with a maxReceiveCount threshold',
      explanation: 'DLQs isolate poisonous messages so normal queue processing is not blocked, enabling debugging.',
    },
    {
      id: 'q2',
      question: 'When architecting serverless Lambda functions, what is the best practice to avoid latency issues caused by cold starts?',
      options: [
        'A: Provisioned Concurrency and minimizing deployment bundle size',
        'B: Always writing Lambda in C++ only',
        'C: Setting memory to minimum 128MB',
        'D: Polling the function every 10 milliseconds synchronously',
      ],
      correctOption: 'A: Provisioned Concurrency and minimizing deployment bundle size',
      explanation: 'Provisioned Concurrency keeps execution environments initialized and ready to respond immediately.',
    },
    {
      id: 'q3',
      question: 'Which key distribution choice is critical in Amazon DynamoDB to avoid "hot partitions"?',
      options: [
        'A: High-cardinality Partition Key with uniform access patterns',
        'B: Using a constant string for Partition Key',
        'C: Sorting only by creation date with a static partition',
        'D: Creating 50 global secondary indexes on the same attribute',
      ],
      correctOption: 'A: High-cardinality Partition Key with uniform access patterns',
      explanation: 'High cardinality ensures traffic is evenly distributed across storage partitions without thermal throttling.',
    },
  ],
  'Redis': [
    {
      id: 'q1',
      question: 'When implementing the Cache-Aside pattern with Redis, what is the best strategy to mitigate Cache Stampede (Dog-piling)?',
      options: [
        'A: Probabilistic early expiration (XFetch) or distributed mutex locking',
        'B: Set cache TTL to infinity and never invalidate',
        'C: Flush all keys every minute',
        'D: Force all database reads through the main application thread',
      ],
      correctOption: 'A: Probabilistic early expiration (XFetch) or distributed mutex locking',
      explanation: 'Distributed mutexes or probabilistic early recomputation prevent thousands of simultaneous queries hitting the DB.',
    },
    {
      id: 'q2',
      question: 'Which Redis data structure is most suitable for implementing a real-time sliding-window rate limiter?',
      options: [
        'A: Sorted Set (ZSET) using timestamp as the score',
        'B: Redis String with APPEND',
        'C: Redis Bitfield',
        'D: Redis Pub/Sub channel',
      ],
      correctOption: 'A: Sorted Set (ZSET) using timestamp as the score',
      explanation: 'ZREMRANGEBYSCORE and ZADD allow atomic sliding window boundary pruning within a transaction.',
    },
    {
      id: 'q3',
      question: 'What is the trade-off when using Redis RDB persistence compared to AOF (Append-Only File)?',
      options: [
        'A: RDB produces compact point-in-time snapshots but risks losing data between intervals',
        'B: RDB is much slower to restore than AOF',
        'C: RDB does not support key eviction',
        'D: AOF requires 100x more memory than RDB during runtime',
      ],
      correctOption: 'A: RDB produces compact point-in-time snapshots but risks losing data between intervals',
      explanation: 'RDB snapshots are ideal for fast reboots/backups, while AOF maximizes durability at slight write cost.',
    },
  ],
  'System Design': [
    {
      id: 'q1',
      question: 'In distributed systems design, what does the CAP theorem state regarding network partitions?',
      options: [
        'A: During a network partition, a system must choose between Consistency and Availability',
        'B: You can guarantee all three: Consistency, Availability, and Partition tolerance',
        'C: Partition tolerance is optional in modern cloud environments',
        'D: Latency is always prioritized over durability',
      ],
      correctOption: 'A: During a network partition, a system must choose between Consistency and Availability',
      explanation: 'Since network partitions cannot be completely avoided in distributed setups, systems choose CP or AP.',
    },
    {
      id: 'q2',
      question: 'How does consistent hashing minimize re-sharding overhead when cache nodes are added or removed?',
      options: [
        'A: Only k/n keys need to be remapped on average using a hash ring with virtual nodes',
        'B: It forces all keys to remap simultaneously to ensure balance',
        'C: It converts all keys to integers modulo node count directly',
        'D: It eliminates the need for storage nodes entirely',
      ],
      correctOption: 'A: Only k/n keys need to be remapped on average using a hash ring with virtual nodes',
      explanation: 'Virtual nodes along the hash ring evenly distribute keys and only shift neighboring key boundaries on topology change.',
    },
    {
      id: 'q3',
      question: 'Which metric best reflects edge user degradation in high-throughput services?',
      options: [
        'A: P99 / P99.9 Latency and Error Rate',
        'B: Average CPU utilization only',
        'C: Total count of database tables',
        'D: Average response time of successful 200 OK responses',
      ],
      correctOption: 'A: P99 / P99.9 Latency and Error Rate',
      explanation: 'Averages mask tail latency spikes; P99 shows the real experience of the slowest 1% of users.',
    },
  ],
};

export function getQuizForTopic(topic: string): Quiz {
  const normalized = topic.toLowerCase();
  let matchedQuestions: QuizQuestion[] = [];

  if (normalized.includes('aws') || normalized.includes('serverless') || normalized.includes('cloud')) {
    matchedQuestions = quizRepository['AWS'] ?? [];
  } else if (normalized.includes('redis') || normalized.includes('cache')) {
    matchedQuestions = quizRepository['Redis'] ?? [];
  } else if (normalized.includes('design') || normalized.includes('system') || normalized.includes('architecture')) {
    matchedQuestions = quizRepository['System Design'] ?? [];
  } else {
    // Generate adaptive questions based on the topic name
    matchedQuestions = [
      {
        id: 'q1',
        question: `Which architectural pattern is considered an industry standard for ${topic}?`,
        options: [
          'A: Decoupled modular design with explicit boundary contracts',
          'B: Monolithic tightly-coupled global state',
          'C: Synchronous blocking RPC for all operations',
          'D: Hardcoded static configurations in production builds',
        ],
        correctOption: 'A: Decoupled modular design with explicit boundary contracts',
        explanation: 'Decoupled boundaries isolate side-effects and allow independent scaling and automated testing.',
      },
      {
        id: 'q2',
        question: `When handling high concurrency in ${topic}, what is the recommended resilience pattern?`,
        options: [
          'A: Circuit breakers, rate limiting, and exponential backoff with jitter',
          'B: Infinite retry loops with zero delay',
          'C: Immediate thread termination without cleanup',
          'D: Disabling authentication to maximize speed',
        ],
        correctOption: 'A: Circuit breakers, rate limiting, and exponential backoff with jitter',
        explanation: 'Backoff with jitter mitigates thundering herds and prevents cascading failures across microservices.',
      },
      {
        id: 'q3',
        question: `How do teams establish observability and monitoring for ${topic}?`,
        options: [
          'A: Structured logging, distributed tracing (OpenTelemetry), and health metrics',
          'B: Periodic manual console inspection',
          'C: Storing unindexed plain text logs on ephemeral disks',
          'D: Checking server status once a day',
        ],
        correctOption: 'A: Structured logging, distributed tracing (OpenTelemetry), and health metrics',
        explanation: 'Distributed tracing correlates end-to-end user requests across distributed asynchronous components.',
      },
    ];
  }

  return {
    quizId: `quiz_${Date.now()}`,
    topic,
    difficulty: 'intermediate',
    questions: matchedQuestions,
  };
}

export function gradeQuizSubmission(
  sessionId: string,
  quizId: string,
  topic: string,
  submissions: QuizSubmission[]
): QuizResult {
  const correctCount = submissions.filter(
    (s) => s.selectedOption && s.correctOption && s.selectedOption.trim() === s.correctOption.trim()
  ).length;

  const total = submissions.length || 1;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 70;

  const result: QuizResult = {
    quizId,
    topic,
    totalQuestions: total,
    correctCount,
    score,
    passed,
    feedback: passed
      ? 'Outstanding performance! You proved strong technical command of these principles.'
      : 'Good effort, but key edge cases were missed. Your study plan has been updated to reinforce this topic.',
    adaptedTopic: !passed ? topic : undefined,
    newPlanDayAdded: !passed ? 4 : undefined,
  };

  // Record into repository
  repository.addQuizResult(sessionId, result);

  return result;
}
