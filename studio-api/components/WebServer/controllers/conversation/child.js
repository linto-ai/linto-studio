const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:child",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function updateChildConversation(conversation, action = update) {
  try {
    for (const conversationId of conversation.type.child_conversations) {
      if (action === "RIGHTS") {
        let updateConv = {
          _id: conversationId,
          sharedWithUsers: conversation.sharedWithUsers,
          organization: conversation.organization,
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
