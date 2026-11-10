const model = require(`${process.cwd()}/lib/mongodb/models`)

async function updateChildConversation(conversation, action) {
  try {
    if (action !== "RIGHTS") return
    for (const conversationId of conversation.type.child_conversations) {
      await model.conversations.update({
        _id: conversationId,
        sharedWithUsers: conversation.sharedWithUsers,
        organization: conversation.organization,
      })
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  updateChildConversation,
}
