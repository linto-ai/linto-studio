const debug = require('debug')('linto:conversation-manager:router:api:file:files')
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)


module.exports = (webserver) => {
    return [{
        path: '/conversations/:conversationId/media',
        method: 'get',
        requireAuth: true,
        requireConversationReadAccess: true,
        controller: async(req, res, next) => {
            const conversation = await conversationModel.getConvoById(req.params.conversationId)
            if (conversation.length === 1) {
                const fileName = conversation[0].metadata.audio.filepath.split('/').pop()
                const file = `${process.cwd()}/${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/${fileName}`
                    // TODO: handle file type (mp3, wav, etc)
                res.setHeader('Content-Type', 'audio/mpeg')
                res.sendFile(file)
            } else {
                res.status(401).send({ message: 'Conversation audio not found' })
            }
        }
    }]
}