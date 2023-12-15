def buildDockerfile(dockerfilePath, image_name, version) {
    echo "Building Dockerfile at ${dockerfilePath} for ${image_name}... with version ${version}"

    // Build Docker image using the specified Dockerfile
    script {
        def completeImageName = "${env.DOCKER_HUB_REPO}/${image_name}" // Concatenate repo with image_name
        def image = docker.build(completeImageName, "-f ${dockerfilePath} .")

        echo "Prepare to release newer version ${completeImageName}:${version}"
        docker.withRegistry('https://registry.linto.ai', env.DOCKER_HUB_CRED) {
            if (version  == 'latest-unstable') {
                image.push('latest-unstable')
            } else {
                image.push('latest')
                image.push(version)
            }
        }
    }
}

def performBuildForFile(changedFiles, version) {
    if (changedFiles.contains('studio-api')) {
        echo 'Files in studio-api path are modified. Running specific build steps for studio-api...'
        buildDockerfile('studio-api/Dockerfile', 'studio-api', version)
    }

    if (changedFiles.contains('studio-frontend')) {
        echo 'Files in studio-frontend path are modified. Running specific build steps for studio-frontend...'
        buildDockerfile('studio-frontend/Dockerfile', 'studio-frontend', version)
    }

    if (changedFiles.contains('studio-websocket')) {
        echo 'Files in studio-websocket path are modified. Running specific build steps for studio-websocket...'
        buildDockerfile('studio-websocket/Dockerfile', 'studio-websocket', version)
    }

    if (changedFiles.contains('studio-dashboard')) {
        echo 'Files in studio-dashboard path are modified. Running specific build steps for studio-dashboard...'
        buildDockerfile('studio-websocket/Dockerfile', 'studio-dashboard', version)
    }
}

pipeline {
    agent any
    environment {
        DOCKER_HUB_REPO = "linto-studio/"
        DOCKER_HUB_CRED = 'harbor-jenkins-robot'
        VERSION = ''
    }

    stages {
        stage('Docker build for master branch') {
            when {
                branch 'master'
            }
            steps {
                echo 'Publishing latest'
                script {
                    def changedFiles = sh(returnStdout: true, script: 'git diff --name-only HEAD^ HEAD').trim()
                    echo "My changed files: ${changedFiles}"
                    
                    VERSION = sh(
                        returnStdout: true, 
                        script: "awk -v RS='' '/#/ {print; exit}' RELEASE.md | head -1 | sed 's/#//' | sed 's/ //'"
                    ).trim()
                    
                    performBuildForFile(changedFiles, VERSION)
                }
            }
        }

        stage('Docker build for next (unstable) branch') {
            when {
                branch 'next'
            }
            steps {
                echo 'Publishing unstable'
                script {
                    def changedFiles = sh(returnStdout: true, script: 'git diff --name-only HEAD^ HEAD').trim()
                    echo "My changed files: ${changedFiles}"

                    VERSION = 'latest-unstable'
                    performBuildForFile(changedFiles, VERSION)
                }
            }
        }
    }
}