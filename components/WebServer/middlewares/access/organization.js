const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:access:organization')

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
    OrganizationForbidden,
    OrganizationNotFound,
    OrganizationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

module.exports = {
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
    let isToNext = false

    try {
        if (!organizationId) {
            isToNext = callNext(next, isToNext, new OrganizationUnsupportedMediaType())
            return
        }
        model.organization.getById(organizationId).then(organization => {
            if (organization.length !== 1)
                isToNext = callNext(next, isToNext, new OrganizationNotFound())
            else {
                const isUserFound = organization[0].users
                    .filter(user => user.userId === userId && ROLES.hasRoleAccess(user.role, right))

                if (isUserFound.length !== 0) {
                    req.userRole = isUserFound[0].role
                    isToNext = callNext(next, isToNext)
                } else isToNext = callNext(next, isToNext, new OrganizationForbidden())
            }
        })
    } catch (err) {
        callNext(next, isToNext, err)
    }
}

function callNext(next, isToNext, err) {
    if (!isToNext && err) next(err)
    else if (!isToNext) next()
    else if (err) console.error(err)
    else console.error('Next called multiple times')

    return true
}