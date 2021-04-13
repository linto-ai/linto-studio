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

module.exports = {
  //Conversation Exception
  ConversationNotAddedToUser,
  ConversationNoFileUploaded,
  ConversationMetadataRequire
}