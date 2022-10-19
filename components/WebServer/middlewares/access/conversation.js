const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:rights:conversation')

const ConversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const OrganizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const projection = ['owner', 'sharedWithUsers', 'organization']

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
    ConversationModel.getConvoById(req.params.conversationId).then(conversation => {
      if (conversation.length === 1 && conversation[0].owner === req.payload.data.userId) next()
      else next(new ConversationOwnerAccessDenied())
    })
  },
  asReadAccess: (req, res, next) => {
    checkConvAccess(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.READ, ConversationReadAccessDenied) // ORGA MEMBER
  },
  asCommentAccess: (req, res, next) => {
    checkConvAccess(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.COMMENT, ConversationReadAccessDenied) // ORGA MAINTENER
  },
  asWriteAccess: (req, res, next) => {
    checkConvAccess(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.WRITE, ConversationWriteAccessDenied) // ORGA MAINTENER
  },
  asDeleteAccess: (req, res, next) => {
    checkConvRestrictedAcess(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.DELETE, ConversationReadAccessDenied) // ORGA MAINTENER
  },
  asShareAccess: (req, res, next) => {
    checkConvAccess(next, req.params.conversationId, req.payload.data.userId, CONVERSATION_RIGHTS.SHARE, ConversationShareAccessDenied)
  }
}

// Check right for orga and user
function checkConvAccess(next, conversationId, userId, rightConvo, rightException) {
  let isToNext = false
  try {
    if (!conversationId) {
      isToNext = callNext(next, isToNext, new ConversationIdRequire())
      return
    }
    ConversationModel.getConvoById(conversationId, projection).then(conversationRes => {
      if (conversationRes.length === 1) {
        const conversation = conversationRes[0]
        if (conversation.owner === userId) { // If owner got all rights
          isToNext = callNext(next, isToNext)
        } else {
          // User access middleware management
          if (conversation.sharedWithUsers.length !== 0) {
            conversation.sharedWithUsers.map(conversationUsers => {
              if (conversationUsers.userId === userId && CONVERSATION_RIGHTS.hasRightAccess(conversationUsers.right, rightConvo)) {
                isToNext = callNext(next, isToNext)
              }
            })
          }

          // Organization access middleware management
          if (!isToNext && conversation.organization.organizationId !== undefined) {
            OrganizationModel.getOrganizationById(conversation.organization.organizationId)
              .then(organization => {
                if (organization.length !== 1) isToNext = callNext(next, isToNext, new rightException())
                if (organization.length === 1 && organization[0].owner === userId) isToNext = callNext(next, isToNext)

                const isUserFound = organization[0].users.filter(user => user.userId === userId)
                if (isUserFound.length !== 1) isToNext = callNext(next, isToNext, new ConversationNotShared())
                else {
                  const user = isUserFound[0] // user right in organization

                  if (ORGANIZATION_ROLES.hasRoleAccess(user.role, ORGANIZATION_ROLES.MAINTAINER)) { // MAINTAINER or above
                    isToNext = callNext(next, isToNext)
                  } else if (conversation.organization.customRights.length !== 0) { // Custom rights for specific member

                    conversation.organization.customRights.map(orgaUser => {
                      if (orgaUser.userId === userId) {
                        if (CONVERSATION_RIGHTS.hasRightAccess(orgaUser.right, rightConvo)) {
                          isToNext = callNext(next, isToNext)
                        } else isToNext = callNext(next, isToNext, new rightException())
                      }
                    })
                  }

                  if (!isToNext && CONVERSATION_RIGHTS.hasRightAccess(conversation.organization.membersRight, rightConvo)) { // Member got right to share
                    isToNext = callNext(next, isToNext)
                  } else if (!isToNext) {
                    isToNext = callNext(next, isToNext, new ConversationNotShared())
                  }
                }
              })
          }
        }
      } else if (!isToNext) callNext(next, isToNext, new ConversationNotShared())

    })
  } catch (err) {
    callNext(next, isToNext, err)
  }
}

// check right for user in an organization
function checkConvRestrictedAcess(next, conversationId, userId, rightConvo, rightException) {
  let isToNext = false
  try {
    if (!conversationId) {
      isToNext = callNext(next, isToNext, new ConversationIdRequire())
      return
    }
    ConversationModel.getConvoById(conversationId, projection).then(conversationRes => {
      if (conversationRes.length === 1) {
        const conversation = conversationRes[0]
        if (conversation.owner === userId) isToNext = callNext(next, isToNext) // If owner all rightsJe
        else {
          // Organization access middleware management
          if (conversation.organization.organizationId !== undefined) {
            OrganizationModel.getOrganizationById(conversation.organization.organizationId).then(organization => {

              if (organization.length !== 1) isToNext = callNext(next, isToNext, new rightException())
              if (organization.length === 1 && organization[0].owner === userId) isToNext = callNext(next, isToNext)

              const isUserFound = organization[0].users.filter(user => user.userId === userId)
              if (isUserFound.length !== 1) isToNext = callNext(next, isToNext, new ConversationNotShared())
              else {
                // user is MAINTAINER or as right to share conversation
                const user = isUserFound[0] // user right in organization
                if (ORGANIZATION_ROLES.hasRoleAccess(user.role, ORGANIZATION_ROLES.MAINTAINER)) { // MAINTAINER or above
                  isToNext = callNext(next, isToNext,)
                } else if (conversation.organization.customRights.length !== 0) { // Custom rights for specific member
                  conversation.organization.customRights.map(orgaUser => {
                    if (orgaUser.userId === userId) {
                      if (CONVERSATION_RIGHTS.hasRightAccess(orgaUser.right, rightConvo))
                        isToNext = callNext(next, isToNext)
                      else isToNext = callNext(next, isToNext, new rightException())
                    }
                  })
                }
                if (!isToNext && CONVERSATION_RIGHTS.hasRightAccess(conversation.organization.membersRight, rightConvo)) { // Member got right to share
                  isToNext = callNext(next, isToNext)
                } else if (!isToNext) {
                  isToNext = callNext(next, isToNext, new rightException())
                }
              }
            })
          } else isToNext = callNext(next, isToNext, new rightException())
        }
      } else if (!isToNext) callNext(next, isToNext, new ConversationNotShared())
    })
  } catch (err) {
    callNext(next, isToNext, err)
  }
}

function callNext(next, isToNext, err) {
  if (!isToNext && err) next(err)
  else if (!isToNext) next()
  else if (err) {
    console.error('Next called multiple times')
    console.error(err)
  } else console.error('Next called multiple times')

  return true
}