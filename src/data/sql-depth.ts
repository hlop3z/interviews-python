// Senior-grade SQL content that goes beyond syntax.
// Kept as typed data so sections render consistently and stay skimmable.

export interface IndexNote {
  kind: string;
  useFor: string;
  gotcha: string;
}

export interface IsolationLevel {
  level: string;
  dirtyRead: string; // "No", "Possible"
  nonRepeatableRead: string;
  phantomRead: string;
  note: string;
}

export interface ExplainSignal {
  signal: string;
  meaning: string;
  fix: string;
}

export interface PaginationStrategy {
  name: string;
  example: string;
  pros: string;
  cons: string;
}

export const indexNotes: IndexNote[] = [
  {
    kind: 'B-tree (default)',
    useFor: 'Equality and range queries on ordered columns; most WHERE, ORDER BY, JOIN conditions',
    gotcha: 'Leading-column rule: a composite index on (a, b, c) can serve queries on a, (a, b), or (a, b, c) — but NOT on b or c alone',
  },
  {
    kind: 'Covering index',
    useFor: 'Queries whose SELECT list is fully included in the index — the DB never touches the table',
    gotcha: 'Adding columns bloats the index; only cover when the query is hot',
  },
  {
    kind: 'Partial index',
    useFor: '"Only index active rows" / "only non-null rows" — shrinks the index and speeds writes',
    gotcha: 'The WHERE predicate on the index must match the query predicate exactly',
  },
  {
    kind: 'Hash index',
    useFor: 'Equality only, at O(1) — some engines (PG) have it, most default to B-tree',
    gotcha: 'Useless for range queries or ORDER BY',
  },
  {
    kind: 'GIN / inverted',
    useFor: 'Full-text search, JSONB, array containment',
    gotcha: 'Write amplification — slower INSERTs; worth it only for search-heavy workloads',
  },
  {
    kind: 'Unique index',
    useFor: 'Enforcing uniqueness + an index for lookups in one structure',
    gotcha: 'On a nullable column, multiple NULLs are allowed in most engines (they compare unequal)',
  },
];

export const isolationLevels: IsolationLevel[] = [
  {
    level: 'Read Uncommitted',
    dirtyRead: 'Possible',
    nonRepeatableRead: 'Possible',
    phantomRead: 'Possible',
    note: 'Rarely a good choice — you see uncommitted writes from other transactions',
  },
  {
    level: 'Read Committed',
    dirtyRead: 'No',
    nonRepeatableRead: 'Possible',
    phantomRead: 'Possible',
    note: 'Default in most engines (PostgreSQL, Oracle). Fine for most OLTP workloads',
  },
  {
    level: 'Repeatable Read',
    dirtyRead: 'No',
    nonRepeatableRead: 'No',
    phantomRead: 'Possible (in standard); PG implements snapshot isolation here, blocking phantoms too',
    note: 'Default in MySQL/InnoDB. Chosen when re-reading rows in a transaction must yield the same values',
  },
  {
    level: 'Serializable',
    dirtyRead: 'No',
    nonRepeatableRead: 'No',
    phantomRead: 'No',
    note: 'Strongest. Cost: more aborts under contention (you must retry). Use for financial invariants',
  },
];

export const explainSignals: ExplainSignal[] = [
  {
    signal: 'Seq Scan on a large table',
    meaning: 'The planner is reading every row — either no usable index or the optimizer chose a scan because the predicate hits most rows',
    fix: 'Add an index on the predicate column; check statistics with `ANALYZE`',
  },
  {
    signal: 'Rows estimate vs actual off by 10×+',
    meaning: 'Stale statistics — the planner is making bad choices from outdated row counts',
    fix: 'Run `ANALYZE` (PostgreSQL) or `ANALYZE TABLE` (MySQL); consider autovacuum tuning',
  },
  {
    signal: 'Nested Loop with a large outer side',
    meaning: 'For each outer row, probing the inner — fine if outer is small, catastrophic otherwise',
    fix: 'Hint or rewrite to encourage Hash Join or Merge Join; ensure join column is indexed on the inner side',
  },
  {
    signal: 'Sort in memory or external merge',
    meaning: 'ORDER BY or DISTINCT forcing a sort that exceeds `work_mem` / equivalent',
    fix: 'Add an index that already provides the order; raise memory limits per query only if needed',
  },
  {
    signal: 'Filter removing most rows after the scan',
    meaning: 'The index (or lack of it) pulled in rows the WHERE clause then discards',
    fix: 'Add a composite or partial index so the filter is applied by the index, not after',
  },
];

export const paginationStrategies: PaginationStrategy[] = [
  {
    name: 'Offset / Limit',
    example: 'SELECT * FROM items ORDER BY id LIMIT 20 OFFSET 1000',
    pros: 'Trivial to implement; supports jumping to page N',
    cons: 'O(offset) — page 1000 reads + discards 20 000 rows. Also non-stable under concurrent writes — items shift between pages',
  },
  {
    name: 'Cursor / Keyset',
    example: 'SELECT * FROM items WHERE id > :last_id ORDER BY id LIMIT 20',
    pros: 'O(limit) regardless of depth; stable under concurrent writes',
    cons: 'No "jump to page N"; requires a strictly-ordered indexed column',
  },
];

export const nPlusOneNote = {
  problem:
    'A parent query returns N rows, then code loops issuing one child query per row — 1 + N round-trips to the DB. Ruins latency on anything more than a handful of rows.',
  signature:
    'You see the same child query in your DB logs repeated with different parameters, once per parent row.',
  fixes: [
    'Join the child query into the parent (INNER / LEFT JOIN) when the result shape allows',
    'Use `WHERE id IN (…)` with the list of parent IDs, then group in code',
    'In ORMs, use eager-loading hints (`include`, `joinedload`, `preload`) — but verify with query logs; some ORMs still issue N queries under the hood',
  ],
};
