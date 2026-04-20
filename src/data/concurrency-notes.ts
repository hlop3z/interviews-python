// Concurrency primitives for Python backend interviews.
// Heavy on Python specifics — GIL, asyncio, threading vs multiprocessing.

export interface ConcurrencyMode {
  mode: string;
  pythonTool: string;
  bestFor: string;
  blindSpot: string;
}

export const modes: ConcurrencyMode[] = [
  {
    mode: 'Synchronous',
    pythonTool: 'Plain function calls',
    bestFor: 'CPU work, simple scripts, anything without I/O.',
    blindSpot: 'Single blocking call (DB query, HTTP call) stalls everything. Latency adds up.',
  },
  {
    mode: 'Threads (concurrent I/O)',
    pythonTool: '`threading`, `concurrent.futures.ThreadPoolExecutor`',
    bestFor: 'I/O-bound work where you need familiar blocking APIs (requests, DB drivers).',
    blindSpot: 'GIL prevents true parallelism of Python bytecode. Race conditions on shared state.',
  },
  {
    mode: 'Async (cooperative)',
    pythonTool: '`asyncio`, `async`/`await`, `aiohttp`, `asyncpg`',
    bestFor: 'Massive concurrent I/O (10k+ sockets). Lower overhead than threads.',
    blindSpot: 'One blocking call (sync DB driver, CPU loop) freezes the entire event loop.',
  },
  {
    mode: 'Processes (parallel CPU)',
    pythonTool: '`multiprocessing`, `concurrent.futures.ProcessPoolExecutor`',
    bestFor: 'CPU-bound work that must use multiple cores.',
    blindSpot: 'IPC is expensive (pickling); forking semantics on Linux vs spawn on Windows/macOS.',
  },
];

export interface GilFact {
  fact: string;
  implication: string;
}

export const gilFacts: GilFact[] = [
  {
    fact: 'Only one thread executes Python bytecode at a time in CPython.',
    implication: 'Adding threads does not speed up CPU-bound Python code. Use processes instead.',
  },
  {
    fact: 'The GIL is released during I/O syscalls and in many C extensions (NumPy, hashlib).',
    implication: 'Threaded I/O and threaded NumPy work fine. The GIL hurts Python-pure CPU loops.',
  },
  {
    fact: 'Python 3.13 ships an experimental no-GIL mode (PEP 703).',
    implication: 'Still opt-in and slower for single-threaded code; not the interview default yet.',
  },
  {
    fact: 'The GIL does NOT make Python thread-safe.',
    implication: 'Reads and writes to a dict or int may still interleave at arbitrary points. You still need locks.',
  },
];

export interface AsyncioPitfall {
  name: string;
  symptom: string;
  fix: string;
}

export const asyncioPitfalls: AsyncioPitfall[] = [
  {
    name: 'Blocking call in async function',
    symptom: 'Event loop stalls. Latency spikes to seconds; everything is queued behind one call.',
    fix: 'Use async-native libraries (aiohttp, asyncpg). For unavoidable sync calls, `asyncio.to_thread(func)`.',
  },
  {
    name: 'Unawaited coroutine',
    symptom: '`RuntimeWarning: coroutine was never awaited`. The function never actually runs.',
    fix: 'Always `await` the call, or schedule with `asyncio.create_task(...)` if fire-and-forget.',
  },
  {
    name: 'Fire-and-forget task never completes',
    symptom: 'Task is garbage-collected before it runs. Silent failure.',
    fix: 'Hold a reference: `task = asyncio.create_task(coro); tasks.add(task)`. Remove on done.',
  },
  {
    name: 'Mixing sync and async by accident',
    symptom: '`asyncio.run(coro)` called from inside a running loop → RuntimeError.',
    fix: 'Within async code, `await coro`. `asyncio.run` is only a top-level entrypoint.',
  },
  {
    name: 'Unbounded concurrency',
    symptom: '`asyncio.gather(*[fetch(u) for u in 10000_urls])` DDoSes the target.',
    fix: 'Bound with `asyncio.Semaphore(N)` or process in batches.',
  },
];

export interface LockPrimitive {
  primitive: string;
  purpose: string;
  pythonApi: string;
  pitfall: string;
}

