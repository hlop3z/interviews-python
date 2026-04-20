import type { Tradeoff } from './types';

export interface IdempotencyRow {
  method: string;
  safe: string;   // "Yes" / "No"
  idempotent: string;
  note: string;
}

export interface OAuthGrant {
  name: string;
  useCase: string;
  flow: string;
  status: string; // "Recommended" / "Discouraged" / "Deprecated"
}

export interface RateLimitPlacement {
  where: string;
  good: string;
  bad: string;
}

export const idempotencyTable: IdempotencyRow[] = [
  {
    method: 'GET',
    safe: 'Yes',
    idempotent: 'Yes',
    note: 'Must not mutate state. Caches rely on this',
  },
  {
    method: 'HEAD',
    safe: 'Yes',
    idempotent: 'Yes',
    note: 'Metadata only — same semantics as GET minus body',
  },
  {
    method: 'OPTIONS',
    safe: 'Yes',
    idempotent: 'Yes',
    note: 'Pre-flight / capability discovery',
  },
  {
    method: 'PUT',
    safe: 'No',
    idempotent: 'Yes',
    note: 'Replace at a known URL — PUT-ing twice yields the same state',
  },
  {
    method: 'DELETE',
    safe: 'No',
    idempotent: 'Yes',
    note: 'After the first delete, subsequent deletes are no-ops (or 404 — still idempotent-equivalent)',
  },
  {
    method: 'POST',
    safe: 'No',
    idempotent: 'No',
    note: 'Two POSTs = two resources. Use an Idempotency-Key header to fix this for payment-like endpoints',
  },
  {
    method: 'PATCH',
    safe: 'No',
    idempotent: 'Not guaranteed',
    note: 'Can be idempotent (full-replace patches) or not (counter increments). State which in your API docs',
  },
];

export const idempotencyKeyPattern = {
  shape: 'Client generates a UUID → sends it as `Idempotency-Key: <uuid>` header → server stores (key → response) with a TTL → duplicate requests return the cached response.',
  invariants: [
    'Key TTL must be at least as long as the longest plausible client retry window (hours, not seconds)',
    'Key space must be scoped to (tenant, endpoint) to prevent collisions across customers',
    'Response cache must include the HTTP status code, not just the body',
    'Payload-hash check: if the same key arrives with a DIFFERENT body, return 422 — the client has a bug',
  ],
};

export const oauthGrants: OAuthGrant[] = [
  {
    name: 'Authorization Code + PKCE',
    useCase: 'Web apps, mobile apps, SPAs — the modern default',
    flow: 'User → authorize → code → exchange for token with PKCE verifier',
    status: 'Recommended',
  },
  {
    name: 'Client Credentials',
    useCase: 'Machine-to-machine — no user involved',
    flow: 'Client authenticates with its own credentials, gets a token',
    status: 'Recommended',
  },
  {
    name: 'Device Code',
    useCase: 'Input-constrained devices (TVs, CLI tools)',
    flow: 'Device shows a code → user enters it on another device → device polls for token',
    status: 'Recommended',
  },
  {
    name: 'Refresh Token',
    useCase: 'Renew access tokens without re-prompting the user',
    flow: 'Token response includes a refresh_token; exchange it for a new access_token',
    status: 'Recommended (with rotation)',
  },
  {
    name: 'Implicit',
    useCase: 'Historically SPAs — supplanted by Authorization Code + PKCE',
    flow: 'Redirects return the token directly in the URL fragment',
    status: 'Discouraged (OAuth 2.1)',
  },
  {
    name: 'Resource Owner Password',
    useCase: 'Legacy: first-party clients exchanging username/password for a token',
    flow: 'Client posts credentials directly to the token endpoint',
    status: 'Deprecated',
  },
];

export const rateLimitPlacement: RateLimitPlacement[] = [
  {
    where: 'Edge / CDN',
    good: 'Cheapest layer to drop abusive traffic; protects origin bandwidth',
    bad: 'Coarse — typically per-IP; cannot see app-level identity',
  },
  {
    where: 'API gateway',
    good: 'Can key on API key / tenant; central config; protects all services uniformly',
    bad: 'Single point of policy — subtle bugs affect everything',
  },
  {
    where: 'Application',
    good: 'Full request context; per-endpoint or per-user limits',
    bad: 'Each service reimplements the same logic; hot-path overhead if not cached',
  },
];

export interface JwtPitfall {
  name: string;
  risk: string;
  mitigation: string;
}

