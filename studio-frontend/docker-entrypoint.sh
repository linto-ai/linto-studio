#!/bin/sh
set -e

# Set default UID and GID (defaults to nginx: 101:101 if not specified)
USER_ID=${USER_ID:-101}
GROUP_ID=${GROUP_ID:-101}

# Default values for user and group names
USER_NAME="appuser"
GROUP_NAME="appgroup"

# Check and apply chown only if necessary
safe_chown() {
    target="$1"
    user="$2"
    group="$3"

    # Get the current uid and gid of the target
    cur_uid=$(stat -c "%u" "$target")
    cur_gid=$(stat -c "%g" "$target")

    # Get the target uid and gid
    wanted_uid=$(id -u "$user")
    wanted_gid=$(getent group "$group" | cut -d: -f3)

    # Do nothing if already owned by the target user and group
    if [ "$cur_uid" = "$wanted_uid" ] && [ "$cur_gid" = "$wanted_gid" ]; then
        echo "$target already owned by $user:$group"
    else
        echo "chown -R $user:$group $target"
        chown -R "$user:$group" "$target"
    fi
}

# Check and apply chmod only if necessary
safe_chmod() {
    target="$1"
    wanted_mode="$2"
    # Accepts mode in octal format (e.g., 700)
    cur_mode=$(stat -c "%a" "$target")
    if [ "$cur_mode" = "$wanted_mode" ]; then
        echo "$target already has permissions $wanted_mode"
    else
        echo "chmod -R $wanted_mode $target"
        chmod -R "$wanted_mode" "$target"
    fi
}

# Function to create a user/group if needed and adjust permissions
setup_user() {
    echo "Configuring runtime user with UID=$USER_ID and GID=$GROUP_ID"

    # Check if a group with the specified GID already exists
    if getent group "$GROUP_ID" >/dev/null 2>&1; then
        GROUP_NAME=$(getent group "$GROUP_ID" | cut -d: -f1)
        echo "A group with GID=$GROUP_ID already exists: $GROUP_NAME"
    else
        # Create the group if it does not exist
        echo "Creating group with GID=$GROUP_ID"
        addgroup -g "$GROUP_ID" "$GROUP_NAME"
    fi

    # Check if a user with the specified UID already exists
    if getent passwd "$USER_ID" >/dev/null 2>&1; then
        USER_NAME=$(getent passwd "$USER_ID" | cut -d: -f1)
        echo "A user with UID=$USER_ID already exists: $USER_NAME"
    else
        # Create the user if it does not exist
        echo "Creating user with UID=$USER_ID and GID=$GROUP_ID"
        adduser -D -u "$USER_ID" -G "$GROUP_NAME" "$USER_NAME"
    fi

    # Get the user's home directory from the system
    USER_HOME=$(getent passwd "$USER_NAME" | cut -d: -f6)

    # Ensure the home directory exists
    if [ ! -d "$USER_HOME" ]; then
        echo "Ensure home directory exists: $USER_HOME"
        mkdir -p "$USER_HOME"
    fi

    # Adjust ownership of the application directories
    if [ "${DEVELOPMENT}" = "true" ]; then
        echo "Development mode: skipping ownership changes to preserve volume mounts"
    else
        # Production mode: adjust ownership (separate commands to ensure all run)
        echo "Adjusting ownership of application directories"
        chown -R "$USER_NAME:$GROUP_NAME" /usr/share/nginx/html
        chown -R "$USER_NAME:$GROUP_NAME" /var/cache/nginx
        # Replace log symlinks with actual files (symlinks to /dev/stdout aren't writable after gosu)
        rm -f /var/log/nginx/access.log /var/log/nginx/error.log
        touch /var/log/nginx/access.log /var/log/nginx/error.log
        chown -R "$USER_NAME:$GROUP_NAME" /var/log/nginx
        touch /var/run/nginx.pid && chown "$USER_NAME:$GROUP_NAME" /var/run/nginx.pid

        # Grant full permissions to the user on their home directory
        echo "Granting full permissions to $USER_NAME on $USER_HOME"
        safe_chown "$USER_HOME" "$USER_NAME" "$GROUP_NAME"
        safe_chmod "$USER_HOME" "744"
    fi

    # Grant full permissions to the user on their home directory
    echo "Granting full permissions to $USER_NAME on $USER_HOME"
    chmod -R u+rwx "$USER_HOME"
}

# Generate runtime configuration from VUE_APP_* environment variables
echo "Generating runtime configuration..."
cat > /usr/share/nginx/html/config.js << 'CONFIGEOF'
window.VUE_APP_CONFIG = {
CONFIGEOF

# Extract VUE_APP_* vars and write as JS object
# Use temporary file to handle special characters properly
env | grep "^VUE_APP_" | while IFS='=' read -r key value; do
  # Keep the full key name with VUE_APP_ prefix for getEnv.js compatibility
  # Escape special characters in value for JSON string
  escaped_value=$(echo "$value" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g')
  echo "  \"${key}\": \"${escaped_value}\"," >> /usr/share/nginx/html/config.js
done

echo "};" >> /usr/share/nginx/html/config.js

echo "Runtime configuration generated at /usr/share/nginx/html/config.js"

if [ -z "$WEBSERVER_HTTP_PORT" ]; then
  echo "WEBSERVER_HTTP_PORT is not set. Defaulting to port 80."
  WEBSERVER_HTTP_PORT=80
fi

echo "Nginx port set to: ${WEBSERVER_HTTP_PORT}"
cp /etc/nginx/nginx.conf /tmp/nginx.conf
sed -i "s/listen [0-9]\+;/listen ${WEBSERVER_HTTP_PORT};/" /tmp/nginx.conf
cp /tmp/nginx.conf /etc/nginx/nginx.conf

setup_user

echo "Starting Nginx..."
exec gosu "$USER_NAME" nginx -g "daemon off;"
