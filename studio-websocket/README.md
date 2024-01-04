# LinTO Studio Websocket

This is the websocket part of the conversation manager, it handles collaborative edition.

## Installation

### Install dependencies

```bash
npm install
```

### Setup environnement variables

- WEBSERVER_HTTP_PORT: listening port for the websocket server
- CONVO_API: url where studio-api is listening
- WEBSERVER_WS_PATH: path where socket.io will listen (default to /socket.io)

### Run

```bash
npm run start
```
