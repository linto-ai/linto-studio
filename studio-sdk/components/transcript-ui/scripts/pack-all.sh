#!/usr/bin/env bash
# Packs every publishable package (root + packages/*, skipping "private": true)
# into .pack/ at the repo root — one real npm tarball per package, with
# "workspace:*" deps rewritten to their resolved version, exactly like a real
# `npm publish` would produce. Handy to test installs before actually publishing.
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest="$root_dir/.pack"
mkdir -p "$dest"

pack_dir() {
  local dir="$1"
  local pkg_json="$dir/package.json"
  [ -f "$pkg_json" ] || return 0

  if grep -q '"private": *true' "$pkg_json"; then
    echo "skip (private): $dir"
    return 0
  fi

  local name
  name=$(grep -m1 '"name"' "$pkg_json" | sed -E 's/.*"name": *"([^"]+)".*/\1/')
  echo "packing $name"
  (cd "$dir" && bun pm pack --quiet --destination "$dest")
}

pack_dir "$root_dir"
for dir in "$root_dir"/packages/*/; do
  pack_dir "${dir%/}"
done

echo
echo "done — tarballs in $dest"
ls -1 "$dest"
