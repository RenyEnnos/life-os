# AI Agent Protocol

Status: canonical  
Authority: agent execution contract  
Owner: repository maintainer  
Last reviewed: 2026-07-12

## 1. Assignment boundary

An agent receives one issue at a time. The issue is the work contract, but only when its type and status authorize the requested action.

The agent must not infer permission from:

- repository write access;
- an open tracking issue;
- an old plan or PRD;
- a comment from another bot;
- code that appears unfinished;
- a task mentioned in a PR summary;
- the ability to run tools.

## 2. Mandatory opening response

Before editing, the agent must provide:

- objective in its own words;
- included scope;
- excluded scope;
- linked decisions and sources read;
- expected files or areas;
- validation plan;
- stop conditions and unresolved questions.

For a read-only audit, replace the file-change list with an evidence plan.

## 3. Evidence discipline

Every material conclusion must be classified as one of:

- **Observed fact** — directly supported by a path, symbol, command, test, issue, PR, or configuration.
- **Inference** — reasoned from observed facts, with uncertainty stated.
- **Recommendation** — proposed action and trade-offs.
- **Human decision required** — choice the agent may not make.

Agents must not present inferred intent as repository fact.

## 4. Change discipline

- Prefer the smallest reversible change that satisfies the issue.
- Do not refactor adjacent code unless required for the acceptance criteria.
- Do not change formatting across unrelated files.
- Do not introduce a second client, repository, schema, state store, or transport for convenience.
- Preserve public behavior unless the issue explicitly changes it.
- Any data migration needs a migration and rollback plan.
- Any behavior change needs corresponding verification.

## 5. Stop conditions

Stop editing and report when:

- two authoritative sources conflict;
- a required human decision is absent;
- the issue cannot meet the Definition of Ready;
- the proposed change expands scope materially;
- data loss or irreversible migration is possible without an approved plan;
- security boundaries are unclear;
- required credentials or environments are unavailable;
- validation reveals unrelated systemic failure that would tempt broad repair;
- the issue would require a size `L` or `XL` diff.

Stopping is a correct outcome when continuing would require invention.

## 6. Dependencies

A new package, service, GitHub Action, model provider, database, or runtime is a dependency. The agent must follow the dependency policy and may not add it simply because it reduces code.

## 7. Testing and claims

Report:

- command;
- result;
- scope proved;
- scope not proved;
- environment limitations.

Do not claim “all tests pass” when only a subset ran. Do not use Electron evidence for web behavior or browser evidence for packaged desktop behavior unless the approved contract establishes equivalence.

## 8. Pull request behavior

Agents may open PRs when the issue permits it. By default they must:

- open as draft until checks and self-review are complete;
- use the repository template;
- link the issue;
- keep one implementation issue per PR;
- request human review;
- not merge their own PR;
- not automatically start the next issue.

## 9. Completion report

The final report must include:

1. summary;
2. files changed or evidence inspected;
3. acceptance criteria status;
4. validation with actual outcomes;
5. risks and limitations;
6. work intentionally not performed;
7. decisions still required.
