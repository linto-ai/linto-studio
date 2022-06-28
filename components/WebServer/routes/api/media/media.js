const debug = require('debug')('linto:conversation-manager:router:api:file:files')
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)


module.exports = (webserver) => {
    return [
        {
            path: '/conversations/:conversationId/media',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: async (req, res, next) => {
                const conversation = await conversationModel.getConvoById(req.params.conversationId)
                if (conversation.length === 1) {
                    const fileName = conversation[0].metadata.audio.filepath.split('/').pop()
                    const file = `${process.env.VOLUME_AUDIO_UPLOAD_PATH}/${fileName}`
                    res.download(file)
                } else {
                    res.status(401).send({ message: 'Conversation audio not found' })
                }
            }
        },
        {
            path: '/users/:userId/picture',
            method: 'get',
            requireAuth: true,
            controller: async (req, res, next) => {
                const user = await userModel.getUserById(req.params.userId)
                if (user.length === 1) {
                    const fileName = user[0].img.split('/').pop()
                    const file = `${process.env.VOLUME_PROFILE_PICTURE_UPLOAD_PATH}/${fileName}`
                    res.download(file)
                } else {
                    res.status(401).send({ message: 'User profile picture not found' })
                }
            }
        }
    ]
}