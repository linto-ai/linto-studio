# 1.1.3
- Refactoring some api path to handle new role
- Fixing mailing
  - Manage the email checking on the module side
- Handle default category on organization creation (highlights)
- On keywords generation, handle the tag creation
- Added highlight api 
- Added a batch support for action on conversation
- 

# 1.1.2
- Added pagination on conversation listing (shared and favorite)
- Multiple optimisation
- Handle tags for shared and favorite conversation listing
- Update migration for memberRights string to int and new role
- Add a new role : uploader
- Refactoring some api path to handle new role
- Fixing mailing
  - Manage the email checking on the module side
- Handle default category on organization creation (highlights)
- On keywords generation, handle the tag creation
- Added highlight api 

# 1.1.1
- Added tags feature
- Document creation now return their information
- Refactoring of all search api to use the same query
- All search api now can be used on the listing api
- Updated API path
- Updated Swagger documentation
- Update MongoDB model with an update on the component MongoMigration
- Added an docx download feature on conversation

# 1.1.0
- Mongo model update
- Refactoring of mailing library

# 1.0.3
- Implementation of a migration system
  - Swagger schema match the database version
- Added an import endpoint to create conversation
- Manage email sending on some route (share external user, reset password, create user)
- Fix a bug on missing conversation audio
- Fix a bug on first mongo migration (on version collection creation)

# 1.0.2
- Swagger
  - Added swagger documentation
  - Added swagger ui
- Handle mailing service
  - reset password
- Handle magic-link authentification
- API now manage split conversation turn
- API now manage multi-file for conversation
- Update list service to get information on gateway
- Added an merge turn api

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
