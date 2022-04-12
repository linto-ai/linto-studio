const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:rights:organization')

const OrganizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const {
    OrganizationForbidden,
    OrganizationNotFound,
    OrganizationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

module.exports = {
    asOwnerAccess: (req, res, next) => { //.owner
        OrganizationModel.getOrganizationById(req.params.organizationid).then(organization => {
            if (organization.length === 1 && organization[0].owner === req.payload.data.userId) next()
            else next(new OrganizationForbidden())
        })
    },
    asAdminAccess: (req, res, next) => {
        checkOrganizationUserRight(req, next, req.params.organizationId, req.payload.data.userId, ROLES.ADMIN)
    },
    asMaintainerAccess: (req, res, next) => {
        checkOrganizationUserRight(req, next, req.params.organizationId, req.payload.data.userId, ROLES.MAINTAINER)
    },
    asMemberAccess: (req, res, next) => {
        checkOrganizationUserRight(req, next, req.params.organizationId, req.payload.data.userId, ROLES.MEMBER)
    }
}

function checkOrganizationUserRight(req, next, organizationId, userId, right) {
    try {
        if (!organizationId) {
            next(new OrganizationUnsupportedMediaType())
            return
        }
        OrganizationModel.getOrganizationById(organizationId).then(organization => {

            if (organization.length !== 1)
                next(new OrganizationNotFound())
            else if (organization[0].owner === userId) {
                req.userRole = ROLES.ADMIN
                next()
            } else {
                const isUserFound = organization[0].users
                    .filter(user => user.userId === userId && ROLES.hasRoleAccess(user.role, right))

                if (isUserFound.length !== 0) {
                    req.userRole = isUserFound[0].role
                    next()
                } else next(new OrganizationForbidden())
            }
        })
    } catch (err) {
        next(err)
    }
}