#!/usr/bin/env bash
set -e

APP_DIR="/var/www/rwasikh/frontend/RealStateMatching-Frontend"
git config --global --add safe.directory "$APP_DIR" || true

cd "$APP_DIR"
git pull origin main

npm ci
npm run build

sudo systemctl reload nginx
