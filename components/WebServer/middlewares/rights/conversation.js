const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:rights:conversation')

const ConversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const OrganizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/organization`)


const {
  ConversationOwnerAccessDenied,
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationShareAccessDenied,
  ConversationNotShared,
  ConversationIdRequire
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

module.exports = {
  asOwnerAccess: (req, res, next) => {
      ConversationModel.getConvoOwner(req.params.conversationid).then(conversation => {
          if (conversation.length === 1 && conversation[0].owner === req.payload.data.userId) next()
          else next(new ConversationOwnerAccessDenied())
      })
  },
  asReadAccess: (req, res, next) => {
      checkConvAccessRight(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.READ, ConversationReadAccessDenied) // ORGA MEMBER
  },
  asCommentAccess: (req, res, next) => {
    checkConvAccessRight(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.COMMENT, ConversationReadAccessDenied) // ORGA MAINTENER
  },
  asWriteAccess: (req, res, next) => {
    checkConvAccessRight(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.WRITE, ConversationWriteAccessDenied) // ORGA MAINTENER
  },
  asDeleteAccess: (req, res, next) => {
    checkConvAccessRight(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.DELETE, ConversationReadAccessDenied) // ORGA MAINTENER
  },
  asShareAccess: (req, res, next) => {
    checkConvAcessShareRight(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.SHARE, ConversationShareAccessDenied)
  }
}

function checkConvAccessRight(next, conversationId, userId, rightConvo, rightException) {
  try{
    let hasAccess = false

    if (!conversationId) {
        next(new ConversationIdRequire())
        return
    }

    ConversationModel.getConvoShared(conversationId).then(conversationRes => {
      if (conversationRes.length === 1 && conversationRes[0].sharedWith) {
            const conversation = conversationRes[0]
            if (conversation.owner === userId) next() // If owner all rightsJe
            else {

                // User access middleware management
                if(conversation.sharedWith.users.length !== 0){
                  conversation.sharedWith.users.map(conversationUsers => {
                    if (conversationUsers.userId === userId && CONVERSATION_RIGHTS.asRightAccess(conversationUsers.rights, rightConvo)){
                      hasAccess = true
                      next()
                    }
                  })
                }

                // Organization access middleware management
                if(conversation.sharedWith.organization.organizationId !== undefined){
                  OrganizationModel.getOrganizationById(conversation.sharedWith.organization.organizationId)
                  .then(organization => {
                    if (organization.length !== 1) next(new rightException())
                    if (organization.length === 1 && organization[0].owner === userId) next()

                    const isUserFound = organization[0].users.filter(user => user.userId === userId)
                    if(isUserFound.length !== 1) next(new ConversationNotShared())

                    const user = isUserFound[0] // user right in organization
                    if(ORGANIZATION_RIGHTS.asRightAccess(user.rights, ORGANIZATION_RIGHTS.MAINTAINER) ||
                    ORGANIZATION_RIGHTS.asRightAccess(user.rights, conversation.sharedWith.organization.rights)){
                        hasAccess = true
                        next()
                    } else if(!userFind){
                      next(new ConversationNotShared())
                    }
                  })
                }
            }
        } else next(new ConversationNotShared())
    })
  } catch(err){
    next(err)
  }
}

function checkConvAcessShareRight(next, conversationId, userId, rightConvo, rightException) {
  try{
    if (!conversationId) {
        next(new ConversationIdRequire())
        return
    }
    ConversationModel.getConvoShared(conversationId).then(conversationRes => {
      if (conversationRes.length === 1 && conversationRes[0].sharedWith) {
            const conversation = conversationRes[0]
            if (conversation.owner === userId) next() // If owner all rightsJe
            else {
                // Organization access middleware management
                if(conversation.sharedWith.organization.organizationId !== undefined){
                  OrganizationModel.getOrganizationById(conversation.sharedWith.organization.organizationId).then(organization => {

                    if (organization.length !== 1) next(new rightException())
                    if (organization.length === 1 && organization[0].owner === userId) next()

                    const isUserFound = organization[0].users.filter(user => user.userId === userId)
                    if(isUserFound.length !== 1) next(new ConversationNotShared())

                    // user is MAINTAINER or as right to share conversation
                    const user = isUserFound[0] // user right in organization
                    if(ORGANIZATION_RIGHTS.asRightAccess(user.rights, ORGANIZATION_RIGHTS.MAINTAINER) ||
                      ORGANIZATION_RIGHTS.asRightAccess(user.rights, conversation.sharedWith.organization.rights)){
                        next()
                    } else if(conversation.sharedWith.users.length !== 0){
                      conversation.sharedWith.users.map(conversationUsers => {
                        if (conversationUsers.userId === userId && CONVERSATION_RIGHTS.asRightAccess(conversationUsers.rights, rightConvo)){
                          next()
                        } else next(new rightException())
                      })
                    } else next(new rightException())
                  })
                }
            }
        } else next(new ConversationNotShared())
    })
  } catch(err){
    next(err)
  }
}