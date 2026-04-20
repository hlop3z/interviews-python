// Protocol fundamentals — timeless. No version-specific pins.

export interface OsiLayer {
  layer: number;
  name: string;
  unit: string;
  examples: string;
}

export interface DnsRecord {
  type: string;
  purpose: string;
  example: string;
}

export interface HttpStatusClass {
  range: string;
  meaning: string;
  canonical: string[];
}

export interface CidrRow {
  mask: string;
  addresses: string;
  usableHosts: string;
  typicalUse: string;
}

export const osiLayers: OsiLayer[] = [
  { layer: 1, name: 'Physical',     unit: 'Bits',     examples: 'Cables, wireless radio, fiber' },
  { layer: 2, name: 'Data Link',    unit: 'Frames',   examples: 'Ethernet, MAC addresses, switches' },
  { layer: 3, name: 'Network',      unit: 'Packets',  examples: 'IP, routing, routers' },
  { layer: 4, name: 'Transport',    unit: 'Segments', examples: 'TCP, UDP — ports live here' },
  { layer: 5, name: 'Session',      unit: 'Data',     examples: 'Session mgmt (often merged into app layer)' },
  { layer: 6, name: 'Presentation', unit: 'Data',     examples: 'TLS, compression, encoding' },
  { layer: 7, name: 'Application',  unit: 'Data',     examples: 'HTTP, gRPC, SMTP, DNS' },
];

export const tcpHandshake = {
  summary:
    'Three-way handshake: SYN → SYN/ACK → ACK. Exchanges initial sequence numbers (used to detect lost/reordered packets) and negotiates options (MSS, window scale, SACK).',
  teardown:
    'Four-way teardown: each side sends FIN + receives ACK independently (allows half-close). Shortcut with RST for abnormal termination.',
  keyThings: [
    'Reliable, ordered, byte-stream — the OS re-assembles out-of-order packets for you',
    'Congestion + flow control are built in — rate adapts to network conditions',
    'Connection setup latency: 1 RTT (2 RTTs including TLS setup)',
    'Head-of-line blocking at the transport layer: one lost packet stalls all data behind it',
  ],
};

export const udpFacts = [
  'Connectionless — no handshake, no ordering, no retransmission',
  'One datagram = one packet (no splitting across packets by the transport)',
  'Good for: DNS queries, video/voice (packet loss < retransmission-delay), gaming, QUIC / HTTP-3 underpinning',
  'If you need reliability, you either build it on top (QUIC does) or use TCP',
];

export const tlsHandshakeShape = {
  shape: [
    'Client says hello with supported ciphers + its ephemeral key share',
    'Server picks a cipher, sends its certificate + its key share',
    'Both sides derive the same symmetric session key (never transmitted — Diffie-Hellman style)',
    'All subsequent application data is encrypted with that symmetric key',
  ],
  notes: [
    'Modern TLS completes in 1 RTT (or 0 RTT with session resumption — at the cost of replay risk)',
    'The certificate authenticates the server; mTLS adds client-side authentication',
    'TLS protects confidentiality + integrity + server identity — it does NOT authenticate the application-level user',
  ],
};

export const dnsRecords: DnsRecord[] = [
  { type: 'A',     purpose: 'IPv4 address for a name',               example: 'example.com → 93.184.216.34' },
  { type: 'AAAA',  purpose: 'IPv6 address for a name',               example: 'example.com → 2606:2800:220:1:…' },
  { type: 'CNAME', purpose: 'Alias one name to another name',        example: 'www.example.com → example.com' },
  { type: 'MX',    purpose: 'Mail server for a domain',              example: 'example.com → 10 mail.example.com' },
  { type: 'TXT',   purpose: 'Arbitrary text (SPF, DKIM, verification)', example: 'v=spf1 include:_spf.example.com ~all' },
  { type: 'SRV',   purpose: 'Service location — host + port',        example: '_sip._tcp.example.com → 10 60 5060 sipserver.example.com' },
  { type: 'NS',    purpose: 'Which name servers are authoritative for a zone', example: 'example.com → ns1.example.com' },
  { type: 'PTR',   purpose: 'Reverse lookup — IP to name',           example: '34.216.184.93.in-addr.arpa → example.com' },
  { type: 'CAA',   purpose: 'Which CAs may issue certs for this domain', example: 'example.com CAA 0 issue "letsencrypt.org"' },
];

