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

# Leaf-first publish order. Always run the full set: root's own
# dependencies on i18n/ui/core are "workspace:*", rewritten to the real
# version by `bun publish` at the moment root is published — commenting out
# entries here (e.g. "already published, skip them") desyncs that rewrite
# from a partial run and publishes root pinned to whatever stale version
# those packages last resolved to, not the one just bumped. That's exactly
# how transcript-ui@0.9.6 ended up depending on transcript-ui-core@0.9.0.
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

echo "Regenerating the lockfile..."
# A plain `bun install` treats an already-resolved workspace member's
# `version` field as unchanged and won't refresh it in bun.lock even after
# bump_version rewrote its package.json — `--force` doesn't help either.
# `bun publish` reads that lockfile-cached version when rewriting root's
# "workspace:*" deps, so a stale entry publishes root pinned to whatever
# version each package *first* had, silently. Deleting the lockfile forces a
# real re-resolution. This is exactly how transcript-ui@0.9.6 (and 0.9.7)
# ended up depending on transcript-ui-core@0.9.0.
rm -f "$root_dir/bun.lock"
(cd "$root_dir" && bun install)

publish_dir() {
  local dir="$1"
  echo
  echo "--- publishing $(basename "$dir") ---"
  (cd "$dir" && NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" bun publish $publish_flag)
}

for name in "${order[@]}"; do
  publish_dir "$root_dir/packages/$name"
done

# Guard against the exact bug this script once shipped: root's
# "workspace:*" deps on i18n/ui/core only resolve correctly at publish time
# if those packages are genuinely at $version. Verify before publishing root
# instead of trusting that every package in `order` actually ran above.
for name in i18n ui core; do
  pkg_version="$(node -p "require('$root_dir/packages/$name/package.json').version")"
  if [ "$pkg_version" != "$version" ]; then
    echo "Refusing to publish root: packages/$name is at $pkg_version, not $version." >&2
    exit 1
  fi
done

publish_dir "$root_dir"

echo
echo "done."
