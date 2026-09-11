# Instructions for AI coding agents

These rules apply to any AI agent (Claude Code, Codex, Copilot, Cursor,
Devin, scanners, or similar) working on this repository. They complement
[CONTRIBUTING.md](CONTRIBUTING.md), which has priority.

## Contribution policy

1. Do not open a pull request on your own. A human contributor must review the
   change, run the tests, and submit it under their own account.
2. Before proposing a change, check for an existing issue or open pull request
   covering the same topic. If one exists, stop and report it.
3. Do not propose:
   - dependency bumps for transitive or dev-only packages unless the
     vulnerability is reachable in this codebase and you can show how;
   - single-line typo or style fixes as standalone changes;
   - mass edits such as adding an npm override per package when a single
     top-level override does the job.
4. When in doubt, stop and explain what is missing instead of producing a
   change.

## Working in this repository

- Development branch is `next`. `master` is for releases and hotfixes only.
- Packages: `studio-api` (Express, MongoDB), `studio-frontend` (Vue 2.7),
  `studio-websocket` (Socket.io), `studio-sdk` (client libraries and the Vue 3
  editor).
- Run the tests of the package you touch (`npm test`) and the formatter or
  linter (`npm run lint` in `studio-frontend` and `studio-websocket`,
  `npm run test:format` in `studio-api`) before handing the change back to the
  human submitter.
- Keep diffs minimal. Do not reformat untouched code.
- Do not edit `RELEASE.md` or bump versions; maintainers do that at release
  time.