export const jwtPitfalls: JwtPitfall[] = [
  {
    name: 'alg=none',
    risk: 'Server accepts tokens with `"alg": "none"` — any attacker can forge an admin token.',
    mitigation: 'Allowlist accepted algorithms explicitly. Reject `none`. Pin the alg server-side.',
  },
  {
    name: 'HS256 vs RS256 confusion',
    risk: 'Public key treated as HMAC secret; attacker signs HS256 tokens with the public key.',
    mitigation: 'Bind the verification key to the expected algorithm. Never accept a JWT whose alg does not match your config.',
  },
  {
    name: 'No expiry or long expiry',
    risk: 'Stolen token is valid for days; no way to revoke without rebuilding everything.',
    mitigation: 'Short-lived access tokens (5–15 min). Pair with refresh tokens + rotation.',
  },
  {
    name: 'No revocation story',
    risk: 'User logs out / is disabled, but the token still validates until expiry.',
    mitigation: 'Short expiry + refresh rotation; or token version in claim checked against DB on sensitive ops.',
  },
  {
    name: 'Claims put on the client',
    risk: 'Role claim in the JWT trusted blindly; attacker replays an old, privileged token.',
    mitigation: 'Treat JWT as authn (who), not authz (what). Re-check permissions server-side for sensitive ops.',
  },
  {
    name: 'Big payloads in JWT',
    risk: 'Every request carries 4 KB of claims; headers blow up, edge caches refuse them.',
    mitigation: 'Keep JWT to essential identity claims. Store the rest server-side, keyed by user id.',
  },
  {
    name: 'JWT in localStorage',
    risk: 'Any XSS = full token theft, because localStorage is readable from JS.',
    mitigation: 'HttpOnly + Secure + SameSite cookie. Or server-side session with short JWT-like claim.',
  },
];

export interface SessionVsToken {
  aspect: string;
  sessionCookie: string;
  jwtToken: string;
}

export const sessionVsToken: SessionVsToken[] = [
  {
    aspect: 'Storage',
    sessionCookie: 'Session id in an HttpOnly cookie; state on server.',
    jwtToken: 'Signed claims on the client; server is stateless.',
  },
  {
    aspect: 'Revocation',
    sessionCookie: 'Instant — delete server-side session.',
    jwtToken: 'Hard — wait for expiry or maintain a blocklist.',
  },
  {
    aspect: 'Horizontal scale',
    sessionCookie: 'Needs shared session store (Redis) or sticky sessions.',
    jwtToken: 'Any node can verify independently — no shared state.',
  },
  {
    aspect: 'Cross-origin / mobile',
    sessionCookie: 'Cookie semantics can be painful across domains; CSRF risk.',
    jwtToken: 'Simple: add Authorization: Bearer header.',
  },
  {
    aspect: 'CSRF',
    sessionCookie: 'Needs explicit defense (SameSite, CSRF token).',
    jwtToken: 'Not applicable if sent via Authorization header (not a cookie).',
  },
  {
    aspect: 'Payload size',
    sessionCookie: 'Tiny — just a session id.',
    jwtToken: 'Grows with claims; often 500 B–2 KB per request.',
  },
];

export const sessionVsTokenRule =
  'Default to HttpOnly session cookies for first-party web apps. Reach for JWT when you need stateless verification across many services, mobile clients, or federated auth.';

export interface PaginationMode {
  name: string;
  howItWorks: string;
  bestFor: string;
  failureMode: string;
}

export const paginationModes: PaginationMode[] = [
  {
    name: 'Offset / LIMIT+OFFSET',
    howItWorks: '`?page=5&size=20` → `LIMIT 20 OFFSET 100`.',
    bestFor: 'Small, mostly-static datasets. Admin tables.',
    failureMode: 'Slow at large offsets (DB scans all skipped rows). Duplicates / skips on concurrent inserts.',
  },
  {
    name: 'Keyset / cursor',
    howItWorks: '`?after=<last_id>&size=20` → `WHERE id > ? ORDER BY id LIMIT 20`.',
    bestFor: 'Large feeds; infinite scroll; append-heavy data.',
    failureMode: 'Cannot jump to page N; cursor must be derived from a unique sorted column.',
  },
  {
    name: 'Seek (composite key)',
    howItWorks: '`WHERE (created_at, id) > (?, ?) ORDER BY created_at, id`.',
    bestFor: 'Sorted by a non-unique column (timestamp). Stable across ties.',
    failureMode: 'Index must cover all sort columns, in order.',
  },
  {
    name: 'Opaque cursor',
    howItWorks: 'Server returns a signed/encoded cursor; client treats it as opaque.',
    bestFor: 'Public APIs — lets you change pagination internals without breaking clients.',
    failureMode: 'Clients cannot jump or inspect; caching becomes harder.',
  },
];

