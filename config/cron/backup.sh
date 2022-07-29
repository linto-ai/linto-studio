BACKUP_PATH=/usr/src/app/conversation-manager/storages
Date=$(date +"%m-%d-%Y")

find $BACKUP_PATH -name "*.zip" -type f -mtime +30 -delete 
zip -r "$BACKUP_PATH/backups/backup_cm_.$Date.zip" $BACKUP_PATH/audios $BACKUP_PATH/database $BACKUP_PATH/pictures