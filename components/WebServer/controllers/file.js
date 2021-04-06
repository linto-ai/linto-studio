const debug = require('debug')('linto:components:WebServer:controller:file')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')

async function storeFile(file) {
    let filePath = `${process.env.VOLUME_AUDIO_LOCATION}/${uuidv4() + '' + path.extname(file.name)}`

    fs.writeFileSync(filePath, file.data)
    return filePath
}

module.exports = { storeFile }