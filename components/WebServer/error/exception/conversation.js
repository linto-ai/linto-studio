/****************
**Conversation***
*****************/

const ExceptionType = 'conversation'

class ConversationError extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationError'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'Error during the operation'
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
    else this.message = 'Require metadata was not provide.'
  }
}

class ConversationOwnerAccessDenied extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationOwnerAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = 'User is not the owner of the conversation'
  }
}

class ConversationWriteAccessDenied extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationWriteAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have write access to the conversation`
  }
}

class ConversationShareAccessDenied extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationShareAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have share access to the conversation`
  }
}

class ConversationReadAccessDenied extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationReadAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have read access to the conversation`
  }
}
class ConversationNotShared extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationNotShared'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have access to the conversation`
  }
}

class ConversationIdRequire extends Error {
  constructor(message) {
    super()
    this.name = 'ConversationIdRequire'
    this.type = ExceptionType
    this.status = '403'
    if (message) this.message = message
    else this.message = `Conversation id param is require`
  }
}

class ConversationNotFound extends Error {
  constructor(message) {
      super()
      this.name = 'ConversationNotFound'
      this.type = ExceptionType
      this.status = '404'
      if (message) this.message = message
      else this.message = 'Requested conversation not found'
  }
}



module.exports = {
  ConversationNoFileUploaded,
  ConversationMetadataRequire,
  ConversationOwnerAccessDenied,
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationShareAccessDenied,
  ConversationNotShared,
  ConversationIdRequire,
  ConversationError
}