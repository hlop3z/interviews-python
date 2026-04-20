// Database primitives for system design. Scope: decision frameworks an
// interviewer tests — SQL vs NoSQL, isolation, replication, sharding.

import type { Tradeoff } from './types';

export const sqlVsNoSql: Tradeoff = {
  topic: 'SQL vs NoSQL — pick by access pattern, not by hype',
  labelA: 'Relational (Postgres, MySQL)',
  labelB: 'Non-relational (varies)',
  criteria: [
    {
      criterion: 'Data shape',
      optionA: 'Normalized tables with known schema; cross-entity joins cheap',
      optionB: 'Denormalized document / KV / wide-column; joins expensive or absent',
    },
    {
      criterion: 'Consistency',
      optionA: 'Strong by default; ACID transactions across rows and tables',
      optionB: 'Eventual by default in most distributed stores; tunable per op in some',
    },
    {
      criterion: 'Scale ceiling',
      optionA: 'Vertical first; horizontal needs explicit sharding strategy',
      optionB: 'Horizontal by design (DynamoDB, Cassandra); scale-out is the point',
    },
    {
      criterion: 'Query flexibility',
      optionA: 'Ad-hoc queries on any indexed column; analytics-friendly',
      optionB: 'Only the access patterns you designed for; re-design to add new ones',
    },
    {
      criterion: 'Best fit',
      optionA: 'OLTP, financial, anything with cross-entity integrity',
      optionB: 'High-volume KV, time-series, session stores, known-shape workloads',
    },
  ],
  rule:
    'Default to Postgres until you have a concrete reason not to. "We might need scale" is not a reason; millions of rows fit on one Postgres node.',
};

export interface IsolationLevel {
  level: string;
  prevents: string;
  stillAllows: string;
  typicalUse: string;
}

// Ordered weakest → strongest.
export const isolationLevels: IsolationLevel[] = [
  {
    level: 'Read Uncommitted',
    prevents: 'Nothing beyond corruption',
    stillAllows: 'Dirty reads, non-repeatable reads, phantoms, lost updates',
    typicalUse: 'Never in practice. Many engines silently upgrade to Read Committed.',
  },
  {
    level: 'Read Committed',
    prevents: 'Dirty reads',
    stillAllows: 'Non-repeatable reads, phantoms, lost updates',
    typicalUse: 'Postgres default. Fine for most web apps — each statement sees a fresh snapshot.',
  },
  {
    level: 'Repeatable Read',
    prevents: 'Dirty reads, non-repeatable reads',
    stillAllows: 'Phantoms in SQL standard (MySQL InnoDB blocks them anyway via gap locks); still lost updates without SELECT FOR UPDATE',
    typicalUse: 'MySQL InnoDB default. Postgres Repeatable Read is actually snapshot isolation.',
  },
  {
    level: 'Snapshot Isolation',
    prevents: 'Dirty reads, non-repeatable reads, phantoms',
    stillAllows: 'Write skew (two transactions read overlapping sets, write non-overlapping, both commit)',
    typicalUse: 'Postgres Repeatable Read. Good general default; watch for write skew in banking-style invariants.',
  },
  {
    level: 'Serializable',
    prevents: 'All of the above including write skew',
    stillAllows: 'Nothing — equivalent to some serial order',
    typicalUse: 'Financial / invariant-critical paths. Highest cost; expect aborts and retry loops.',
  },
];

export interface ReplicationMode {
  mode: string;
  howItWorks: string;
  consistency: string;
  tradeoff: string;
}

