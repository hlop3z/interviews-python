// Messaging / queueing primitives. Companion to the system-design.ts
// messaging-primitives scenario — this page covers the primitives in depth.

export interface DeliverySemantic {
  name: string;
  means: string;
  achieveWith: string;
  risk: string;
}

export const deliverySemantics: DeliverySemantic[] = [
  {
    name: 'At-most-once',
    means: 'Message is delivered zero or one time. Never duplicated.',
    achieveWith: 'Fire-and-forget producer; consumer does not ack; no retries.',
    risk: 'Lost messages on any failure. Only acceptable for telemetry / metrics.',
  },
  {
    name: 'At-least-once',
    means: 'Message is delivered one or more times. Never lost.',
    achieveWith: 'Producer retries until ack; consumer acks after processing; broker resends on missed ack.',
    risk: 'Duplicates — consumer MUST be idempotent. This is the sane default.',
  },
  {
    name: 'Exactly-once (the lie)',
    means: 'Message is processed exactly once end-to-end.',
    achieveWith: 'At-least-once delivery + idempotent consumer with dedupe store. Transactional producers (Kafka EOS) only cover producer→broker, not side effects.',
    risk: 'Marketing shorthand. In practice you are implementing "effectively once" via dedupe keys.',
  },
];

export interface BrokerShape {
  shape: string;
  semantics: string;
  ordering: string;
  examples: string;
  bestFor: string;
}

export const brokerShapes: BrokerShape[] = [
  {
    shape: 'Append-only log',
    semantics: 'Consumers track their own offset; messages retained for days.',
    ordering: 'Per-partition total order. Across partitions, unordered.',
    examples: 'Kafka, Kinesis, Pulsar, Redpanda',
    bestFor: 'Event sourcing, analytics fan-out, replay, change-data-capture.',
  },
  {
    shape: 'Work queue',
    semantics: 'Each message goes to one consumer; ack/nack with visibility timeout.',
    ordering: 'Generally unordered (SQS standard). FIFO queues trade throughput for order.',
    examples: 'SQS, RabbitMQ (classic), Beanstalkd, Celery broker',
    bestFor: 'Task queues, background jobs, uneven consumer pools.',
  },
  {
    shape: 'Pub/sub broadcast',
    semantics: 'Every subscriber gets every message; no durable offset by default.',
    ordering: 'Best-effort; subscribers that are offline miss messages.',
    examples: 'Redis Pub/Sub, SNS, NATS core',
    bestFor: 'Live notifications, cache invalidation fan-out.',
  },
  {
    shape: 'Stream (hybrid)',
    semantics: 'Log-like durability + consumer-group semantics; both replay and work-queue patterns.',
    ordering: 'Per-partition.',
    examples: 'Kafka consumer groups, Redis Streams, NATS JetStream',
    bestFor: 'When you want log durability but also work-queue consumption per consumer group.',
  },
];

export interface QueueProblem {
  problem: string;
  cause: string;
  mitigation: string;
}

export const problems: QueueProblem[] = [
  {
    problem: 'Dead-letter queue (DLQ) fills up silently',
    cause: 'Poison message retried N times, auto-moved to DLQ; nobody reads the DLQ.',
    mitigation: 'Alert on DLQ depth > 0. Every DLQ needs a human runbook — not just storage.',
  },
  {
    problem: 'Consumer lag',
    cause: 'Consumers slower than producers; log grows unbounded.',
    mitigation: 'Horizontal scale of consumer group (up to partition count). Backpressure upstream.',
  },
  {
    problem: 'Partition-key skew',
    cause: 'One key (hot customer) maps to one partition → one consumer bottleneck.',
    mitigation: 'Re-key with a salt, accept out-of-order for hot keys, or shard the hot key at app layer.',
  },
  {
    problem: 'Duplicate processing',
    cause: 'At-least-once delivery + non-idempotent consumer.',
    mitigation: 'Idempotency key per message stored for retention window; `INSERT ... ON CONFLICT DO NOTHING`.',
  },
  {
    problem: 'Head-of-line blocking',
    cause: 'One slow message per partition blocks everything behind it.',
    mitigation: 'Parallel processing with concurrency within partition; timeout + push to DLQ.',
  },
  {
    problem: 'Reprocessing after a bug fix',
    cause: 'Consumer bug corrupted downstream state; need to reprocess last N days.',
    mitigation: 'Log-shaped broker (Kafka) allows offset rewind. Work queues cannot replay — design for it.',
  },
  {
    problem: 'Consumer crashes mid-batch',
    cause: 'Batch ack pattern commits after the whole batch; crash mid-batch re-delivers the whole batch.',
    mitigation: 'Design consumers idempotent AND make batches small. Commit offsets only after durable side-effect.',
  },
];

export const idempotencyRule =
  'Assume at-least-once. Build consumers to be safely re-entrant. An idempotency key is the contract: first time it commits, every retry is a no-op. Store the key for at least the broker retention + clock skew.';
