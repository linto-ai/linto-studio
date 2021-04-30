const debug = require('debug')('linto:components:WebServer:controller:file')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path');

async function storeFile(file, type = 'audio') {
    let filePath = ''
    let fileName = uuidv4() + '' + path.extname(file.name)
    console.log('FIlename generated', fileName)
    if (type === 'audio') filePath = `${process.env.VOLUME_AUDIO_UPLOAD_PATH}/${fileName}`
    else if (type === 'picture') filePath = `${process.env.VOLUME_PROFILE_PICTURE_UPLOAD_PATH}/${fileName}`

    fs.writeFileSync(filePath, file.data)

    let publicPath = ''
    if (type === 'audio') publicPath = `${process.env.VOLUME_AUDIO_PUBLIC_PATH}/${fileName}`
    if (type === 'picture') publicPath = `${process.env.VOLUME_PROFILE_PICTURE_PUBLIC_PATH}/${fileName}`

    return publicPath
}

function defaultPicture() {
    return `${process.env.VOLUME_PROFILE_PICTURE_PUBLIC_PATH}/default.jpg`
}

module.exports = { storeFile, defaultPicture }