export const lockPrimitives: LockPrimitive[] = [
  {
    primitive: 'Mutex / Lock',
    purpose: 'Mutual exclusion — only one thread in the critical section.',
    pythonApi: '`threading.Lock`, `asyncio.Lock`',
    pitfall: 'Never held across await/IO if you can avoid it. Prefer `with lock:` to guarantee release.',
  },
  {
    primitive: 'RLock (re-entrant)',
    purpose: 'Same thread can acquire multiple times without deadlocking itself.',
    pythonApi: '`threading.RLock`',
    pitfall: 'Masks bad design; if you need re-entrance, your call graph may be tangled.',
  },
  {
    primitive: 'Semaphore',
    purpose: 'Cap concurrency to N (connection pools, rate-limited clients).',
    pythonApi: '`threading.Semaphore(N)`, `asyncio.Semaphore(N)`',
    pitfall: 'Leaked acquire without release drains the pool over time.',
  },
  {
    primitive: 'Condition variable',
    purpose: 'Wait for a predicate to become true; notifier wakes waiters.',
    pythonApi: '`threading.Condition`, `asyncio.Condition`',
    pitfall: 'Spurious wakeups — always re-check the predicate in a while-loop.',
  },
  {
    primitive: 'Event',
    purpose: 'One-shot flag that one side sets, many can wait on.',
    pythonApi: '`threading.Event`, `asyncio.Event`',
    pitfall: 'No counter — "set" is idempotent. Use a Semaphore if you need counting.',
  },
  {
    primitive: 'Queue',
    purpose: 'Thread/task-safe FIFO for producer-consumer.',
    pythonApi: '`queue.Queue`, `asyncio.Queue`',
    pitfall: 'Unbounded queues leak memory under sustained producer > consumer.',
  },
];

export const deadlockConditions = {
  headline:
    "Coffman's four conditions — all four must hold for deadlock. Break any one and you cannot deadlock.",
  items: [
    {
      name: 'Mutual exclusion',
      explanation: 'At least one resource is non-shareable (only one holder at a time).',
    },
    {
      name: 'Hold and wait',
      explanation: 'A thread holds one resource while waiting for another.',
    },
    {
      name: 'No preemption',
      explanation: 'Resources cannot be forcibly taken away from the holder.',
    },
    {
      name: 'Circular wait',
      explanation: 'A cycle of threads, each waiting for a resource held by the next.',
    },
  ],
  fixes: [
    'Global lock ordering: acquire locks in a total order across the whole system.',
    'Try-acquire with timeout: abandon and retry on failure to take the second lock.',
    'Reduce the hold: never make a blocking call while holding a lock.',
    'Single-writer design: one thread owns mutations; others send messages.',
  ],
};

export interface LockingStrategy {
  name: string;
  flow: string;
  bestFor: string;
  cost: string;
}

export const lockingStrategies: LockingStrategy[] = [
  {
    name: 'Pessimistic locking',
    flow: 'SELECT ... FOR UPDATE → modify → commit. Lock held for txn duration.',
    bestFor: 'High contention, short critical sections (money transfers).',
    cost: 'Blocks other readers/writers; risk of deadlock if lock order is inconsistent.',
  },
  {
    name: 'Optimistic locking',
    flow: 'Read row with version; write UPDATE ... WHERE version=? SET version=version+1. Retry on zero-row-affected.',
    bestFor: 'Low contention (most rows are not concurrently edited).',
    cost: 'Retries pile up under contention; livelock if conflict rate is high.',
  },
  {
    name: 'Lease-based',
    flow: 'Take a time-bounded lease; holder must renew; expires automatically.',
    bestFor: 'Distributed leader election, cache warmers, long-running work.',
    cost: 'Clock skew between nodes; two leaders possible during lease handoff.',
  },
];

export interface IdempotencyTrick {
  name: string;
  description: string;
  example: string;
}

export const idempotencyTricks: IdempotencyTrick[] = [
  {
    name: 'Idempotency key',
    description: 'Client supplies a unique key per logical operation; server stores result and returns it on retry.',
    example: 'Stripe: `Idempotency-Key: <uuid>` header on POST /charges.',
  },
  {
    name: 'Natural key uniqueness',
    description: 'Use a business-meaningful unique constraint; second INSERT is a no-op.',
    example: '`INSERT ... ON CONFLICT (email) DO NOTHING` — double-signup becomes safe.',
  },
  {
    name: 'Compare-and-set',
    description: 'Write only if current state matches expected; used in optimistic locking and DynamoDB conditional writes.',
    example: '`UPDATE row SET status=\'paid\', version=v+1 WHERE id=? AND version=?`',
  },
  {
    name: 'Outbox pattern',
    description: 'Write the event to an outbox table in the same DB txn as the business write; separate publisher drains it.',
    example: 'Guarantees "event published iff DB write committed" without distributed transactions.',
  },
];

export const exactlyOnceMyth =
  "'Exactly-once' end-to-end requires the consumer side-effect and the broker ack to be one atomic transaction. For arbitrary side-effects (HTTP calls, emails, file writes) this is impossible. What you actually build is 'at-least-once delivery + idempotent consumer', which is effectively-once. When an interviewer asks how you'd get exactly-once, they want to hear this answer, not a confident 'use Kafka EOS'.";
