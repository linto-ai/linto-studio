import Conversations from "../models/conversations.js"

export function unfocusField(conversationId, userId, socket, selfMsg) {
  let conversation = Conversations.getById(conversationId)
  conversation.resetUsers(userId)

  if (selfMsg) {
    socket.emit("user_focus_field", {
      users: conversation.getUsersList(),
    })
  }

  socket.to(`conversation/${conversationId}`).emit("user_focus_field", {
    users: conversation.getUsersList(),
  })
}
