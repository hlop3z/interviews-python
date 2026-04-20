// Anchor on vulnerability classes, not a numbered OWASP year. Classes are stable.

export interface VulnerabilityClass {
  name: string;
  how: string;
  fix: string;
}

export interface PasswordStorage {
  kind: string;
  verdict: string;
  reason: string;
}

export interface SecretPattern {
  pattern: string;
  goodFor: string;
  weakness: string;
}

export const vulnerabilityClasses: VulnerabilityClass[] = [
  {
    name: 'Injection (SQL, command, LDAP, NoSQL)',
    how: 'User input is concatenated into a query string or shell command, so the input can terminate the intended syntax and inject attacker-controlled statements.',
    fix: 'Parameterized queries / prepared statements. Never string-concatenate user input into SQL. For shells, pass arguments as an array, not via a shell string.',
  },
  {
    name: 'Broken authentication',
    how: 'Guessable passwords, missing MFA, session fixation, long-lived tokens without revocation, credential stuffing.',
    fix: 'Memory-hard KDF for passwords, MFA, short access-token TTLs with refresh-token rotation, rate limiting on login, device fingerprinting for high-risk flows.',
  },
  {
    name: 'Sensitive data exposure',
    how: 'Secrets in source control, unencrypted PII at rest, overly verbose errors, tokens in URLs (which log everywhere).',
    fix: 'Secrets in a vault / KMS, encryption at rest + TLS in transit, strip PII from logs at emit time, never put tokens in query strings.',
  },
  {
    name: 'XML / deserialization attacks',
    how: 'Unsafe deserializers (pickle, Java ObjectInputStream, certain YAML loaders) execute code from untrusted input. XXE lets external entities exfiltrate files.',
    fix: 'Never deserialize untrusted data with unsafe loaders. Use safe loaders (yaml.safe_load, JSON). Disable DTDs / external entities in XML parsers.',
  },
  {
    name: 'Broken access control',
    how: 'Users access resources they should not — horizontal (other tenants\' data) or vertical (admin endpoints from a regular user).',
    fix: 'Authorize at the boundary of every resource, not just at the login page. Never trust client-sent role claims; derive authorization from server-side identity.',
  },
  {
    name: 'Security misconfiguration',
    how: 'Default credentials left in place, debug endpoints exposed, open CORS, unnecessary services enabled, missing security headers.',
    fix: 'Harden defaults, minimize surface area, enable security headers (CSP, HSTS, X-Frame-Options), review third-party integration configs.',
  },
  {
    name: 'XSS — Cross-Site Scripting',
    how: 'User-controlled content rendered to other users without sanitization — attacker scripts run in the victim\'s browser with the victim\'s cookies.',
    fix: 'Context-aware output encoding (different rules for HTML body, attribute, JS, URL). Content Security Policy as defense-in-depth. Template engines that escape by default.',
  },
  {
    name: 'CSRF — Cross-Site Request Forgery',
    how: 'A malicious site tricks a victim\'s browser into sending an authenticated request to your site using the victim\'s existing session cookie.',
    fix: 'SameSite=Lax or Strict cookies; anti-CSRF tokens for state-changing requests; require a custom header (browsers do not send custom headers cross-origin without preflight).',
  },
  {
    name: 'SSRF — Server-Side Request Forgery',
    how: 'User-controlled URL causes your server to make a request — to internal metadata services, private networks, or sensitive endpoints behind your firewall.',
    fix: 'Allow-list of domains; explicit block of private IP ranges (127.0.0.0/8, 169.254.0.0/16, 10/8, 172.16/12, 192.168/16); DNS rebinding protection; no redirects to internal IPs.',
  },
  {
    name: 'Vulnerable / outdated components',
    how: 'A library with a known CVE in your dependency tree — direct or transitive.',
    fix: 'Automated dependency scanning; monitor security advisories for your stack; pin versions and renew them on a schedule. Know your transitive deps — many vulns live four layers deep.',
  },
  {
    name: 'Insufficient logging & monitoring',
    how: 'Attacks go undetected because auth failures, access-control denials, and suspicious patterns are not logged or alerted on.',
    fix: 'Log every auth decision (success AND failure) with context; alert on bursts of failures; separate audit logs from application logs; retain for the window your incident response needs.',
  },
];

