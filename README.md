# LinTO studio
This repository have all the necessary module for LinTo-Studio .
This repository contains modules for Studio, offering functionalities for editing transcription and subtitle, summarization, and annotation interface with tags. It facilitates the handling of recorded audio files, providing features for sharing and live collaborative editing.

## Installation Guide

### Prerequisites

Ensure you have the following prerequisites before beginning the installation process:

- **Node.js**
- **npm**
- **Docker**
- **git**

Then you can clone the project
```bash
    git clone https://github.com/linto-ai/linto-studio
    cd linto-studio
```

Two possible ways to work with LinTO Studio: We highly recommend using the Docker version, which is much simpler to use and comes pre-configured. 
Note that you will still need to have an API gateway running with a speech-to-text service.
**Note** More detailed instructions for configuring the gateway and setting up the speech-to-text service will be provided soon (with a docker version)

### Docker Installation Steps
This Docker Compose setup enables the deployment of various services needed for LinTO Studio. It includes components such as MongoDB, API, Frontend, WebSocket, and Dashboard.
Don't forget to navigate to the directory where `docker-compose.yml` is located.

Then to start the services, use the following command: `docker-compose up -d`

### Docker Services Included

#### `studio-mongo`
- **Description**: MongoDB for data storage.
- **Exposed Port**: `27017`

#### `studio-api`
- **Description**: API service for LinTO Studio.
- **Exposed Port**: `8001`

#### `studio-frontend`
- **Description**: Frontend service for LinTO Studio.
- **Exposed Port**: `80`

#### `studio-websocket`
- **Description**: WebSocket service for LinTO Studio.
- **Exposed Port**: `8002`

#### `studio-dashboard`
- **Description**: Dashboard service for LinTO Studio, allowing to monitoring the mongo-database.
- **Exposed Port**: `8081`

### Configuration
- **Volumes**: 
  - `./docker-optional/mongo-database/` is mounted to MongoDB for data persistence.
  - Volumes for other services can be configured in their respective `.dockerenv` files located in their directories.

### Accessing Services
- **API**: Access via `http://localhost:8001`
- **Frontend**: Access via `http://localhost:80`
- **WebSocket**: Access via `http://localhost:8002`
- **Dashboard**: Access via `http://localhost:8081`

### Stopping the Services
To stop and remove the containers while keeping the data volumes, execute `docker-compose down`


### For Developing

We will give only the minimum information, the docker is way more simple and already ready to use. 
This guide part will provides basic information for installing / running the LinTO Studio Platform. Adjustments may be needed based on specific configurations or project updates.
For more details or troubleshooting tips, refer to the project folder or their own README.

1. **Clone the Repository and install**

```bash
    # Install each module
    cd studio-api && npm install && cd ..
    cd studio-frontend && npm install && cd ..
    cd studio-api && npm install && cd ..
```

2. **Setup environement Variable**
    Configure necessary environment variables by referring to each of their own documentation or .env files. We provide an .envdefault to be copy into the .env file
```sh
    cp studio-api/.envdefault studio-api/.env
    cp studio-frontend/.envdefault studio-frontend/.env
    cp studio-websocket/.envdefault studio-websocket/.env
```

3. **Running mongo**
You can use your own MongoDB instance or the one we provide using Docker.

To start the provided MongoDB instance, use the following command:
`docker-compose -f docker-optional/studio-mongo.yml up`

4.  **Start each application individualy**
```sh
    # For running project on dev mode, use :npm run dev
    cd studio-api
    npm run start # npm run dev
    
    cd studio-frontend
    npm run serve-prod # npm run dev

    cd studio-websocket
    npm run start # npm run dev
```
If everything goes well, you will then be able to access the application on `http://localhost`