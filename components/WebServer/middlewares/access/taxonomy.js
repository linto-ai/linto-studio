const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:access:conversation')

const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const projection = ['owner', 'sharedWithUsers', 'organization']

const conversation = require(`${process.cwd()}/components/WebServer/middlewares/access/conversation.js`)
const organization = require(`${process.cwd()}/components/WebServer/middlewares/access/organization.js`)

const {
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationDeleteAccessDenied,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

module.exports = {
  asReadTaxonomyAccess: async (req, res, next) => {
    if (req.params.conversationId)
      await conversation.access(req, next, req.params.conversationId, req.payload.data.userId, false, CONVERSATION_RIGHTS.READ, ConversationReadAccessDenied) // ORGA MEMBER
    else if (req.params.organizationId)
      await organization.access(req, next, req.params.organizationId, req.payload.data.userId, ORGANIZATION_ROLES.MEMBER)

  },
  asWriteTaxonomyAccess: async (req, res, next) => {
    if (req.params.conversationId)
      await conversation.access(req, next, req.params.conversationId, req.payload.data.userId, false, CONVERSATION_RIGHTS.WRITE, ConversationReadAccessDenied) // ORGA MEMBER
    else if (req.params.organizationId)
      await organization.access(req, next, req.params.organizationId, req.payload.data.userId, ORGANIZATION_ROLES.MEMBER)

  },
  asDeleteTaxonomyAccess: async (req, res, next) => {
    if (req.params.organizationId)
      await organization.access(req, next, req.params.organizationId, req.payload.data.userId, ORGANIZATION_ROLES.MAINTAINER)
    else next(new ConversationDeleteAccessDenied('User don\'t have the right to delete conversation tags'))
  }
}


