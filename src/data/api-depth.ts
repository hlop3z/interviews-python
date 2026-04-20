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
