// Scaling playbook. The order of these axes IS the order to apply them —
// interviewers want to hear "cache first, split reads next, then shard."

export interface ScalingAxis {
  axis: string;
  what: string;
  firstMove: string;
  ceiling: string;
  cost: string;
}

export const axes: ScalingAxis[] = [
  {
    axis: 'Vertical (scale up)',
    what: 'Bigger box. More CPU, RAM, faster disk.',
    firstMove: 'Always the first move. Fewer moving parts = fewer bugs.',
    ceiling: 'One machine. Usually 10×–100× current load before you hit a cloud-provider instance limit.',
    cost: 'Roughly linear in price, but downtime per upgrade and single-point-of-failure.',
  },
  {
    axis: 'Horizontal (scale out)',
    what: 'More boxes, load-balanced.',
    firstMove: 'Make app stateless — session in Redis / JWT, no per-pod disk state.',
    ceiling: 'Bottleneck shifts to shared dependencies (DB, cache, queue).',
    cost: 'Operational complexity: deployment orchestration, cross-instance observability, warm-up.',
  },
  {
    axis: 'Read replicas',
    what: 'One primary for writes, many replicas for reads.',
    firstMove: 'Route reads to replicas; keep "read my writes" paths on primary.',
    ceiling: 'Replication lag becomes user-visible at high write volume.',
    cost: 'Staleness, failover complexity, and the replica fleet itself.',
  },
  {
    axis: 'Caching',
    what: 'Return hot reads from a fast store instead of the database.',
    firstMove: 'Cache the most expensive + most-read queries. Cache-aside with short TTL.',
    ceiling: 'Hit rate. Past 90% hit rate, each further point is expensive.',
    cost: 'Invalidation complexity. A stale cache is worse than a slow query.',
  },
  {
    axis: 'Sharding',
    what: 'Partition one dataset across many DBs.',
    firstMove: 'Pick a shard key that matches the dominant access pattern.',
    ceiling: 'Hot-shard problem; cross-shard queries are expensive.',
    cost: 'Dramatic — schema migrations, resharding, cross-shard txns all become hard problems.',
  },
  {
    axis: 'Asynchronous offload',
    what: 'Move slow / bursty work to a queue for background workers.',
    firstMove: 'Identify synchronous non-critical work (emails, thumbnails, search index updates).',
    ceiling: 'Only limited by worker fleet and queue durability.',
    cost: 'Eventual consistency in the user flow; need dedupe and DLQ story.',
  },
  {
    axis: 'CDN / edge',
    what: 'Serve static + cacheable dynamic content from POPs close to users.',
    firstMove: 'Put every public GET through CDN. Version assets with content hashes.',
    ceiling: 'Personalized / authenticated paths cannot be edge-cached trivially.',
    cost: 'Cache-key discipline; invalidation fan-out.',
  },
];

export interface ScalingPattern {
  name: string;
  description: string;
  whenToUse: string;
  gotcha: string;
}

export const patterns: ScalingPattern[] = [
  {
    name: 'Stateless services behind a load balancer',
    description: 'Any instance serves any request. Session state in a shared store.',
    whenToUse: 'Horizontal scaling requires this. Treat it as table stakes.',
    gotcha: 'Websockets / long-lived connections need sticky sessions or a pub/sub backplane.',
  },
  {
    name: 'CQRS (command-query separation at scale)',
    description: 'Write side and read side are separate stores; read side is optimized per query.',
    whenToUse: 'Read-heavy + many distinct read shapes (search, analytics, timeline).',
    gotcha: 'Introduces eventual consistency between write and read models. Not free.',
  },
  {
    name: 'Event sourcing',
    description: 'Store the events, derive state. Read models are projections.',
    whenToUse: 'Auditability critical; replayable history; evolving read needs.',
    gotcha: 'Event schema evolution is the hardest part; versioning events is forever.',
  },
  {
    name: 'Circuit breaker',
    description: 'Stop calling a failing dependency after N errors; fail fast; probe periodically.',
    whenToUse: 'Any synchronous cross-service call in a high-traffic path.',
    gotcha: 'Half-open probe storms — randomize the retry timing.',
  },
  {
    name: 'Backpressure',
    description: 'Signal upstream to slow down when downstream saturates (bounded queues, 429s).',
    whenToUse: 'Any pipeline where unbounded buffering can exhaust memory.',
    gotcha: 'Bounded queue + blocking producer can deadlock — prefer drop + retry headers.',
  },
  {
    name: 'Bulkhead',
    description: 'Isolate resource pools per dependency so one slow client cannot starve others.',
    whenToUse: 'Multi-tenant services, or services calling multiple downstream deps.',
    gotcha: 'Over-partitioning wastes capacity; size pools by observed concurrency, not guesses.',
  },
  {
    name: 'Hedged requests',
    description: 'For tail-latency-sensitive reads, fire a second request after p95; take the first response.',
    whenToUse: 'Read paths where tail latency matters (search, recommendations).',
    gotcha: 'Doubles load on the slow path; pair with tight timeouts.',
  },
];

export const orderOfOperations = [
  '1. Measure. Know your p50/p95/p99 latency, throughput, and where time is spent.',
  '2. Optimize the query + add indexes. Usually 10× wins from fixing N+1 and missing indexes.',
  '3. Cache. Cheap, reversible, huge win on read-heavy paths.',
  '4. Scale vertically. Simplest; postpones the architectural change.',
  '5. Add read replicas. Splits read load without touching write path.',
  '6. Offload async work. Move anything that can be eventual out of the request path.',
  '7. Scale horizontally (stateless tier). Needs shared session store + stateless code.',
  '8. Shard. Last resort; commit to the chosen key carefully — it is very hard to change.',
];
