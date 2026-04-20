import type { Scenario, Tradeoff } from './types';

// 30-minute whiteboard scenarios. Every scenario anchors on invariants rather
// than vendor products so the content ages slowly.

export const scenarios: Scenario[] = [
  {
    id: 'lru-cache',
    title: 'LRU cache',
    problem:
      'Cache with a fixed capacity that evicts the least-recently-used entry on insert when full. `get` and `put` must be O(1).',
    clarifyingQuestions: [
      'Is capacity fixed at construction or dynamic?',
      'Is access (get) thread-safe? If yes, coarse lock or lock-free?',
      'Are we optimizing for hit latency (in-memory) or hit rate (tiered cache)?',
    ],
    approach:
      'Hash map (key → node) gives O(1) lookup. Doubly-linked list keeps entries in recency order — move-to-head on access, drop-from-tail on eviction. The two structures share the same node objects so both pointers move in O(1).',
    complexity: { time: 'O(1) get / put', space: 'O(capacity)' },
    snippet: `class Node:
    __slots__ = ('key', 'val', 'prev', 'next')
    def __init__(self, k, v):
        self.key, self.val, self.prev, self.next = k, v, None, None

class LRU:
    def __init__(self, cap: int):
        self.cap = cap
        self.map: dict[int, Node] = {}
        # Sentinel head/tail — removes null-checks
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, n: Node) -> None:
        n.prev.next, n.next.prev = n.next, n.prev

    def _add_to_front(self, n: Node) -> None:
        n.prev, n.next = self.head, self.head.next
        self.head.next.prev = n
        self.head.next = n

    def get(self, key: int) -> int:
        n = self.map.get(key)
        if not n:
            return -1
        self._remove(n); self._add_to_front(n)
        return n.val

    def put(self, key: int, val: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        n = Node(key, val)
        self.map[key] = n
        self._add_to_front(n)
        if len(self.map) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]`,
    snippetLang: 'python',
    followUps: [
      'Make it thread-safe. What concurrency primitive is cheapest — a single lock, striped locks, or lock-free?',
      'Implement LFU instead. Why is it harder to get O(1)?',
      'How would you extend this to a distributed cache?',
    ],
  },
  {
    id: 'lfu-cache',
    title: 'LFU cache (vs LRU)',
    problem:
      'Evict the least-frequently-used entry. On tie, break by recency.',
    clarifyingQuestions: [
      'Is this a pure interview question or are we benchmarking? LFU hit-rate is often worse than LRU on realistic workloads',
      'How often do items age out? A pure frequency count never decays, so old popular items can stick forever',
    ],
    approach:
      'Hash map key → node, plus a hash map from frequency → doubly-linked list of nodes at that frequency. Track the current minimum frequency; on access, bump the node to the next frequency list. Eviction pops from the head of the min-frequency list.',
    complexity: { time: 'O(1) get / put', space: 'O(capacity)' },
    followUps: [
      'What is "frequency decay" and why do production LFU variants (TinyLFU, W-TinyLFU) use it?',
      'Why do many systems use LRU even when LFU hit rates are technically higher?',
    ],
  },
  {
    id: 'rate-limiter',
    title: 'Rate limiter',
    problem:
      'Reject requests that exceed a quota (e.g., 100 req / minute / user). Should work across many server instances.',
    clarifyingQuestions: [
      'Per-user, per-IP, per-API-key, or per-tenant?',
      'Soft (429 + retry-after) or hard (drop the TCP connection)?',
      'Is approximate OK, or do we need exact? Distributed exact-counting is expensive',
    ],
    approach:
      'Pick an algorithm (see table below). Store counters in a shared fast store (Redis with atomic INCR + EXPIRE is the canonical implementation). For distributed accuracy, use token bucket with atomic Lua scripts or sliding-window-counter for memory efficiency.',
    complexity: { time: 'O(1) per request', space: 'O(keys × window_granularity)' },
    followUps: [
      'What happens when Redis is unreachable? Fail-open or fail-closed?',
      'How do you handle clock skew across instances?',
      'What if one user generates 99% of traffic? (Hot-key problem)',
    ],
  },
  {
    id: 'bloom-filter',
    title: 'Bloom filter',
    problem:
      'Probabilistic set membership — "is X probably in the set?" with O(1) queries and ~1 byte per element. Never false-negatives; may false-positive at a configurable rate.',
    clarifyingQuestions: [
      'What false-positive rate is acceptable? 1%? 0.01%?',
      'Do we need to remove elements? Standard Bloom filters cannot — you need a Counting Bloom Filter',
    ],
    approach:
      'Bit array of size m. On insert, hash the element with k independent hash functions and set those k bits. On query, if any of the k bits is 0 → definitely not in set; if all are 1 → probably in set. Tune m and k for target false-positive rate: m = -n·ln(p) / (ln 2)² for n elements and false-positive rate p.',
    complexity: { time: 'O(k) per op', space: 'O(m) bits — typically ~9.6 bits per element for 1% FPR' },
    followUps: [
      'Where is this used in real systems?',
      'Counting Bloom Filter vs Cuckoo Filter — when does each win?',
      'Why do LSM-tree databases use Bloom filters per SSTable?',
    ],
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent hashing',
    problem:
      'Distribute keys across N nodes. When a node is added or removed, move as few keys as possible — ideally ~1/N of them.',
    clarifyingQuestions: [
      'How many nodes and how many keys? (Affects load balance)',
      'Is node membership static or changing frequently?',
      'Do we need replication? Usually yes — store at the next K nodes on the ring',
    ],
    approach:
      'Hash each node onto a ring (0 to 2^32 - 1). Hash each key onto the same ring; the key belongs to the first node clockwise. Adding / removing a node only moves the keys in that node\'s ring segment. Use virtual nodes (many ring positions per real node, e.g., 150×) to smooth out load imbalance.',
    complexity: { time: 'O(log N) lookup with a sorted ring + binary search', space: 'O(N × virtual_count)' },
    followUps: [
      'What if the hash ring has one node with 10× the keys? (Virtual nodes fix this)',
      'Why does mod-N hashing (`hash(key) % N`) fall apart on rescale?',
      'Rendezvous hashing as an alternative — when does it win?',
    ],
  },
  {
    id: 'id-generation',
    title: 'Distributed ID generation',
    problem:
      'Generate unique IDs across many machines without coordination. Which ID shape fits the use case?',
    clarifyingQuestions: [
      'Must IDs be sortable by creation time?',
      'Is 128-bit OK, or do we need 64-bit for DB index efficiency?',
      'Must we avoid leaking cardinality (guessable IDs are an anti-pattern for public resources)?',
    ],
    approach:
      'Choose by shape, not by product name:\n\n• **Random 128-bit (UUID v4)** — trivial to generate, no coordination, not sortable. Bad for B-tree primary keys (random inserts shred the index).\n• **Time-ordered 128-bit (UUID v7 / ULID)** — first 48 bits are a millisecond timestamp, rest is random. Sortable, index-friendly, no coordination.\n• **Time-ordered 64-bit with machine id (Snowflake-shape)** — timestamp + datacenter/worker id + sequence. Requires a unique worker-id assignment process. Fits in a bigint PK.',
    complexity: { time: 'O(1) per ID', space: 'O(1) state per worker' },
    followUps: [
      'How do you assign worker IDs at scale without a coordinator?',
      'What happens to Snowflake-shape IDs when the clock goes backwards (NTP correction, leap smear)?',
      'Why would you NOT use a random-UUID as the primary key of a large InnoDB table?',
    ],
  },
  {
    id: 'messaging-primitives',
    title: 'Messaging primitives — pick the right shape',
    problem:
      'An async workflow needs to hand off work between services. Which messaging shape fits?',
    clarifyingQuestions: [
      'Exactly once? At least once? At most once? (Exactly-once is almost always a lie — aim for at-least-once + idempotent consumers)',
      'Do consumers need to replay old messages?',
      'One consumer per message, or fan-out?',
    ],
    approach:
      'Three shapes, anchored on semantics (products in parens are examples, not prescriptions):\n\n• **Append-only log** — ordered, replayable, consumer-tracks-offset. Multiple independent consumers read at their own pace. Good for event sourcing, analytics fan-out (Kafka, Kinesis, Pulsar).\n• **Work queue** — each message goes to one consumer; ack / nack on completion; visibility timeout protects against dead workers. Good for tasks (RabbitMQ work queues, SQS, Beanstalkd).\n• **Pub/sub broadcast** — every subscriber gets every message; no durable offset. Good for live notifications (Redis Pub/Sub, SNS).\n\nDo not assume the named product behaves exactly like the shape — features drift. Read the docs of whichever one you actually pick.',
    complexity: { time: 'Producer O(1) + broker round-trip', space: 'Retention-dependent' },
    followUps: [
      'How do you achieve idempotent consumers on top of at-least-once delivery?',
      'Why is "exactly-once" usually misleading marketing?',
      'When do you need a dead-letter queue, and how do you configure it?',
    ],
  },
  {
    id: 'cache-strategies',
    title: 'Cache strategies',
    problem:
      'A hot read path is hitting the database too hard. Where and how do you cache?',
    clarifyingQuestions: [
      'Is the underlying data changing, and how stale can the cache be?',
      'Is write volume high? (Write-through has a write tax; cache-aside does not)',
      'Can two consumers read the same key concurrently? (Cache stampede)',
    ],
    approach:
      '**Cache-aside** (most common): app checks cache → miss → reads DB → writes cache. Simple, but subject to stampede and needs TTLs. **Write-through**: writes go to cache AND DB atomically; reads always hit cache. No staleness, but write path pays the cache cost. **Write-back**: writes go to cache; DB is updated asynchronously. Fastest writes; worst durability. **Write-around**: writes skip cache and go straight to DB; only reads populate cache. Good when writes are seldom re-read soon after.',
    complexity: { time: 'O(1) cached read; O(db) on miss', space: 'Bounded by cache capacity' },
    followUps: [
      'What is a cache stampede and how do single-flight / probabilistic early expiration fix it?',
      'Thundering herd after a cache flush — how do you warm it safely?',
      'Why can TTL-based eviction cause cache-miss spikes? How do you smooth them?',
    ],
  },
  {
    id: 'sharding',
    title: 'Sharding strategies',
    problem:
      'A single database cannot hold the data or handle the load. How do you split it across many?',
    clarifyingQuestions: [
      'What is the query pattern — single-entity lookups, range scans, or analytics?',
      'What is the natural partition key (user_id, tenant_id, region)?',
      'How often do you need cross-shard queries? (Expensive — design to avoid)',
    ],
    approach:
      '**Range sharding** — partition by key range (ids 0–1M on shard A, 1M–2M on B). Good for range scans; creates hotspots if ranges are unbalanced or monotonic (e.g., timestamp → last shard gets all writes).\n\n**Hash sharding** — partition by hash(key) mod N. Balances load evenly; destroys range-scan locality. Rescaling is painful unless you use consistent hashing.\n\n**Directory sharding** — a lookup service maps key → shard. Maximum flexibility; the directory becomes a bottleneck and must itself be scaled.',
    complexity: { time: 'O(1) with known shard key', space: 'Proportional to shard' },
    followUps: [
      'How do you reshard without downtime?',
      'What is a "hot shard" and what do you do when one user generates 20% of traffic?',
      'Cross-shard JOIN: when to denormalize vs fan-out query vs move to a warehouse?',
    ],
  },
  {
    id: 'leader-election',
    title: 'Leader election',
    problem:
      'A set of processes must elect exactly one leader. The leader coordinates; followers replicate. What goes wrong, and how do you make it safe?',
    clarifyingQuestions: [
      'Is strong consistency required, or is eventual convergence OK?',
      'What happens if the network splits? (Split-brain is the classic failure mode)',
      'How quickly must a new leader take over after a failure?',
    ],
    approach:
      '**Use a proven consensus protocol** (Raft, Paxos, Zab) or a coordinator (etcd, ZooKeeper, Consul). Do not hand-roll. Key guarantee: at most one leader per term, and any decision a leader makes is replicated to a majority quorum before commit.\n\nFor a quick interview answer, describe Raft: (1) each process has a term counter; (2) followers promote to candidate on timeout and request votes; (3) a candidate with a majority becomes leader; (4) the leader heartbeats; (5) partitioned leaders step down when they cannot reach a quorum. The "bully algorithm" is the textbook simple version but does not handle partitions safely.',
    complexity: { time: 'O(n) messages per election (candidate contacts all peers); O(n) per commit for majority replication', space: 'O(log) persisted per node' },
    followUps: [
      'Why does split-brain lead to two writers? How does a quorum prevent it?',
      'Lease-based leader election — what does the lease protect against?',
      'Why does "odd number of nodes" matter for quorum (3, 5, 7)?',
    ],
  },
];

