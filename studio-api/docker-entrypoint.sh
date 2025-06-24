#!/bin/bash
set -e

echo "Waiting mongo..."
/wait-for-it.sh $DB_HOST:$DB_PORT --timeout=20 --strict -- echo " $DB_HOST:$DB_PORT is up"

# Set default UID and GID (defaults to www-data: 33:33 if not specified)
USER_ID=${USER_ID:-33}
GROUP_ID=${GROUP_ID:-33}

# Default values for user and group names
USER_NAME="appuser"
GROUP_NAME="appgroup"

# Function to create a user/group if needed and adjust permissions
function setup_user() {
    echo "Configuring runtime user with UID=$USER_ID and GID=$GROUP_ID"
    #
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
    echo "Adjusting ownership of application directories"
    chown -R "$USER_NAME:$GROUP_NAME" /usr/src/app

    # Get the user's home directory from the system
    USER_HOME=$(getent passwd "$USER_NAME" | cut -d: -f6)

    # Ensure the home directory exists
    if [ ! -d "$USER_HOME" ]; then
        echo "Ensure home directory exists: $USER_HOME"
        mkdir -p "$USER_HOME"
        chown "$USER_NAME:$GROUP_NAME" "$USER_HOME"
    fi

    # Grant full permissions to the user on their home directory
    echo "Granting full permissions to $USER_NAME on $USER_HOME"
    chmod -R u+rwx "$USER_HOME"
}

while [ "$1" != "" ]; do
    case $1 in
    --run-cmd?*)
        script=${1#*=} # Deletes everything up to "=" and assigns the remainder.
        ;;
    --run-cmd=) # Handle the case of an empty --run-cmd=
        die 'ERROR: "--run-cmd" requires a non-empty option argument.'
        ;;
    --skip)
        echo 'Skip starup param'
        ;;
    *)
        echo "ERROR: Bad argument provided \"$1\""
        exit 1
        ;;
    esac
    shift
done

setup_user

echo "RUNNING : $script"
cd /usr/src/app/conversation-manager
mkdir -p storages/audios/original storages/pictures storages/audiowaveform

# We make sure that a docker volume will not overwrite the default image
cp /usr/src/app/conversation-manager/config/pictures/default.jpg /usr/src/app/conversation-manager/storages/pictures/default.jpg

eval "gosu $USER_NAME $script"
