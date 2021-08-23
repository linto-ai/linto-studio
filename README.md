# Conversation Manager
Transcription / summarization / annotation interface for recorded audio files 

## 1/ clone project and install dependencies
```bash
cd your/project/path
git clone git@github.com:linto-ai/platform-conversation-manager.git
cd platform-conversation-manager
```
## 2/ Set Docker environment variables
Duplicate *".envdefault"* file to create *".dockerenv"* file
```bash
cp .envdefault .dockerenv
```

Set up your environment variables by editing *".dockerenv"*

## 3/ Lauch the "start" script
```bash
./start.sh -p -vrb
```