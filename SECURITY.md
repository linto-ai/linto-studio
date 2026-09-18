# Security policy

## Reporting a vulnerability

Do not open a public issue or pull request for a security problem.

Send a report to **contact@linto.ai** with:

- the affected component and version;
- a description of the issue and its impact;
- steps or a proof of concept to reproduce it.

We acknowledge reports within 5 working days and keep you informed of the fix
timeline.

## Scope

Reports about a vulnerable transitive dependency are only considered when the
vulnerable code path is reachable from LinTO Studio. A scanner match on
`package-lock.json` alone is not a security report.

Unsolicited automated "security fix" pull requests are closed without review.
