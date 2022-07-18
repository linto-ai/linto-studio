/****************
**Conversation***
*****************/

const ExceptionType = 'conversation'

class ConversationError extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationError'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'Error during the operation'
    if (err) this.err = err
  }
}

class ConversationNoFileUploaded extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationNoFileUploaded'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'No files were uploaded.'
    if (err) this.err = err
  }
}
class ConversationMetadataRequire extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationMetadataRequire'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = 'Require metadata was not provide.'
    if (err) this.err = err
  }
}

class ConversationOwnerAccessDenied extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationOwnerAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = 'User is not the owner of the conversation'
    if (err) this.err = err
  }
}

class ConversationWriteAccessDenied extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationWriteAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have write access to the conversation`
    if (err) this.err = err
  }
}

class ConversationShareAccessDenied extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationShareAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have share access to the conversation`
    if (err) this.err = err
  }
}

class ConversationReadAccessDenied extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationReadAccessDenied'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have read access to the conversation`
    if (err) this.err = err
  }
}
class ConversationNotShared extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationNotShared'
    this.type = ExceptionType
    this.status = '401'
    if (message) this.message = message
    else this.message = `User don't have access to the conversation`
    if (err) this.err = err
  }
}

class ConversationIdRequire extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationIdRequire'
    this.type = ExceptionType
    this.status = '403'
    if (message) this.message = message
    else this.message = `Conversation id param is require`
    if (err) this.err = err
  }
}

class ConversationNotFound extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationNotFound'
    this.type = ExceptionType
    this.status = '404'
    if (message) this.message = message
    else this.message = 'Requested conversation not found'
    if (err) this.err = err
  }
}

class ConversationLocked extends Error {
  constructor(message, err) {
    super()
    this.name = 'ConversationLocked'
    this.type = ExceptionType
    this.status = '423'
    if (message) this.message = message
    else this.message = 'Conversation is currently edited by another user'
    if (err) this.err = err
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
  ConversationError,
  ConversationLocked,
  ConversationNotFound
}