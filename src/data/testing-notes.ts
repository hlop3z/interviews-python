// Testing primitives for backend Python interviews. Scope: test pyramid,
// doubles, pytest idioms, flake causes — enough to sound senior, not a
// pytest reference.

export interface PyramidLevel {
  level: string;
  scope: string;
  speed: string;
  fragility: string;
  roleInInterviews: string;
}

export const pyramidLevels: PyramidLevel[] = [
  {
    level: 'Unit',
    scope: 'One function / class; no I/O, no external services.',
    speed: 'Milliseconds; run thousands per second.',
    fragility: 'Low — fail only when the code truly broke.',
    roleInInterviews: '80% of tests. Cover logic branches, edge cases, boundaries.',
  },
  {
    level: 'Integration',
    scope: 'Multiple units together with real collaborators (DB, cache, queue).',
    speed: 'Tens to hundreds of ms each.',
    fragility: 'Medium — schema drift, fixture data, timing.',
    roleInInterviews: '15%. Cover wiring: migration ran, ORM query works, txn boundaries correct.',
  },
  {
    level: 'End-to-end',
    scope: 'Full system through the public entrypoint (HTTP, CLI).',
    speed: 'Seconds to tens of seconds.',
    fragility: 'High — any cross-cutting change breaks them.',
    roleInInterviews: '5%. One happy path per critical user flow; more is a tax on velocity.',
  },
];

export interface TestDouble {
  name: string;
  what: string;
  useFor: string;
  avoid: string;
}

export const testDoubles: TestDouble[] = [
  {
    name: 'Dummy',
    what: 'Placeholder that satisfies a signature; never called.',
    useFor: 'Filling a required constructor parameter that the test path does not exercise.',
    avoid: 'Using a dummy when the test actually invokes the collaborator — silent pass.',
  },
  {
    name: 'Stub',
    what: 'Returns canned responses to configured calls. No assertions.',
    useFor: 'Testing code that queries something — you control what comes back.',
    avoid: 'Re-implementing the real dependency; stubs should be dumb.',
  },
  {
    name: 'Spy',
    what: 'Records calls made to it; test later asserts what happened.',
    useFor: 'Verifying a logger or analytics call was emitted correctly.',
    avoid: 'Over-asserting on internal calls — couples tests to implementation.',
  },
  {
    name: 'Mock',
    what: 'Pre-programmed with expectations; verifies calls during or after the test.',
    useFor: 'Verifying behavior at a seam, e.g., "payment service was called once with these args."',
    avoid: 'Mocking objects you own. Mock at the boundary of your system, not inside it.',
  },
  {
    name: 'Fake',
    what: 'Working implementation, but simplified (in-memory DB, in-process queue).',
    useFor: 'Integration-ish tests without the real dependency — fast and deterministic.',
    avoid: 'Divergence from real behavior. Test the real thing at least once in CI.',
  },
];

export interface PytestIdiom {
  name: string;
  use: string;
  snippet: string;
}

export const pytestIdioms: PytestIdiom[] = [
  {
    name: 'Parametrize',
    use: 'Run the same test body against a table of inputs.',
    snippet: `@pytest.mark.parametrize("n,expected", [(0, 0), (1, 1), (5, 120)])
def test_factorial(n, expected):
    assert factorial(n) == expected`,
  },
  {
    name: 'Fixture',
    use: 'Shared setup/teardown with arbitrary scope.',
    snippet: `@pytest.fixture
def db():
    conn = make_conn()
    yield conn
    conn.close()`,
  },
  {
    name: 'Fixture scopes',
    use: 'Amortize expensive setup across many tests.',
    snippet: `@pytest.fixture(scope="session")  # or module, class, function
def app():
    return create_app()`,
  },
  {
    name: 'monkeypatch',
    use: 'Patch attribute, env var, or dict entry for one test.',
    snippet: `def test_uses_env(monkeypatch):
    monkeypatch.setenv("FEATURE_X", "on")
    assert feature_enabled("x")`,
  },
  {
    name: 'tmp_path',
    use: 'Per-test temp directory; automatically cleaned up.',
    snippet: `def test_writes_file(tmp_path):
    p = tmp_path / "out.txt"
    write_report(p)
    assert p.read_text() == "ok"`,
  },
  {
    name: 'raises',
    use: 'Assert a block raises an exception.',
    snippet: `def test_rejects_negative():
    with pytest.raises(ValueError, match="must be >= 0"):
        withdraw(-1)`,
  },
  {
    name: 'Marks + filtering',
    use: 'Group tests by speed, tier, or feature; select at CLI.',
    snippet: `@pytest.mark.slow
def test_big_scan(): ...
# Run fast tests only:
#   pytest -m "not slow"`,
  },
];

