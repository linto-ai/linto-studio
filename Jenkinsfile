def notifyLintoDeploy(service_name, tag, commit_sha) {
    echo "Notifying linto-deploy for ${service_name}:${tag} (commit: ${commit_sha})..."
    withCredentials([usernamePassword(
        credentialsId: 'linto-deploy-bot',
        usernameVariable: 'GITHUB_APP',
        passwordVariable: 'GITHUB_TOKEN'
    )]) {
        writeFile file: 'payload.json', text: "{\"event_type\":\"update-service\",\"client_payload\":{\"service\":\"${service_name}\",\"tag\":\"${tag}\",\"commit_sha\":\"${commit_sha}\"}}"
        sh 'curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -d @payload.json https://api.github.com/repos/linto-ai/linto-deploy/dispatches'
    }
}

def buildDockerfile(folder_name, version, commit_sha) {
    echo "Building Dockerfile at ${folder_name}/Dockerfile for ${folder_name}... with version ${version}"

    // Build Docker image using the specified Dockerfile
    script {
        def completeImageName = "${env.DOCKER_HUB_REPO}/${folder_name}" // Concatenate repo with image name
        def image = docker.build(completeImageName, "-f ${folder_name}/Dockerfile ./${folder_name}")

        echo "Prepare to release newer version ${completeImageName}:${version}"
        docker.withRegistry('https://registry.hub.docker.com', env.DOCKER_HUB_CRED) {
            if (version  == 'latest-unstable') {
                image.push('latest-unstable')
            } else {
                image.push('latest')
                image.push(version)
            }
        }

        // Notify linto-deploy after successful push (only for master branch)
        if (version != 'latest-unstable' && version != 'preview-saas') {
            notifyLintoDeploy(folder_name, version, commit_sha)
        }
    }
}

// For linto studio, the folder name have the same name of the docker image
def performBuildForFile(changedFiles, version, commit_sha) {
    if (changedFiles.contains('studio-api')) {
        echo 'Files in studio-api path are modified. Running specific build steps for studio-api...'
        buildDockerfile('studio-api', version, commit_sha)
    }

    if (changedFiles.contains('studio-frontend')) {
        echo 'Files in studio-frontend path are modified. Running specific build steps for studio-frontend...'
        buildDockerfile('studio-frontend', version, commit_sha)
    }

    if (changedFiles.contains('studio-websocket')) {
        echo 'Files in studio-websocket path are modified. Running specific build steps for studio-websocket...'
        buildDockerfile('studio-websocket', version, commit_sha)
    }

    if (changedFiles.contains('studio-dashboard')) {
        echo 'Files in studio-dashboard path are modified. Running specific build steps for studio-dashboard...'
        buildDockerfile('studio-dashboard', version, commit_sha)
    }
}

pipeline {
    agent any
    environment {
        DOCKER_HUB_REPO = "lintoai"
        DOCKER_HUB_CRED = 'docker-hub-credentials'
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
                    def commit_sha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

                    def version = sh(
                        returnStdout: true,
                        script: "awk -v RS='' '/#/ {print; exit}' RELEASE.md | head -1 | sed 's/#//' | sed 's/ //'"
                    ).trim()

                    performBuildForFile(changedFiles, version, commit_sha)
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
                    def commit_sha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

                    performBuildForFile(changedFiles, 'latest-unstable', commit_sha)
                }
            }
        }

        stage('Docker build for preview-saas (wip) branch') {
            when {
                branch 'preview-saas'
            }
            steps {
                echo 'Publishing unstable'
                script {
                    def changedFiles = sh(returnStdout: true, script: 'git diff --name-only HEAD^ HEAD').trim()
                    def commit_sha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

                    performBuildForFile(changedFiles, 'preview-saas', commit_sha)
                }
            }
        }
    }
}
