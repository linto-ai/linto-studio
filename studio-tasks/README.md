# studio-tasks

Scheduled tasks of LinTO Studio. Each run calls studio-api, which does the work, then exits. The schedule belongs to the Kubernetes CronJob that starts it.

## What a run does

It calls `DELETE /api/administration/conversations/expired` on studio-api, which deletes the media whose retention is over (see the `mediaRetention` setting of an organization), with their audio. Each deletion is written to the activity log.

The run prints how many media were deleted and how many could not be.

It ends with code 0 when the call went through, or when no access is given at all (nothing is done). It ends with code 1 when studio-api could not be reached or refused the call, or when the super administrator account is given by half.

## Configuration

| Variable | Description |
|---|---|
| `STUDIO_API_URL` | Base URL of studio-api, without the `/api` suffix |
| `STUDIO_API_KEY` | Platform API key, see below |
| `SUPER_ADMIN_EMAIL` | Email of the super administrator account, see below |
| `SUPER_ADMIN_PWD` | Password of that account |

There are two ways to give the service its access to studio-api:

- **An API key**, `STUDIO_API_KEY`, created in the backoffice (API tokens) with the system administrator role. It has an expiration date: once over, every run fails with a 401 until the key is renewed. When it is set, the super administrator account is never used.
- **The super administrator account**, `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PWD`. At each run the service signs in, reads back its own API key, named `studio-tasks`, from studio-api, then signs out. The key is created at the first run, valid one year, renewed once expired, and listed in the backoffice like any other. This way costs a sign-in and three more calls per run: prefer the API key once the platform is set up.

## Run it

```bash
cp .envdefault .env   # then fill STUDIO_API_KEY
node --env-file=.env index.js
```

Tests have no dependency to install:

```bash
npm test
```

## Kubernetes

The service runs as a CronJob, hourly by default. The linto-studio chart of [linto-deploy](https://github.com/linto-ai/linto-deploy) ships it (`studioTasks` values, off by default): a long run is not joined by the next one, and a failed run is not retried before the next schedule.
