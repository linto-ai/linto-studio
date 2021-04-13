const debug = require('debug')('linto:components:WebServer:controller:file')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')

async function storeFile(file, type = 'audio') {
    let filePath = ''

    if (type === 'audio') filePath = `${process.env.VOLUME_AUDIO_LOCATION}/${uuidv4() + '' + path.extname(file.name)}`
    else if (type === 'picture') filePath = `${process.env.VOLUME_PROFILE_PICTURE_LOCATION}/${uuidv4() + '' + path.extname(file.name)}`

    fs.writeFileSync(filePath, file.data)
    return filePath
}

function defaultPicture() {
   return `${process.env.VOLUME_PROFILE_PICTURE_LOCATION}/default.jpg`
}

module.exports = { storeFile, defaultPicture }