export const replicationModes: ReplicationMode[] = [
  {
    mode: 'Single-leader async',
    howItWorks: 'One primary accepts writes; replicas apply the WAL after commit.',
    consistency: 'Read-your-writes on primary; stale reads on replicas.',
    tradeoff: 'Simple + fast writes. Failover may lose uncommitted tail of the log.',
  },
  {
    mode: 'Single-leader sync (or semi-sync)',
    howItWorks: 'Primary waits for ≥1 replica to ack before acknowledging client.',
    consistency: 'No data loss on failover of acked writes.',
    tradeoff: 'Write latency = primary + slowest synced replica. One slow replica stalls writes.',
  },
  {
    mode: 'Multi-leader',
    howItWorks: 'Writes accepted at any leader; leaders replicate asynchronously to each other.',
    consistency: 'Conflicting writes require resolution (last-write-wins, CRDTs, app-level merge).',
    tradeoff: 'Good for multi-region write locality. Conflict resolution is the hard part.',
  },
  {
    mode: 'Leaderless (quorum)',
    howItWorks: 'Client writes to W replicas, reads from R; overlap ensures freshness when W + R > N.',
    consistency: 'Tunable per request. Hinted handoff and read repair fix stragglers.',
    tradeoff: 'Complex failure modes; strong consistency is possible but expensive. DynamoDB, Cassandra.',
  },
];

export interface ShardingStrategy {
  name: string;
  howItWorks: string;
  pros: string;
  cons: string;
}

export const shardingStrategies: ShardingStrategy[] = [
  {
    name: 'Range',
    howItWorks: 'Partition by key range: ids 0–1M → shard A, 1M–2M → shard B.',
    pros: 'Range scans stay on one shard; easy to reason about.',
    cons: 'Monotonic keys (timestamps, autoincrement) create hot-shard on inserts.',
  },
  {
    name: 'Hash',
    howItWorks: 'Partition by hash(key) mod N (or consistent hashing).',
    pros: 'Even load distribution; no natural hotspots.',
    cons: 'Destroys range-scan locality; rescaling is painful without consistent hashing.',
  },
  {
    name: 'Directory / lookup',
    howItWorks: 'A routing service stores a key → shard mapping.',
    pros: 'Maximum flexibility; resharding is metadata-only.',
    cons: 'Directory is a new bottleneck + single point of failure; needs its own scale plan.',
  },
  {
    name: 'Geographic',
    howItWorks: 'Partition by region / tenant jurisdiction.',
    pros: 'Latency + data-residency (GDPR, HIPAA) solved in one move.',
    cons: 'Cross-region queries are the slow path; rebalance is political, not just technical.',
  },
];

export interface IndexType {
  type: string;
  bestFor: string;
  avoidFor: string;
  note: string;
}

export const indexTypes: IndexType[] = [
  {
    type: 'B-tree (default)',
    bestFor: 'Equality + range + ORDER BY on indexed columns.',
    avoidFor: 'Full-text search, high-cardinality multi-column filters with arbitrary order.',
    note: 'Postgres / MySQL default. 99% of indexes you create are B-tree.',
  },
  {
    type: 'Hash',
    bestFor: 'Pure equality lookup at scale.',
    avoidFor: 'Range, ORDER BY, prefix matching.',
    note: 'Rarely worth it — B-tree equality lookups are already fast.',
  },
  {
    type: 'GIN / inverted',
    bestFor: 'Full-text, JSONB containment, arrays.',
    avoidFor: 'Low-cardinality columns where a bitmap scan is better.',
    note: 'Postgres GIN. Larger + slower to write than B-tree but enables @> and ts queries.',
  },
  {
    type: 'Covering (INCLUDE)',
    bestFor: 'Index-only scans — query reads only indexed + included columns.',
    avoidFor: 'Wide payloads (defeats the memory-density point of an index).',
    note: 'Index stores extra non-key columns so the row lookup is skipped.',
  },
  {
    type: 'Partial',
    bestFor: 'Indexing a hot subset (`WHERE status = \'active\'`) to shrink index size.',
    avoidFor: 'Predicates that drift over time (requires reindex).',
    note: 'Huge wins when the hot slice is <5% of rows.',
  },
];

export const indexingRules = [
  'Index the columns you filter or join on, not the ones you select.',
  'Composite index order matters: (user_id, created_at) serves WHERE user_id=? ORDER BY created_at, not the reverse.',
  'An index on a low-cardinality column (boolean, enum-of-3) rarely earns its write cost — consider a partial index.',
  'EXPLAIN (ANALYZE, BUFFERS) is the ground truth. Never tune blind.',
  'N+1 query is the #1 interview-day bug. Detect with query logs; fix with JOIN or batched IN (…).',
];
