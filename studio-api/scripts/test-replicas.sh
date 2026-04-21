#!/usr/bin/env bash
#
# test-replicas.sh — spawn multiple studio-api replicas locally to verify
# that the MQTT shared subscription distributes activity-log messages in
# round-robin across replicas.
#
# Usage:
#   ./scripts/test-replicas.sh [REPLICA_COUNT] [ENV_FILE]
#
# Examples:
#   ./scripts/test-replicas.sh              # 2 replicas, no env file
#   ./scripts/test-replicas.sh 3            # 3 replicas
#   ./scripts/test-replicas.sh 2 ../.env    # 2 replicas, load env from file
#   NO_REDIS=1 ./scripts/test-replicas.sh   # disable Redis (test DB fallback
#                                           #   for activity log channel state)
#
# Each replica listens on a distinct port (8001, 8011, 8021, ...) and its
# stdout/stderr is prefixed with [replica-N pid=PID] so you can tell which
# process received a given message. Watch for the
#
#   [activityLog/$share] replica pid=... received N session(s) ...
#
# lines: they should ALTERNATE across replicas when you toggle streams.
#
# Ctrl+C kills all replicas cleanly.

set -euo pipefail

REPLICA_COUNT="${1:-2}"
ENV_FILE="${2:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO_API_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${STUDIO_API_DIR}"

if [[ -n "${ENV_FILE}" ]]; then
  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "env file not found: ${ENV_FILE}" >&2
    exit 1
  fi
  echo "loading env from ${ENV_FILE}"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

if [[ -z "${BROKER_HOST:-}" ]]; then
  echo "warning: BROKER_HOST is not set — make sure your shell env has the" >&2
  echo "studio-api variables exported, or pass an env file as 2nd argument." >&2
fi

PIDS=()

cleanup() {
  echo
  echo "stopping ${#PIDS[@]} replica(s)..."
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null || true
    fi
  done
  wait 2>/dev/null || true
  echo "all replicas stopped."
}
trap cleanup INT TERM EXIT

export DEBUG="${DEBUG:-linto:components:BrokerClient:*,linto:components:IoHandler:index}"
export NODE_ENV="${NODE_ENV:-development}"

# NO_REDIS=1 disables the Socket.IO Redis adapter so MqttActivityLog falls
# back to MongoDB queries. Useful to validate the multi-replica path
# without Redis as the shared state store.
if [[ "${NO_REDIS:-}" == "1" ]]; then
  echo "NO_REDIS=1 → unsetting SOCKETIO_REDIS_HOST (in-memory adapter,"
  echo "             activity log will use MongoDB as state source)"
  unset SOCKETIO_REDIS_HOST
fi

for ((i = 1; i <= REPLICA_COUNT; i++)); do
  # replica-1 takes the standard 8001 port so you can point your frontend
  # at it; subsequent replicas go to 8011, 8021, ...
  port=$((8001 + (i - 1) * 10))
  echo "starting replica-${i} on port ${port}..."

  # studio-api reads WEBSERVER_HTTP_PORT (see components/WebServer/index.js).
  # Override it per replica so each binds a distinct port.
  (
    WEBSERVER_HTTP_PORT="${port}" node app.js 2>&1 \
      | sed -u "s/^/[replica-${i} pid=$BASHPID] /"
  ) &
  PIDS+=("$!")

  sleep 0.3
done

echo
echo "=============================================================="
echo "${REPLICA_COUNT} replica(s) running. Ports: $(
  for ((i = 1; i <= REPLICA_COUNT; i++)); do
    printf "%d " $((8001 + (i - 1) * 10))
  done
)"
echo "Press Ctrl+C to stop."
echo "=============================================================="
echo

wait
