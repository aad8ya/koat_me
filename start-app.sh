#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

function run() {
  echo "➡️  Running: $1"
  (cd "$2" && eval "$1")
}

function run_async() {
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd \"$1\" && $2; exec bash"
  elif command -v open &> /dev/null; then
    osascript <<EOF
tell application "Terminal"
  do script "cd \"$1\" && $2"
end tell
EOF
  else
    echo "⚠️  Could not open a new terminal. Running in background..."
    (cd "$1" && $2 &)
  fi
}

if [[ "$1" == "--setup" ]]; then
  echo "🧱 Starting full setup..."
  echo "\n"

  run "docker-compose up -d" "$ROOT_DIR"

  run "yarn install" "$BACKEND_DIR"
  run "yarn setup:db" "$BACKEND_DIR"
  run "yarn seed" "$BACKEND_DIR"
  run_async "$BACKEND_DIR" "yarn dev"

  run "yarn install" "$FRONTEND_DIR"
  run_async "$FRONTEND_DIR" "yarn dev"
else
  echo "🚀 Starting app (no setup)..."

  run "yarn install" "$BACKEND_DIR"
  run_async "$BACKEND_DIR" "yarn dev"

  run "yarn install" "$FRONTEND_DIR"
  run_async "$FRONTEND_DIR" "yarn dev"
fi
