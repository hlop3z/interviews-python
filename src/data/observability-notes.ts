// Vendor-agnostic observability concepts. No SDK APIs, no product feature matrices.

export interface Pillar {
  name: string;
  question: string;
  shape: string;
  costShape: string;
  strength: string;
  weakness: string;
}

export interface MetricType {
  type: string;
  invariant: string;
  useFor: string;
  example: string;
  pitfall: string;
}

export interface MethodRow {
  method: string;
  target: string;
  measure: string[];
}

export const pillars: Pillar[] = [
  {
    name: 'Metrics',
    question: 'What is the rate / value over time?',
    shape: 'Numeric time series at a sampling interval (every 10s, every 1min)',
    costShape: 'Constant per metric per time window — scales with cardinality, not with traffic',
    strength: 'Cheap, queryable, great for dashboards and alerts',
    weakness: 'No context for individual events — you cannot ask "why did this one request fail"',
  },
  {
    name: 'Logs',
    question: 'What exactly happened?',
    shape: 'Timestamped events — structured (JSON) or unstructured (free text)',
    costShape: 'Scales linearly with traffic; storage + indexing dominates cost',
    strength: 'Detailed, unbounded vocabulary, easiest to add',
    weakness: 'Volume + cardinality blow out costs if not managed; querying at scale is slow',
  },
  {
    name: 'Traces',
    question: 'How did this one request travel through the system?',
    shape: 'Tree of spans per request; each span has start/end + parent span id',
    costShape: 'Expensive at high volume — sampled in practice',
    strength: 'Only pillar that shows cross-service causality for a specific request',
    weakness: 'Requires propagation (every service must pass the trace context); sampled views miss rare problems',
  },
];

export const metricTypes: MetricType[] = [
  {
    type: 'Counter',
    invariant: 'Monotonically non-decreasing; resets only on process restart',
    useFor: 'Counting events: requests received, errors, bytes written',
    example: 'http_requests_total',
    pitfall: 'Never expose as a raw value — always view as rate(x[5m]). Raw counters increase forever',
  },
  {
    type: 'Gauge',
    invariant: 'Arbitrary up-or-down current value',
    useFor: 'Snapshots: queue depth, memory in use, temperature, open connections',
    example: 'queue_depth',
    pitfall: 'Averaging gauges across instances usually loses information — prefer sum, max, or quantile',
  },
  {
    type: 'Histogram',
    invariant: 'Observations bucketed by range; record count + sum + bucket counts',
    useFor: 'Distributions: request latency, response size',
    example: 'http_request_duration_seconds',
    pitfall: 'Quantiles are computed from buckets — accuracy is tied to bucket choice. Bad buckets → bad p99',
  },
  {
    type: 'Summary',
    invariant: 'Client-side computed quantiles at fixed percentiles',
    useFor: 'When you need exact quantiles from a single source and the client-side cost is fine',
    example: 'rpc_duration_seconds{quantile="0.99"}',
    pitfall: 'Quantiles from summaries CANNOT be aggregated across instances — this is the main reason to prefer histograms',
  },
];

export const methods: MethodRow[] = [
  {
    method: 'RED',
    target: 'Request-driven services (APIs, web servers, RPC)',
    measure: ['Rate — requests per second', 'Errors — number or percentage failing', 'Duration — latency distribution (p50, p95, p99)'],
  },
  {
    method: 'USE',
    target: 'Resources (CPU, disk, network, database connections)',
    measure: ['Utilization — % of time the resource was busy', 'Saturation — how much extra work is queued waiting', 'Errors — error events'],
  },
];

export const sloTerms = [
  {
    term: 'SLI — Service Level Indicator',
    body: 'A measured value expressing one aspect of reliability. Typically a ratio: successful requests / total requests, or requests under 300ms / total requests.',
  },
  {
    term: 'SLO — Service Level Objective',
    body: 'A target value for an SLI over a rolling window. "99.9% of requests in the last 28 days return within 300ms." Your internal commitment.',
  },
  {
    term: 'SLA — Service Level Agreement',
    body: 'An SLO written into a contract with a penalty attached. Typically weaker than internal SLOs — if internal is 99.9%, SLA might be 99.5% with credits owed below that.',
  },
  {
    term: 'Error budget',
    body: '1 − SLO, expressed as allowed downtime. A 99.9% SLO over 30 days = ~43 minutes of budget. Spent budget pauses risky releases; unspent budget authorizes them.',
  },
];

export const tracingModel = {
  lines: [
    'A trace is the tree of spans for one request. Each span = one unit of work (an HTTP call, a DB query, a function).',
    'Each span has a span id, a parent span id (null for the root), and a trace id shared across every span in the request.',
    'Context propagation: the trace id + current span id travel in request headers (e.g., W3C Trace Context) so each downstream service can attach its spans to the correct tree.',
    'Sampling: deciding whether to record this trace. Head-based samples at the entry point; tail-based samples after the full trace is assembled (lets you sample errors at 100%).',
  ],
  insight:
    'Tracing only works if every service in the request path propagates context. A single service that drops the incoming trace header breaks the tree downstream — and tracing bugs almost always turn out to be propagation bugs.',
};
