// Provider-agnostic CI/CD concepts. No YAML snippets — those age with the provider.

export interface CICDConcept {
  title: string;
  summary: string;
  detail: string;
}

export const cicdConcepts: CICDConcept[] = [
  {
    title: 'Matrix builds',
    summary: 'Run the same pipeline across multiple inputs in parallel.',
    detail:
      'Define an axis (e.g., Node versions, OS, database versions) — the runner expands the pipeline into one job per combination. Keeps configuration tiny and compatibility coverage high. Flip the matrix to a single entry when you need a quick smoke run.',
  },
  {
    title: 'Cache keys are hashes, not branches',
    summary: 'Key caches on the lockfile hash, not on the branch name.',
    detail:
      'A cache keyed on `main` pollutes across unrelated PRs. A cache keyed on `hash(package-lock.json)` stays valid exactly as long as the dependency tree is stable, and invalidates automatically when dependencies change. Falls back through a hierarchy of progressively more permissive keys.',
  },
  {
    title: 'Short-lived cloud credentials beat long-lived secrets',
    summary: 'Federate your CI to the cloud (OIDC-style) instead of storing static keys.',
    detail:
      'Cloud IAM providers let a CI job assume a role by exchanging a signed identity token for short-lived credentials (minutes). No long-lived access key lives in the CI vault, so there is nothing to rotate and nothing to leak. The concept is provider-agnostic — the names differ (OIDC, workload identity, workflow trust) but the shape is the same.',
  },
  {
    title: 'Branch protection + required checks',
    summary: 'Merges to main require specific CI jobs to pass.',
    detail:
      'The gate is not "CI ran" but "these named checks succeeded". A check marked required but never reporting blocks merges silently — keep the set small and intentional. Pair with a "CODEOWNERS-style" review requirement to catch logic the pipeline cannot.',
  },
  {
    title: 'Artifact promotion: build once, deploy many',
    summary: 'Build a single immutable artifact; promote the same one through environments.',
    detail:
      'Anti-pattern: rebuild for staging, rebuild for prod. You ship untested bytes. Correct: build once, tag by git SHA, push to an artifact registry, deploy the identical bytes to dev → staging → prod. Configuration differs per environment — artifacts do not.',
  },
  {
    title: 'Fail-fast vs continue-on-error',
    summary: 'Two strategies for how the pipeline handles a failing step.',
    detail:
      'Fail-fast: one step dies, the rest stop. Best for unit tests where a type error in one file makes the rest meaningless. Continue-on-error: run everything, collect all failures. Best for linters and matrix jobs — you want the full set of failures in one run, not one at a time over six retries.',
  },
];