export interface FlakeCause {
  cause: string;
  symptom: string;
  fix: string;
}

export const flakeCauses: FlakeCause[] = [
  {
    cause: 'Time-dependent assertions',
    symptom: 'Test passes locally, fails on slow CI. "Expected 1.00, got 1.02."',
    fix: 'Freeze time with `freezegun` or inject a clock. Compare with tolerance for timings.',
  },
  {
    cause: 'Shared state between tests',
    symptom: 'Works alone; fails when another test runs first. Order-dependent.',
    fix: 'Reset global/singleton state in teardown. Prefer pure functions and fresh fixtures.',
  },
  {
    cause: 'Network / real external service',
    symptom: 'Fails when the network hiccups or the service is down for maintenance.',
    fix: 'Fake / record-replay (VCR) for most tests. Real network only in a tagged slow suite.',
  },
  {
    cause: 'Concurrency / races',
    symptom: 'Passes 99 times, fails 1 time. Harder on more cores.',
    fix: 'Deterministic scheduling; inject a fake event loop; kill sleeps with explicit sync points.',
  },
  {
    cause: 'Unseeded randomness',
    symptom: 'A rare input pattern fails once per week in CI.',
    fix: 'Fix the seed in conftest.py. Record the failing input on assertion failure.',
  },
  {
    cause: 'Filesystem / tmp collisions',
    symptom: 'Parallel test runs trip over each other on disk.',
    fix: 'Use `tmp_path` (per-test dir). Never hard-code `/tmp/foo`.',
  },
  {
    cause: 'Leaky test data',
    symptom: "Today's test fails because yesterday's test left a row behind.",
    fix: 'Rollback transaction per test; or truncate tables in teardown. Factories over fixtures for volume.',
  },
];

export interface TestingRule {
  rule: string;
  why: string;
}

export const seniorRules: TestingRule[] = [
  {
    rule: 'Test behavior, not implementation.',
    why: 'Implementation-coupled tests break on every refactor without catching real bugs.',
  },
  {
    rule: 'Mock at the boundary — not inside your domain.',
    why: 'Mocking internal collaborators produces tests that pass even when the code is broken.',
  },
  {
    rule: 'Prefer fakes to mocks when you can build one.',
    why: 'Fakes let you write integration tests that exercise real interactions cheaply.',
  },
  {
    rule: 'One logical assertion per test.',
    why: 'Failed test names should answer "what broke" in one line.',
  },
  {
    rule: 'Given-When-Then structure the test body.',
    why: 'Readable failures and reviewable PRs.',
  },
  {
    rule: 'Flaky tests must be fixed or deleted, not retried.',
    why: 'Retry-until-green teaches the team to distrust the suite. Trust is the point.',
  },
  {
    rule: 'Fast feedback > total coverage.',
    why: 'A 30s suite that runs on every save beats a 10-min suite that runs nightly.',
  },
];

export const tddNotes =
  'TDD buys you fast feedback, a design pressure toward testable seams, and a safety net during refactor. It is not a faith — if a test does not pay rent (catching real regressions), it is waste. Skip TDD when the shape is obvious; reach for it when the logic is gnarly or the cost of a bug is high.';
