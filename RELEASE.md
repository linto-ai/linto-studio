# 1.0.1
- API updates
  - Update transcription on job completion (not other information)
  - Added api to handle turn
  - Removed lock system
  - Handle file deletion
  - Update conversation creation 
  - Added a list-service from api gateway
- Cleaned up code
  - Original file is now send to the transcription service
  - Original file is now deleted after transcription
  - Remove folder path configuration from environment
- Environement
  - Change STT_SERVICE to GATEWAY_SERVICE
  - TRANSCRIPTION_SERVICE is a json object
- Component
  - Added a WorkerWatcher to manage worker container

# 1.0.0
- Handle sharedBy user information
- Added user middleware to protect private user
- Better management of private user / orga

# 0.2.0
- Split backend and frontend
- Audio transformation with ffmpeg
- Added a lock system
- Lot of fix
- Add a cron backup system

# 0.1.2 - 2022/02/22
- New transcribe API
- Handle transcription job status updates
- Big cleanup (component, lib, exctract vue_app from component, etc)
- Remove unused environement variables

# 0.1.1 - 2021/07/20
Unstable version
- completion of "editText" function + add "updateSpeakerMap" (to be tested)
- front-end css updates
- front end bug fix
- Add "user settings" view
- interface traduced in FR and EN
- add environment variable
- Add docker files and a script to start services
- Add Jenkins config

# 0.1.0
- First version of Conversation-Manager