export const passwordStorage: PasswordStorage[] = [
  {
    kind: 'Plaintext',
    verdict: 'Never',
    reason: 'A database leak becomes a user-identity leak for every site where people reused that password',
  },
  {
    kind: 'Unsalted hash (MD5, SHA-1, SHA-256)',
    verdict: 'Never',
    reason: 'Rainbow tables crack the entire DB in minutes. Fast hashes were designed for speed, not password storage',
  },
  {
    kind: 'Salted fast hash',
    verdict: 'Discouraged',
    reason: 'Per-user salt stops rainbow tables, but a GPU can still try billions per second. Passwords too weak to survive that',
  },
  {
    kind: 'bcrypt',
    verdict: 'Acceptable',
    reason: 'Slow, salted, with a tunable cost factor. Limited to 72-byte inputs (truncates silently)',
  },
  {
    kind: 'scrypt',
    verdict: 'Good',
    reason: 'Memory-hard — forces GPUs and ASICs to spend expensive RAM per guess',
  },
  {
    kind: 'argon2 (argon2id)',
    verdict: 'Best',
    reason: 'Winner of the Password Hashing Competition. Memory-hard, parallelism-tunable. Modern default',
  },
];

export const jwtTradeoffs = {
  goodFor: [
    'Short-lived access tokens (minutes) in stateless services',
    'Propagating identity across microservice boundaries',
    'Scenarios where the load of hitting a central auth server on every request is unacceptable',
  ],
  badFor: [
    'Long-lived sessions — revocation is hard when the token is self-validating',
    'Storing arbitrary user state — anything in the token grows it and is visible to anyone who holds it',
    'Situations requiring immediate invalidation — token stays valid until it expires unless you maintain a revocation list (which removes the stateless benefit)',
  ],
  mitigations: [
    'Short TTLs (5–15 min) + rotating refresh tokens',
    'Maintain a denylist of revoked jti claims for security-sensitive events (logout, password change, admin revoke)',
    'Never store secrets in JWT payload — it is signed, not encrypted; anyone with the token can read it',
    'Verify `alg` server-side — "alg: none" attacks are still real when libraries accept the client-claimed algorithm',
  ],
};

export const secretsPatterns: SecretPattern[] = [
  {
    pattern: 'Environment variables',
    goodFor: 'Small / early projects; container-native deployments with secret injection',
    weakness: 'Visible to anything in the process (including /proc/<pid>/environ); rotating means redeploying; easy to leak via logs',
  },
  {
    pattern: 'Central secrets service',
    goodFor: 'Multi-team orgs with dynamic secrets, leases, rotation, audit',
    weakness: 'Another service to operate; apps need a bootstrap credential to fetch their secrets',
  },
  {
    pattern: 'Cloud KMS-backed secrets store',
    goodFor: 'Cloud-native deployments where IAM already defines who can access what',
    weakness: 'Couples you to the provider; cost-per-API-call can surprise at high volumes',
  },
  {
    pattern: 'External secrets operator',
    goodFor: 'Kubernetes workloads that want Secret objects materialized from a central store',
    weakness: 'Still stores the secret in etcd (needs encryption-at-rest); pulls-in another control loop',
  },
];

export const canonicalFixes = [
  {
    name: 'SQL injection',
    badCode: "cur.execute(f\"SELECT * FROM users WHERE email = '{email}'\")",
    goodCode: 'cur.execute("SELECT * FROM users WHERE email = %s", (email,))',
    why: 'The driver handles escaping; the SQL is fixed syntactically',
  },
  {
    name: 'XSS',
    badCode: "element.innerHTML = userInput",
    goodCode: "element.textContent = userInput",
    why: 'textContent treats input as text — no tags are parsed. innerHTML parses as HTML and will execute scripts inside',
  },
  {
    name: 'CSRF',
    badCode: "Cookie: session=abc123",
    goodCode: "Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly",
    why: 'SameSite=Lax blocks cross-site POSTs from including the cookie; HttpOnly denies JS access; Secure forces TLS',
  },
];