export const scenarioMap: Record<string, Scenario> = Object.fromEntries(
  scenarios.map((s) => [s.id, s]),
);

// Rate-limiter algorithm trade-off table, referenced from the Rate Limiter scenario.
export const rateLimiterAlgorithms: Tradeoff = {
  topic: 'Rate limiter algorithms',
  labelA: 'Algorithm',
  labelB: 'Behavior',
  criteria: [
    {
      criterion: 'Fixed window',
      optionA: 'Counter per window (e.g., minute)',
      optionB: 'Edge case: burst at window boundary can be 2× the intended limit',
    },
    {
      criterion: 'Sliding log',
      optionA: 'Store a timestamp per request in a sorted set',
      optionB: 'Exact, but memory scales with request volume — expensive at scale',
    },
    {
      criterion: 'Sliding window counter',
      optionA: 'Two adjacent fixed-window counts, weighted by time-in-current-window',
      optionB: 'Good accuracy with O(1) memory per key — the pragmatic default',
    },
    {
      criterion: 'Token bucket',
      optionA: 'Bucket refills at a rate; each request consumes a token',
      optionB: 'Allows short bursts up to bucket size — user-friendly for interactive APIs',
    },
    {
      criterion: 'Leaky bucket',
      optionA: 'Requests queue; drained at a fixed rate',
      optionB: 'Smooths output but adds latency — fits traffic shaping more than rate limiting',
    },
  ],
  rule:
    'Start with sliding-window counter for general API rate limiting. Use token bucket when short bursts are a feature. Avoid fixed window for anything public-facing.',
};
