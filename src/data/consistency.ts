// Consistency + distributed-systems models.
// The named theorems (CAP, PACELC) are the anchors; the models are what
// engineers actually pick in system design interviews.

export interface ConsistencyModel {
  name: string;
  guarantee: string;
  whenItFits: string;
  cost: string;
}

// Ordered strongest → weakest.
export const models: ConsistencyModel[] = [
  {
    name: 'Linearizable (strong)',
    guarantee: 'Every read returns the most recent committed write. System looks like a single copy.',
    whenItFits: 'Money, leader election, distributed locks, unique-constraint enforcement.',
    cost: 'Quorum round-trip per op; split-brain-safe only via consensus (Raft, Paxos).',
  },
  {
    name: 'Sequential',
    guarantee: 'All nodes see operations in the same total order; order need not match real time.',
    whenItFits: 'Replicated state machines where per-client ordering matters but wall-clock doesn\'t.',
    cost: 'Cheaper than linearizable but rare in off-the-shelf products.',
  },
  {
    name: 'Causal',
    guarantee: 'If A happened before B (causally), all observers see A before B. Concurrent ops may be seen in any order.',
    whenItFits: 'Collaborative docs, comment threads, anywhere "reply appears before parent" is a bug.',
    cost: 'Version vectors per key; metadata overhead grows with client count.',
  },
  {
    name: 'Read-your-writes',
    guarantee: 'A client always sees its own prior writes.',
    whenItFits: 'User-facing UIs where posting a comment and refreshing must show it.',
    cost: 'Sticky reads to primary or session tokens routed to up-to-date replica.',
  },
  {
    name: 'Monotonic reads',
    guarantee: 'Successive reads never go backwards in time for one client.',
    whenItFits: 'Infinite scroll, dashboards polling a counter — prevents number going down then up.',
    cost: 'Client pins to one replica or carries read-timestamp cookie.',
  },
  {
    name: 'Eventual',
    guarantee: 'If writes stop, all replicas eventually converge. Nothing said about order or window.',
    whenItFits: 'Caches, CDNs, low-stakes counters, anywhere convergence-eventually is enough.',
    cost: 'Cheapest; app must tolerate stale reads and conflicting writes.',
  },
];

export const capTheorem = {
  statement:
    'During a network partition (P), a distributed system must choose: Consistency (every read sees the latest write) or Availability (every request gets a response). You cannot have both while partitioned.',
  commonMisunderstanding:
    'CAP is often stated as "pick 2 of 3" — that is wrong. P is not optional in real networks. The real trade-off is C vs A, and only during partitions.',
  examples: [
    { label: 'CP systems', systems: 'ZooKeeper, etcd, HBase, MongoDB (majority writes)' },
    { label: 'AP systems', systems: 'DynamoDB (default), Cassandra, Riak, CouchDB' },
  ],
};

export const pacelcTheorem = {
  statement:
    'PACELC extends CAP: if Partitioned, pick Availability or Consistency; Else (no partition), pick Latency or Consistency.',
  why:
    'Explains the trade-off you make even in the sunny-day case. A system that chooses Availability during partitions usually also chooses Latency in normal operation — those two preferences travel together.',
  examples: [
    { label: 'PA/EL', systems: 'Cassandra, DynamoDB — available + low latency; staleness is the price always.' },
    { label: 'PC/EC', systems: 'Spanner, CockroachDB — consistent always; pay latency tax always.' },
    { label: 'PA/EC', systems: 'MongoDB (tunable w/readConcern) — can be configured either way.' },
  ],
};

export interface ReadWriteAnomaly {
  anomaly: string;
  scenario: string;
  fixedBy: string;
}

export const anomalies: ReadWriteAnomaly[] = [
  {
    anomaly: 'Dirty read',
    scenario: 'T1 writes X=5; before commit, T2 reads X=5; T1 rolls back. T2 saw a value that never existed.',
    fixedBy: 'Read Committed or higher.',
  },
  {
    anomaly: 'Non-repeatable read',
    scenario: 'T1 reads X=5; T2 writes X=6 and commits; T1 reads X=6 in the same transaction.',
    fixedBy: 'Repeatable Read / Snapshot Isolation.',
  },
  {
    anomaly: 'Phantom',
    scenario: 'T1 reads "all rows where status=\'active\'" twice; T2 inserts a new active row in between.',
    fixedBy: 'Serializable, or predicate/gap locks (MySQL InnoDB).',
  },
  {
    anomaly: 'Lost update',
    scenario: 'T1 and T2 both read balance=100, add 10, both write 110. Real answer is 120.',
    fixedBy: 'SELECT FOR UPDATE, optimistic lock with version column, or Serializable.',
  },
  {
    anomaly: 'Write skew',
    scenario: 'Two doctors on call; each reads "at least one other doctor is on call" and takes themselves off. Now zero on call.',
    fixedBy: 'Serializable (snapshot isolation permits this by design).',
  },
  {
    anomaly: 'Read skew',
    scenario: 'T1 reads X=100 then Y=50 from two tables; in between, another txn moved 30 from X to Y. T1 sees 150 total where truth was 150, but intermediate breakdown is nonsense.',
    fixedBy: 'Snapshot Isolation (single read snapshot).',
  },
];

export const quorumFormula = {
  headline: 'Dynamo-style quorums: W + R > N ⇒ reads see latest committed writes.',
  choices: [
    { config: 'W=N, R=1', effect: 'Fast reads, slow writes. Reads always fresh as long as no node is down.' },
    { config: 'W=1, R=N', effect: 'Fast writes, slow reads. Used when writes dominate and staleness intolerable.' },
    { config: 'W=R=(N+1)/2', effect: 'Balanced majority quorum. Most common DynamoDB / Cassandra default shape.' },
    { config: 'W + R ≤ N', effect: 'Possible to read stale. Only acceptable when eventual consistency is explicitly OK.' },
  ],
};
