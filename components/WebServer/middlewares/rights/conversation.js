const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:rights:conversation')

const ConversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)

const {
  ConversationOwnerAccessDenied,
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationNotShared,
  ConversationIdRequire
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)


// "UNDEFINED": 0,
// "READ": 1,
// "COMMENT": 2,
// "WRITE": 4,
// "DELETE": 8,
// "FULL": 16,


// "GUEST": 1,
// "MEMBER": 2,
// "MAINTAINER": 4,
// "ADMIN": 8,
// "OWNER": 8,
module.exports = {
  asOwnerAccess: (req, res, next) => {
      ConversationModel.getConvoOwner(req.params.conversationid).then(conversation => {
          if (conversation.length === 1 && conversation[0].owner === req.payload.data.userId) next()
          else next(new ConversationOwnerAccessDenied())
      })
  },
  asReadAccess: (req, res, next) => {
      checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.READ, ConversationReadAccessDenied)
  },
  asCommentAccess: (req, res, next) => {
    checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.COMMENT, ConversationReadAccessDenied)
  },
  asWriteAccess: (req, res, next) => {
      checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.WRITE, ConversationWriteAccessDenied)
  },
  asDeleteAccess: (req, res, next) => {
    checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.DELETE, ConversationReadAccessDenied)
  }
}

function checkConvSharedRight(next, conversationId, userId, right, rightException) {
  if (!conversationId) {
      next(new ConversationIdRequire())
      return
  }
  ConversationModel.getConvoShared(conversationId).then(conversation => {
      if (conversation.length === 1 && conversation[0].sharedWith) {
          if (conversation.length === 1 && conversation[0].owner === userId) next() // If owner all rightsJe
          else {
              let userFound = false
              conversation[0].sharedWith.users.map(conversationUsers => {
                  if (conversationUsers.user_id === userId)
                      if (RIGHTS.asRightAccess(conversationUsers.rights, right)) {
                          userFound = true
                          next()
                      } else next(new rightException())
              })
              if (!userFound) next(new ConversationNotShared())
          }
      } else next(new ConversationNotShared())
  })
}