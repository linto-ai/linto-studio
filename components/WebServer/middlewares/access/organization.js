const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:access:organization')

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
    OrganizationForbidden,
    OrganizationNotFound,
    OrganizationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

module.exports = {
    asAdminAccess: async (req, res, next) => {
        await access(req, next, req.params.organizationId, req.payload.data.userId, ROLES.ADMIN)
    },
    asMaintainerAccess: async (req, res, next) => {
        await access(req, next, req.params.organizationId, req.payload.data.userId, ROLES.MAINTAINER)
    },
    asUploaderAccess: async (req, res, next) => {
        await access(req, next, req.params.organizationId, req.payload.data.userId, ROLES.UPLOADER)
    },
    asMemberAccess: async (req, res, next) => {
        await access(req, next, req.params.organizationId, req.payload.data.userId, ROLES.MEMBER)
    },
    access: async (req, next, organizationId, userId, right) => {
        await access(req, next, organizationId, userId, right)
    }
}

async function access(req, next, organizationId, userId, right) {
    try {
        if (!organizationId) {
            return next(new OrganizationUnsupportedMediaType())
        }
        const organization = await model.organizations.getById(organizationId)
        if (organization.length !== 1)
            return next(new OrganizationNotFound())
        else {
            const isUserFound = organization[0].users
                .filter(user => user.userId === userId && ROLES.hasRoleAccess(user.role, right))

            if (isUserFound.length !== 0) {
                if (req) req.userRole = isUserFound[0].role
                
                return next()
            } else return next(new OrganizationForbidden())
        }
    } catch (err) {
        return next(err)
    }
}