// Caching primitives. The System Design hub links here for cache-shape
// decisions; the rate-limiter / scenario pages cite specific rows.

export interface CacheStrategy {
  name: string;
  readFlow: string;
  writeFlow: string;
  whenToUse: string;
  pitfall: string;
}

export const strategies: CacheStrategy[] = [
  {
    name: 'Cache-aside (lazy)',
    readFlow: 'app → cache hit? return : read DB, write cache, return',
    writeFlow: 'app → write DB, invalidate or update cache key',
    whenToUse: 'Default. Simple, resilient to cache failure. Most production systems start here.',
    pitfall: 'Stale reads between DB write and cache invalidation. Thundering herd on hot-key expiry.',
  },
  {
    name: 'Write-through',
    readFlow: 'app → cache (always hit after warm-up)',
    writeFlow: 'app → cache AND DB synchronously in one path',
    whenToUse: 'Read-heavy + no-tolerance for staleness. Config, feature flags, permission lookups.',
    pitfall: 'Every write pays cache latency. Cache outage becomes a write outage unless you fail open.',
  },
  {
    name: 'Write-back (write-behind)',
    readFlow: 'app → cache',
    writeFlow: 'app → cache; cache flushes to DB asynchronously in batches',
    whenToUse: 'High write volume, tolerable durability window. Analytics counters, page-view tallies.',
    pitfall: 'Cache crash loses unflushed writes. Hardest consistency story; avoid for money / identity.',
  },
  {
    name: 'Write-around',
    readFlow: 'Cache populated only by reads (as in cache-aside)',
    writeFlow: 'app → DB only; cache untouched',
    whenToUse: 'Writes that are rarely re-read soon (log ingest, audit trails).',
    pitfall: 'First read after write is always a miss — bad if user just wrote and immediately rereads.',
  },
  {
    name: 'Refresh-ahead',
    readFlow: 'cache returns current value; pre-fetches next value before TTL expires',
    writeFlow: 'Orthogonal — pairs with any write strategy',
    whenToUse: 'Predictable hot keys where a cold-miss spike is unacceptable (trending feeds).',
    pitfall: 'Wasted work refreshing keys nobody asks for again; needs access-prediction signal.',
  },
];

export interface CacheTier {
  tier: string;
  latency: string;
  capacity: string;
  example: string;
  note: string;
}

export const tiers: CacheTier[] = [
  {
    tier: 'Browser / client',
    latency: '0 ms',
    capacity: 'Tens of MB',
    example: 'HTTP Cache-Control, service worker, localStorage',
    note: 'Free. Biggest wins but hardest to invalidate — use short TTL + ETag.',
  },
  {
    tier: 'CDN / edge',
    latency: '10–50 ms',
    capacity: 'Tens of GB per POP',
    example: 'CloudFront, Fastly, Cloudflare',
    note: 'Static assets + public GETs. Cache key = URL + Vary headers.',
  },
  {
    tier: 'Reverse proxy',
    latency: '1–5 ms',
    capacity: 'GBs',
    example: 'Varnish, nginx proxy_cache',
    note: 'Good for server-side HTML fragments and API responses.',
  },
  {
    tier: 'In-process',
    latency: '<100 µs',
    capacity: 'Hundreds of MB',
    example: 'Python dict + LRU, `functools.lru_cache`, caffeine (JVM)',
    note: 'Fastest. No network hop, but cold per-instance and inconsistent across pods.',
  },
  {
    tier: 'Distributed cache',
    latency: '0.5–2 ms',
    capacity: 'TBs',
    example: 'Redis, Memcached',
    note: 'Shared across instances. Often the canonical "the cache."',
  },
  {
    tier: 'Materialized views',
    latency: 'DB latency',
    capacity: 'Unbounded',
    example: 'Postgres matviews, ClickHouse projections',
    note: 'Cache inside the database; refresh sync vs async is the key knob.',
  },
];

export interface CachePitfall {
  name: string;
  symptom: string;
  fix: string;
}

export const pitfalls: CachePitfall[] = [
  {
    name: 'Cache stampede (dogpile)',
    symptom: 'Hot key expires; N concurrent requests all miss and hit the DB at once.',
    fix: 'Single-flight (one loader at a time), probabilistic early expiration, or stale-while-revalidate.',
  },
  {
    name: 'Thundering herd on cold start',
    symptom: 'Cache flush or new deploy → all traffic goes to DB → DB falls over.',
    fix: 'Warm cache before routing traffic; add jitter to TTLs so keys expire at staggered times.',
  },
  {
    name: 'Stale invalidation',
    symptom: 'DB updated but cache not invalidated → wrong value served indefinitely.',
    fix: 'Write path must invalidate or update cache; prefer delete over update to avoid lost-update races.',
  },
  {
    name: 'Negative caching miss',
    symptom: 'Cache only stores hits; misses re-query DB every time.',
    fix: 'Cache "not found" with short TTL to absorb missing-key storms (e.g., scrapers hitting /user/xyz).',
  },
  {
    name: 'Unbounded keys',
    symptom: 'Cache size explodes; eviction thrashes; hit rate plummets.',
    fix: 'Bound cardinality (no per-user query keys without capacity plan); size + LRU eviction + monitoring.',
  },
  {
    name: 'Serialization cost',
    symptom: 'Cache hit but deserializing the blob is slower than re-querying a small DB.',
    fix: 'Measure. Use compact formats (msgpack, protobuf). For tiny objects an in-process cache wins.',
  },
];

export const invalidationRule =
  'There are only two hard things: cache invalidation, naming things, and off-by-one errors. For invalidation specifically — prefer delete-on-write over update-on-write; prefer short TTL over eternal cache; never trust a write-path to invalidate if it can crash mid-flight without compensating logic.';
