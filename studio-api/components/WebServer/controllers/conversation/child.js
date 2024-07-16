const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:conversation:child')
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function updateChildConversation(conversation, action = update) {
    try {
        for (const conversationId of conversation.type.child_conversations) {
            if (action === 'DELETE') {
                //TODO handle other delete when needed (at the moment no audio, so nothing to delete)
                await model.conversations.delete(conversationId)
            } else if (action === 'RIGHTS') {
                let updateConv = {
                    _id: conversationId,
                    sharedWithUsers: conversation.sharedWithUsers,
                    organization: conversation.organization
                }
                await model.conversations.update(updateConv)
            }

        }

    } catch (err) {
        throw err
    }
}

module.exports = {
    updateChildConversation,
}