export const httpStatusClasses: HttpStatusClass[] = [
  {
    range: '1xx',
    meaning: 'Informational — rarely seen in practice',
    canonical: ['101 Switching Protocols (WebSocket upgrade)'],
  },
  {
    range: '2xx',
    meaning: 'Success',
    canonical: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
  },
  {
    range: '3xx',
    meaning: 'Redirection / cache',
    canonical: ['301 Moved Permanently', '302 Found', '304 Not Modified (conditional GET)', '307 Temporary Redirect (preserve method)'],
  },
  {
    range: '4xx',
    meaning: 'Client error — the request is wrong',
    canonical: [
      '400 Bad Request',
      '401 Unauthorized (missing / bad auth)',
      '403 Forbidden (authed but not allowed)',
      '404 Not Found',
      '409 Conflict',
      '422 Unprocessable Entity',
      '429 Too Many Requests',
    ],
  },
  {
    range: '5xx',
    meaning: 'Server error — the server could not fulfill a valid request',
    canonical: [
      '500 Internal Server Error',
      '502 Bad Gateway (upstream returned garbage)',
      '503 Service Unavailable (overloaded / maintenance)',
      '504 Gateway Timeout (upstream did not answer in time)',
    ],
  },
];

export const httpCachingHeaders = [
  { header: 'Cache-Control', purpose: 'Master control. `max-age`, `s-maxage`, `no-store`, `private`, `public`, `must-revalidate`' },
  { header: 'ETag',          purpose: 'Opaque version identifier for a resource. Client sends back `If-None-Match`; server returns 304 if unchanged' },
  { header: 'Last-Modified', purpose: 'Timestamp alternative to ETag. Client sends `If-Modified-Since`' },
  { header: 'Vary',          purpose: 'Tells caches which request headers make a response unique (e.g., `Vary: Accept-Encoding`)' },
  { header: 'Age',           purpose: 'How long (seconds) a cached response has been held' },
];

export const cidrRows: CidrRow[] = [
  { mask: '/32', addresses: '1',          usableHosts: '1',         typicalUse: 'Single host (`10.0.0.1/32`)' },
  { mask: '/30', addresses: '4',          usableHosts: '2',         typicalUse: 'Point-to-point link' },
  { mask: '/29', addresses: '8',          usableHosts: '6',         typicalUse: 'Tiny subnet' },
  { mask: '/24', addresses: '256',        usableHosts: '254',       typicalUse: 'Classic "LAN" size' },
  { mask: '/22', addresses: '1,024',      usableHosts: '1,022',     typicalUse: 'Small team / rack' },
  { mask: '/16', addresses: '65,536',     usableHosts: '65,534',    typicalUse: 'VPC or large private network' },
  { mask: '/8',  addresses: '16,777,216', usableHosts: '16,777,214', typicalUse: '10.0.0.0/8 (RFC1918 private space)' },
];

export const cidrMath = {
  lines: [
    'Each drop of 1 in the prefix doubles the address count.',
    '/32 is one address; every decrement adds a bit to the host portion.',
    'Usable hosts = 2^(32-prefix) − 2 (drop network and broadcast addresses).',
    'Exceptions: /31 (2 addresses, 2 usable — RFC 3021) and /32 (1 address, 1 usable).',
  ],
  subnetting:
    'To split a /24 into four /26s: each /26 has 2^(32-26) = 64 addresses. The original 0–255 splits into 0–63, 64–127, 128–191, 192–255.',
};
