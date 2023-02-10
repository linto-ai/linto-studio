const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:member')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const convUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)

const RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
    OrganizationError,
    OrganizationForbidden,
    OrganizationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)


async function listConversationFromOrganization(req, res, next) {
    try {
        const userId = req.payload.data.userId
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        const organization = (await model.organization.getByIdAndUser(req.params.organizationId, userId))[0]
        if (!organization) throw new OrganizationError('You are not part of ' + organization.name)

        let userRole = ROLES.MEMBER
        organization.users.map(oUser => {
            if (oUser.userId === userId) {
                userRole = oUser.role
                return
            }
        })

        const conversations = await model.conversation.getByOrga(req.params.organizationId)

        let listConv = conversations.filter(conv => {
            let access = conv.organization.customRights.find(customRight => (customRight.userId === userId))
            if (access && RIGHT.hasRightAccess(access.right, RIGHT.READ)) {
                return conv
            } else if (!access && ROLES.hasRoleAccess(userRole, ROLES.MAINTAINER)) {
                return conv
            } else if (RIGHT.hasRightAccess(conv.organization.membersRight, RIGHT.READ)) {
                return conv
            }
        }).filter(conv => conv !== undefined)

        if (listConv.length === 0) res.status(204).send()
        else {
            listConv = await convUtility.getUserRightFromConversationList(userId, listConv)
            res.status(200).send(listConv)
        }
    } catch (err) {
        next(err)
    }
}

async function leaveSelfFromOrganization(req, res, next) {
    try {
        const userId = req.payload.data.userId
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        let organization = await model.organization.getByIdAndUser(req.params.organizationId, userId)
        if (organization.length === 0) throw new OrganizationError('You are not part of ' + organization.name)

        const data = orgaUtility.countAdmin(organization[0], userId)
        if (data.adminCount === 1 && data.isAdmin) throw new OrganizationForbidden('You cannot leave the organization because you are the last admin')

        organization.users = organization.users.filter(oUser => oUser.userId !== userId)
        const result = await model.organization.update(organization)

        if (result.matchedCount === 0) throw new OrganizationError()

        res.status(200).send({
            message: 'You have leaved the organization'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    listConversationFromOrganization,
    leaveSelfFromOrganization
}