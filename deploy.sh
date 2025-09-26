#!/bin/bash
set -euo pipefail

cd /var/www/all4esthetic.com

echo "[deploy] Logging in to GHCR..."
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

echo "[deploy] Pulling latest image (done automatically by stack deploy)..."
git pull

echo "[deploy] Deploying with Docker Stack..."
docker stack deploy -c docker-compose.yml all4esthetic

echo "[deploy] Deployment complete."
