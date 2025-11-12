#!/bin/bash
set -e

DIR="/usr/src/app/studio-frontend/dist/"
BUILD=false

# Set default UID and GID (defaults to www-data: 33:33 if not specified)
USER_ID=${USER_ID:-33}
GROUP_ID=${GROUP_ID:-33}

# Default values for user and group names
USER_NAME="appuser"
GROUP_NAME="appgroup"

# Check and apply chown only if necessary
function safe_chown() {
    local target="$1"
    local user="$2"
    local group="$3"

    # Get the current uid and gid of the target
    local cur_uid
    local cur_gid
    cur_uid=$(stat -c "%u" "$target")
    cur_gid=$(stat -c "%g" "$target")

    # Get the target uid and gid
    local wanted_uid
    local wanted_gid
    wanted_uid=$(id -u "$user")
    wanted_gid=$(getent group "$group" | cut -d: -f3)

    # Do nothing if already owned by the target user and group
    if [[ "$cur_uid" == "$wanted_uid" && "$cur_gid" == "$wanted_gid" ]]; then
        echo "$target already owned by $user:$group"
    else
        echo "chown -R $user:$group $target"
        chown -R "$user:$group" "$target"
    fi
}

# Check and apply chmod only if necessary
function safe_chmod() {
    local target="$1"
    local wanted_mode="$2"
    # Accepts mode in octal format (e.g., 700)
    local cur_mode
    cur_mode=$(stat -c "%a" "$target")
    if [[ "$cur_mode" == "$wanted_mode" ]]; then
        echo "$target already has permissions $wanted_mode"
    else
        echo "chmod -R $wanted_mode $target"
        chmod -R "$wanted_mode" "$target"
    fi
}

# Function to create a user/group if needed and adjust permissions
function setup_user() {
    echo "Configuring runtime user with UID=$USER_ID and GID=$GROUP_ID"

    # Check if a group with the specified GID already exists
    if getent group "$GROUP_ID" >/dev/null 2>&1; then
        GROUP_NAME=$(getent group "$GROUP_ID" | cut -d: -f1)
        echo "A group with GID=$GROUP_ID already exists: $GROUP_NAME"
    else
        # Create the group if it does not exist
        echo "Creating group with GID=$GROUP_ID"
        groupadd -g "$GROUP_ID" "$GROUP_NAME"
    fi
    #
    # Check if a user with the specified UID already exists
    if id -u "$USER_ID" >/dev/null 2>&1; then
        USER_NAME=$(getent passwd "$USER_ID" | cut -d: -f1)
        echo "A user with UID=$USER_ID already exists: $USER_NAME"
    else
        # Create the user if it does not exist
        echo "Creating user with UID=$USER_ID and GID=$GROUP_ID"
        useradd -m -u "$USER_ID" -g "$GROUP_NAME" "$USER_NAME"
    fi

    # Adjust ownership of the application directories
    # chown -R "$USER_NAME:$GROUP_NAME" /usr/src/app /usr/share/nginx/html /var/lib/nginx /var/log/nginx /run/nginx.pid

    # Get the user's home directory from the system
    USER_HOME=$(getent passwd "$USER_NAME" | cut -d: -f6)

    # Ensure the home directory exists
    if [ ! -d "$USER_HOME" ]; then
        echo "Ensure home directory exists: $USER_HOME"
        mkdir -p "$USER_HOME"
        # chown "$USER_NAME:$GROUP_NAME" "$USER_HOME"
    fi

    # Adjust ownership of the application directories
    if [ "${DEVELOPMENT}" = "true" ]; then
        echo "Development mode: skipping ownership changes to preserve volume mounts"
    else
        # Production mode: adjust ownership but exclude node_modules for performance
        echo "Adjusting ownership of application directories (excluding node_modules)"

        # Change ownership of top-level files and directories, excluding node_modules
        find /usr/src/app -maxdepth 1 ! -name node_modules -exec chown "$USER_NAME:$GROUP_NAME" {} \;

        # Change ownership of studio-frontend directory excluding its node_modules
        if [ -d /usr/src/app/studio-frontend ]; then
            find /usr/src/app/studio-frontend -path /usr/src/app/studio-frontend/node_modules -prune -o -exec chown "$USER_NAME:$GROUP_NAME" {} \;
        fi

        # Change ownership of nginx related directories
        chown -R "$USER_NAME:$GROUP_NAME" /usr/share/nginx/html /var/lib/nginx /var/log/nginx /run/nginx.pid

        # Grant full permissions to the user on their home directory
        echo "Granting full permissions to $USER_NAME on $USER_HOME"
        safe_chown "$USER_HOME" "$USER_NAME" "$GROUP_NAME"
        safe_chmod "$USER_HOME" "744"
    fi

    # Grant full permissions to the user on their home directory
    echo "Granting full permissions to $USER_NAME on $USER_HOME"
    chmod -R u+rwx "$USER_HOME"
}

if [ ! -d "$DIR" ]; then
  BUILD=true
  # Take action if $DIR exists. #
  echo "Building ${DIR}..."
  printenv >.env
  npm run build
  rm -rf /usr/share/nginx/html/*
  cp -r ./dist/* /usr/share/nginx/html
else
  echo "Directory ${DIR} exists, skipping build..."
  cp -r ./dist/* /usr/share/nginx/html
fi

while [ "$1" != "" ]; do
  case $1 in
  --build)
    printenv >.env
    npm run build
    rm -rf /usr/share/nginx/html/*
    cp -r ./dist/* /usr/share/nginx/html
    ;;
  --skip)
    echo 'Skip startup param'
    ;;
  *)
    echo "ERROR: Bad argument provided \"$1\""
    exit 1
    ;;
  esac
  shift
done

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
gosu "$USER_NAME" nginx