export interface WebhookPractice {
  rule: string;
  why: string;
}

export const webhookPractices: WebhookPractice[] = [
  {
    rule: 'Sign every webhook with HMAC; include a timestamp.',
    why: 'Subscribers must be able to verify origin and reject replays beyond a small skew window.',
  },
  {
    rule: 'Deliver at-least-once; document idempotency.',
    why: 'Subscribers will get duplicates — they need a key to dedupe on, and you need to document the retry policy.',
  },
  {
    rule: 'Retry with exponential backoff + jitter.',
    why: 'Failed endpoints recover; backoff avoids hammering. Jitter avoids thundering herd at retry time.',
  },
  {
    rule: 'Deliver asynchronously — never block the business transaction on webhook delivery.',
    why: 'A slow or down subscriber should never delay the user flow. Use an outbox + worker.',
  },
  {
    rule: 'Expose a dashboard: last delivery, status, payload, retry button.',
    why: 'Subscribers debug their side without filing a ticket. Essential for integrations at scale.',
  },
  {
    rule: 'Allow subscribers to configure which events they care about.',
    why: 'Reduces load on both sides and avoids leaking unrelated event types.',
  },
];

export interface ResilienceKnob {
  name: string;
  purpose: string;
  typicalValue: string;
  mistake: string;
}

export const resilienceKnobs: ResilienceKnob[] = [
  {
    name: 'Timeout',
    purpose: 'Bound how long a call may take.',
    typicalValue: '1–5s for synchronous RPC; 30–60s for rare heavy calls.',
    mistake: 'No timeout → one slow dep exhausts every thread/connection in the caller.',
  },
  {
    name: 'Retry',
    purpose: 'Recover from transient failure.',
    typicalValue: '2–3 attempts, exponential backoff, jitter, cap on total time.',
    mistake: 'Retrying non-idempotent writes without an idempotency key — creates duplicates.',
  },
  {
    name: 'Circuit breaker',
    purpose: 'Stop calling a failing dependency; fail fast until it recovers.',
    typicalValue: 'Open after 50% error rate over N requests; half-open after 30s.',
    mistake: 'Too eager opening → blip becomes outage. Too slow → dep takes you down.',
  },
  {
    name: 'Bulkhead',
    purpose: 'Partition resources per downstream so one failing dep cannot exhaust shared pools.',
    typicalValue: 'Separate connection pool / thread pool / semaphore per dep.',
    mistake: 'One global pool → slow dep A takes down calls to healthy dep B.',
  },
  {
    name: 'Rate limit (client-side)',
    purpose: 'Do not overwhelm a dep that is recovering or has its own limits.',
    typicalValue: 'Token bucket at 80% of dep\'s declared limit.',
    mistake: 'Ignoring 429 responses; retrying immediately amplifies the overload.',
  },
  {
    name: 'Hedged request',
    purpose: 'Fire a second request after p95 latency; take whichever responds first.',
    typicalValue: 'Only for idempotent reads with tight latency SLO.',
    mistake: 'Doubles load on the slow path; combine with tight timeouts.',
  },
];

export const retryRule =
  'Retry is only safe on idempotent calls OR calls that carry an idempotency key. Before adding a retry, ask: if this fires twice, is the outcome the same? If not, fix that first.';

export const restVsRpcVsGraphqlTradeoff: Tradeoff = {
  topic: 'REST vs GraphQL',
  labelA: 'REST',
  labelB: 'GraphQL',
  criteria: [
    {
      criterion: 'Shape of response',
      optionA: 'Fixed per endpoint',
      optionB: 'Client-specified — only the fields asked for',
    },
    {
      criterion: 'Over / under-fetching',
      optionA: 'Common — endpoints return more or less than the UI needs',
      optionB: 'Minimized — client asks for exactly what it renders',
    },
    {
      criterion: 'Caching',
      optionA: 'Free via HTTP (ETag, Cache-Control, CDN)',
      optionB: 'Requires app-level or persisted-query caching',
    },
    {
      criterion: 'N+1 on the server',
      optionA: 'Per-endpoint control — rare',
      optionB: 'Common pitfall — mitigate with DataLoader / batching',
    },
    {
      criterion: 'Learning curve',
      optionA: 'Low — just HTTP verbs',
      optionB: 'Higher — schema, resolvers, batching',
    },
    {
      criterion: 'Best for',
      optionA: 'Public APIs, resource-centric CRUD, CDN-cacheable reads',
      optionB: 'Complex UIs with varied data shapes; mobile over slow networks',
    },
  ],
  rule: 'REST by default. Reach for GraphQL when multiple clients need differently-shaped views of the same data and the team can own the batching / caching complexity.',
};
