#!/usr/bin/env bash
# Bumps every publishable package (root + packages/*, skipping "private": true)
# to the SAME version (lockstep), then publishes them in dependency order —
# leaves first, so each package's own deps are already resolvable on the
# registry by the time it's published:
#   i18n -> ui -> core -> the 6 plugins -> webcomponent -> root
#
# Dry-run by default (bun publish --dry-run: builds and packs everything, but
# never actually uploads). Pass --live to really publish.
#
# Usage:
#   ./scripts/publish-all.sh 1.0.0          # dry run — safe to try anytime
#   ./scripts/publish-all.sh 1.0.0 --live   # the real thing
set -euo pipefail

version="${1:-}"
mode="${2:-}"

if [ -z "$version" ]; then
  echo "Usage: $0 <version> [--live]" >&2
  exit 1
fi

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

publish_flag="--dry-run"
if [ "$mode" = "--live" ]; then
  publish_flag=""
  echo "LIVE mode — this will actually publish to the npm registry."
  read -r -p "Publish version $version for real? [y/N] " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 1
  fi
else
  echo "Dry run (pass --live to actually publish) — version $version"
fi

# Leaf-first publish order.
order=(
  i18n
  ui
  core
  plugin-audio
  plugin-chat
  plugin-llm-services
  plugin-subtitle
  plugin-live
  plugin-transcription-editor
  webcomponent
)

bump_version() {
  local pkg_json="$1"
  node -e '
    const fs = require("fs")
    const [, path, version] = process.argv
    const pkg = JSON.parse(fs.readFileSync(path, "utf8"))
    pkg.version = version
    fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n")
  ' "$pkg_json" "$version"
}

echo "Bumping every publishable package to $version..."
bump_version "$root_dir/package.json"
for name in "${order[@]}"; do
  bump_version "$root_dir/packages/$name/package.json"
done

echo "Refreshing the lockfile..."
(cd "$root_dir" && bun install)

publish_dir() {
  local dir="$1"
  echo
  echo "--- publishing $(basename "$dir") ---"
  (cd "$dir" && bun publish $publish_flag)
}

for name in "${order[@]}"; do
  publish_dir "$root_dir/packages/$name"
done
publish_dir "$root_dir"

echo
echo "done."
