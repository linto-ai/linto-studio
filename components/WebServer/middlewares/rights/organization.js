const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:rights:organization')

const OrganizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const RIGHTS = require(`${process.cwd()}/lib/dao/rights/organization`)

const {
  OrganizationAccessDenied,
  OrganizationParameterMissing,
  OrganizationError
} = require(`${process.cwd()}/components/WebServer/error/exception/organizations`)

// "GUEST": 1,
// "MEMBER": 2,
// "MAINTAINER": 4,
// "ADMIN": 8,
// "OWNER": 8,

module.exports = {
  asOwnerAccess: (req, res, next) => { //.owner
    OrganizationModel.getOrganizationById(req.params.organizationid).then(organization => {
      if(organization.length === 1 && organization[0].owner === req.payload.data.userId) next()
      else next(new OrganizationAccessDenied('You are not the owner of this organization'))
    })
  },
  asAdminAccess: (req, res, next) => {
    checkOrganizationUserRight(next, req.params.organizationId, req.payload.data.userId, RIGHTS.ADMIN, OrganizationAccessDenied)
  },
  asMaintainerAccess: (req, res, next) => {
    checkOrganizationUserRight(next, req.params.organizationId, req.payload.data.userId, RIGHTS.MAINTAINER, OrganizationAccessDenied)
  },
  asMemberAccess: (req, res, next) => {
    checkOrganizationUserRight(next, req.params.organizationId, req.payload.data.userId, RIGHTS.MEMBER, OrganizationAccessDenied)
  },
  asGuestAccess: (req, res, next) => {
    checkOrganizationUserRight(next, req.params.organizationId, req.payload.data.userId, RIGHTS.GUEST, OrganizationAccessDenied)
  }
}

function checkOrganizationUserRight(next, organizationId, userId, right, rightException) {
  try{

    if (!organizationId) {
        next(new OrganizationParameterMissing())
        return
    }

    OrganizationModel.getOrganizationById(organizationId).then(organization => {
      if (organization.length !== 1) next(new OrganizationError('Error while accesing organization'))
      if (organization.length === 1 && organization[0].owner === userId) next()

      const isUserFound = organization[0].users.filter(user => user.userId === userId && RIGHTS.asRightAccess(user.rights, right))
      if(isUserFound.length !== 0) next()
      else next(new OrganizationAccessDenied('Acces denied'))
    })
  } catch(err) {
    next(err)
  }
}