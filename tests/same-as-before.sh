#!/usr/bin/env bash
# Do Classic and Warp Run still play exactly as they did in the last committed version?
# Plays the same seeded run of each mode in both builds and compares the game state.
# Usage: bash tests/same-as-before.sh [git-ref]     (default: HEAD)
set -euo pipefail
cd "$(dirname "$0")/.."
ref="${1:-HEAD}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp/old"
git show "$ref:index.html" > "$tmp/old/index.html"
node tests/digest.mjs "$tmp/old" > "$tmp/old.json" 2>/dev/null
node tests/digest.mjs "$PWD" > "$tmp/new.json" 2>/dev/null
if grep -q '_errors' "$tmp/new.json"; then echo "SCRIPT ERRORS in the working copy:"; grep -A3 '_errors' "$tmp/new.json"; exit 1; fi
if cmp -s "$tmp/old.json" "$tmp/new.json"; then
  echo "SAME: Classic and Warp Run play exactly as in $ref."
else
  echo "DIFFERENT from $ref. First differences:"
  diff "$tmp/old.json" "$tmp/new.json" | head -12
  exit 1
fi
