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

class ConversationNoFileUploaded extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationNoFileUploaded'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'No files were uploaded.'
  }
}
class ConversationMetadataRequire extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationMetadataRequire'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'No metadata was provided.'
  }
}

class ConversationNotOwner extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationNotOwner'
    this.type = ExceptionType
    this.status = '403'
    if (message) this.message = message
    else this.message = 'User is not the owner of the conversation'
  }
}

class ConversationNoRight extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationNoRight'
    this.type = ExceptionType
    this.status = '403'
    if (message) this.message = message
    else this.message = `User don't have right to the conversation`
  }
}

module.exports = {
  //Conversation Exception
  ConversationNotAddedToUser,
  ConversationNoFileUploaded,
  ConversationMetadataRequire,
  ConversationNotOwner,
  ConversationNoRight
}