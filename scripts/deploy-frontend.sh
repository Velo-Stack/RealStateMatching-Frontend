#!/usr/bin/env bash
set -e

APP_DIR="/var/www/rwasikh/frontend/RealStateMatching-Frontend"
git config --global --add safe.directory "$APP_DIR" || true

cd "$APP_DIR"
git pull origin main

npm ci
npm run build

# Verify production bundle does not embed localhost API URL
if grep -R "localhost:4000" dist/assets/*.js 2>/dev/null; then
  echo "ERROR: production build still references localhost:4000"
  exit 1
fi

sudo systemctl reload nginx
