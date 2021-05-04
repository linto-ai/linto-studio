# Conversation Manager
Transcription / summarization / annotation interface for recorded audio files 

## 1/ clone project and install dependencies
```bash
git clone git@github.com:linto-ai/platform-conversation-manager.git
cd platform-conversation-manager
npm install
```
## 2/ Setup front-end applications

### Update .env files
Go to the **vue_app** folder and edit environment variables to match with your settings
```bash
cd YOUR_PATH/platform-conversation-manager/components/vue_app
```

##### development mode
Edit the *.env.development* file to setup your configurations in development mode
```
VUE_APP_URL=http://localhost:8001
VUE_APP_CONVO_API=http://localhost:8001/api
VUE_APP_CONVO_AUTH=http://localhost:8001/auth
```

##### production mode
Edit the *.env.production* file to setup your configurations in production mode
```
VUE_APP_URL=http://YOUR_HOST
VUE_APP_CONVO_API=http://YOUR_HOST/api
VUE_APP_CONVO_AUTH=http://YOUR_HOST/auth
```

### Build the front-end application static files

##### development mode  
```bash
cd YOUR_PATH/platform-conversation-manager
./install-front-dev.sh
```

##### production mode  
```bash
cd YOUR_PATH/platform-conversation-manager
./install-front-prod.sh
```

## 3/ Setup the webserver

### Create and update .env file
Make a copy of **.envdefault** to create a **.env** file. This file will be used by the webserver to get configuration environmnet variables
```bash
cd YOUR_PATH/platform-conversation-manager
cp .envdefault .env
```

Edit the *.env* file to setup your environment variables
```
# Dev env
DISABLE_AUTH=false

# Components loading in this order
COMPONENTS = WebServer
WEBSERVER_HTTP_PORT=8001
DB_DRIVER=mongo
DB_HOST=localhost
DB_REQUIRE_LOGIN=true
DB_USER=root
DB_PASS=example
DB_PORT=27017
DB_NAME=conversations
JWT_SECRET=supersecret

# STT Config
STT_REQUIRE_AUTH=true
STT_USER=root
STT_PASSWORD=example
STT_HOST=https://host/stt/my_service/transcribe

# Cross domain accessibility
CORS_ENABLED=false
CORS_API_WHITELIST=

# Express settings
EXPRESS_SIZE_FILE_MAX=500mb
EXPRESS_TIMEOUT=1000000

# Storage folder of audio volume
VOLUME_AUDIO_UPLOAD_PATH=uploads/audios
VOLUME_AUDIO_PUBLIC_PATH=audios
VOLUME_PROFILE_PICTURE_UPLOAD_PATH=uploads/pictures
VOLUME_PROFILE_PICTURE_PUBLIC_PATH=pictures

# JWT SECRET
LINTO_STACK_CM_JWT_SECRET=jwt_secret
LINTO_STACK_CM_REFRESH_SECRET=jwt_refresh_secret
```

## 4/ Launch application

##### development mode
```bash
cd YOUR_PATH/platform-conversation-manager
npm run start-dev
```
> If you kept the default settings, the application is running on : http://localhost:8001

##### production mode
```bash
cd YOUR_PATH/platform-conversation-manager
npm run start
```
