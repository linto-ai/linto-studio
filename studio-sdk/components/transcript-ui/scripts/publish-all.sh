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
#   ./scripts/publish-all.sh                       # dry run of an unstable build
#   ./scripts/publish-all.sh --live                # the real thing
#   ./scripts/publish-all.sh 1.0.0 --live --yes    # explicit version, no prompt (CI)
#   ./scripts/publish-all.sh 1.0.0-unstable.202610151200 --live --tag latest-unstable
#
# Without a version, an unstable build is published ("latest-unstable"), at
# the version scripts/computeVersion.mjs computes from the registry — the one
# the Jenkinsfile ships from next. Stables are master's job (the Jenkinsfile
# passes the version explicitly).
#
# --tag sets the npm dist-tag (default "latest"); prereleases must use another
# tag so they never become what a plain `npm install` resolves to.
#
# The bump is a one-off: the manifests and bun.lock are put back afterwards,
# so it never ends up in a commit (package.json stays a plain x.y.z floor,
# see computeVersion.mjs).
set -euo pipefail

usage() {
  echo "Usage: $0 [<version>] [--live] [--tag <dist-tag>] [--yes]" >&2
  exit 1
}

version=""
mode=""
dist_tag=""
assume_yes=""

while [ $# -gt 0 ]; do
  case "$1" in
    --live) mode="--live" ;;
    --yes|-y) assume_yes="1" ;;
    --tag)
      [ $# -ge 2 ] || usage
      dist_tag="$2"
      shift
      ;;
    --tag=*) dist_tag="${1#--tag=}" ;;
    -*) usage ;;
    *)
      [ -z "$version" ] || usage
      version="$1"
      ;;
  esac
  shift
done

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
current_version="$(node -p "require('$root_dir/package.json').version")"

if [ -z "$version" ]; then
  version="$(node "$root_dir/scripts/computeVersion.mjs" unstable)"
  dist_tag="${dist_tag:-latest-unstable}"
fi
dist_tag="${dist_tag:-latest}"

if [[ "$version" == *-* && "$dist_tag" == "latest" ]]; then
  echo "Refusing to publish prerelease $version as \"latest\": pass --tag latest-unstable." >&2
  exit 1
fi

publish_flag="--dry-run"
if [ "$mode" = "--live" ]; then
  publish_flag=""
  echo "LIVE mode — this will actually publish to the npm registry (dist-tag: $dist_tag)."
  if [ -z "$assume_yes" ]; then
    read -r -p "Publish version $version for real? [y/N] " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      echo "Aborted."
      exit 1
    fi
  fi
else
  echo "Dry run (pass --live to actually publish) — version $version, dist-tag $dist_tag"
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
  plugin-notice
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

manifests=(package.json bun.lock)
for name in "${order[@]}"; do
  manifests+=("packages/$name/package.json")
done

restore_manifests() {
  tar -C "$root_dir" -xf "$backup_dir/manifests.tar"
  rm -rf "$backup_dir"
  echo "Manifests put back to $current_version."
}

if [ "$version" != "$current_version" ]; then
  backup_dir="$(mktemp -d)"
  tar -C "$root_dir" -cf "$backup_dir/manifests.tar" "${manifests[@]}"
  trap restore_manifests EXIT
fi

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

# build_cmd, when given, runs (from root_dir) before packing/publishing —
# for the two packages that ship a "dist" build artifact (root and
# webcomponent; everything else in `order` publishes raw "src", nothing to
# build). `bun publish` packs whatever is ALREADY in dist/: with no
# prepublishOnly hook wired up, an edit made after the last manual build
# ships silently stale — exactly how webcomponent@0.9.13 went out with a
# Header.vue variant one edit behind its own source.
publish_dir() {
  local dir="$1"
  local build_cmd="${2:-}"
  if [ -n "$build_cmd" ]; then
    echo
    echo "--- building $(basename "$dir") ---"
    (cd "$root_dir" && eval "$build_cmd")
  fi
  echo
  echo "--- publishing $(basename "$dir") ---"
  (cd "$dir" && NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" bun publish --tag "$dist_tag" $publish_flag)
}

for name in "${order[@]}"; do
  if [ "$name" = "webcomponent" ]; then
    publish_dir "$root_dir/packages/$name" "bun run build:wc"
  else
    publish_dir "$root_dir/packages/$name"
  fi
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

publish_dir "$root_dir" "bun run build"

echo
echo "done."
