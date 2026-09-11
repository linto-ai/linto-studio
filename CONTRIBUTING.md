# Contributing to LinTO Studio

Thanks for taking the time to contribute. This document describes what we
accept and how to submit it.

## Before opening a pull request

- Open an issue first for anything that is not a trivial fix, so we can agree
  on the approach.
- Check open pull requests to avoid duplicating work.
- Base your work on `next`. `master` only receives releases and hotfixes.
- One topic per pull request. Do not mix a feature with unrelated cleanups.

## Pull request requirements

- Describe what the change does and why. Link the issue.
- Say how you tested it (commands, manual steps, screenshots for UI).
- Keep the diff minimal. Do not reformat files you do not otherwise touch.
- Dependency bumps must be justified: which package, which version, why now.
  A bump that only touches `package-lock.json` for a transitive dev dependency
  is usually not worth a pull request.

## Automated and AI-assisted contributions

We do accept AI-assisted work, under these conditions:

- A human must submit the pull request, understand every changed line, and be
  able to answer review questions about it.
- The description must say that AI assistance was used and list the tests run.
- The change must follow the rules above (issue first, no duplicates, minimal
  diff, tested).

We do **not** accept:

- Pull requests generated and opened by an automated tool without a human
  author who has reviewed the change.
- Unsolicited "security fix" pull requests produced by vulnerability scanners.
  These are closed without review. If you believe you found a real, reachable
  vulnerability, follow [SECURITY.md](SECURITY.md) instead.
- Low-value pull requests: single typo fixes, isolated style changes, blanket
  dependency bumps with no reachable impact.

Repeated automated submissions get the account blocked from the organization.

## Code style

- Run the tests and the formatter check of the package you touch before
  submitting: `npm test` everywhere, `npm run lint` in `studio-frontend` and
  `studio-websocket`, `npm run test:format` in `studio-api`.
- Commit messages: short imperative subject line, details in the body if
  needed.

## Licence

By contributing you agree that your contribution is licensed under the
[project licence](LICENSE).
