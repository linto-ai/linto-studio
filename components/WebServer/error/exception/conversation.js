/****************
*****Users*******
*****************/

const ExceptionType = 'conversation'

class ConversationNotAddedToUser extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationNotAddedToUser'
    this.type = ExceptionType
    this.status = '403'
    if (message) this.message = message
    else this.message = 'Convo not added to user'
  }
}



module.exports = {
  //Conversation Exception
  ConversationNotAddedToUser
}