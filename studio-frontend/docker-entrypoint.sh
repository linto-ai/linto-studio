#!/bin/sh
set -e

# Rootless entrypoint - runs as non-root user (no privilege escalation needed)
# User flexibility is provided via:
#   - docker run --user 1000:1000
#   - K8s securityContext.runAsUser / runAsGroup
#   - Docker Swarm user: "1000:1000"

echo "=== Rootless studio-frontend starting ==="
echo "Running as: $(id)"
echo "To run as different user, use --user flag or securityContext (no env vars needed)"

# Generate runtime configuration from VUE_APP_* environment variables
echo "Generating runtime configuration..."
cat > /usr/share/nginx/html/config.js << 'CONFIGEOF'
window.VUE_APP_CONFIG = {
CONFIGEOF

# Extract VUE_APP_* vars and write as JS object
env | grep "^VUE_APP_" | while IFS='=' read -r key value; do
  escaped_value=$(echo "$value" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g')
  echo "  \"${key}\": \"${escaped_value}\"," >> /usr/share/nginx/html/config.js
done

echo "};" >> /usr/share/nginx/html/config.js
echo "Runtime configuration generated at /usr/share/nginx/html/config.js"

# Configure port (default 8080 for rootless - ports < 1024 require root)
WEBSERVER_HTTP_PORT=${WEBSERVER_HTTP_PORT:-8080}
echo "Nginx port set to: ${WEBSERVER_HTTP_PORT}"

# Update nginx.conf with the configured port
sed -i "s/listen [0-9]\+;/listen ${WEBSERVER_HTTP_PORT};/" /etc/nginx/nginx.conf

echo "Starting Nginx (rootless)..."
exec nginx -g "daemon off;"
