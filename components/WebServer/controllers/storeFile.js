const debug = require('debug')('linto:components:WebServer:controller:storeFile')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')

const { spawn } = require("child_process")
/*
ffmpeg -i in.whatever -vn -ar 16000 -ac 1 -b:a 96k out.mp3
ffmpeg -i in.whatever -vn -c:a aac -ar 16000 -ac 1 -b:a 64k out.m4a
ffmpeg -i in.whatever -vn -c:a libfdk_aac -ar 16000 -ac 1 -b:a 64k out.m4a (best version, requires specific build for ffmpeg)
*/

async function storeFile(file, type = 'audio') {
    try {
        let filePath = ''
        const fileName = uuidv4()
        const fileExtension = path.extname(file.name)

        if (type === 'picture') {

            fs.writeFileSync(`${process.env.VOLUME_FOLDER}/${process.env.VOLUME_PROFILE_PICTURE_PATH}/${fileName}${fileExtension}`, file.data)
            return `${process.env.VOLUME_PROFILE_PICTURE_PATH}/${fileName}${fileExtension}`

        } else if (type === 'audio') {
            filePath = `${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/original/${fileName}${fileExtension}` // origine file
            fs.writeFileSync(filePath, file.data)

            let transformedFilePath = `${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/` + fileName + '.mp3'
            await new Promise((resolve, reject) => {
                let streamProcess = spawn("ffmpeg", ['-i', `${filePath}`, '-vn', '-ar', '16000', '-ac', '1', '-b:a', '96k', transformedFilePath], { detached: true })

                streamProcess.stdout.on("data", data => {
                    debug(`stdout: ${data}`)
                })

                streamProcess.stderr.on("data", data => {
                    debug(`stderr - processing: ${data}`)
                })

                streamProcess.on("error", error => {
                    reject(error)
                    debug(`error: ${error.message}`)
                })

                streamProcess.on("close", code => {
                    debug(`child process exited with code ${code}`)
                    resolve()
                })
            })
            console.log('Continue')

            return {
                filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
                originalFilePath: `${process.env.VOLUME_AUDIO_PATH}/original/${fileName}${fileExtension}`,
                originalStorageFilePath: `${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/original/${fileName}${fileExtension}`,
                storageFilePath: `${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/` + fileName + '.mp3',
                originalFileName: file.name
            }
        }
    } catch (error) {
        throw error
    }

}

function defaultPicture() {
    return `${process.env.VOLUME_PROFILE_PICTURE_PATH}/default.jpg`
}

module.exports = { storeFile, defaultPicture }