const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:organizations:utility')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

async function getOrganization(organizationId) {
    const organization = await model.organizations.getById(organizationId)

    if (organization.length !== 1) throw new OrganizationNotFound()
    return {
        ...organization[0],
        organizationId: organization[0]._id.toString()
    }
}

function countAdmin(organization, userId) {
    let adminCount = 0
    let isAdmin = false
    for (let oUser of organization.users) {
        if (oUser.role === ROLE.ADMIN) adminCount++
        if (oUser.userId === userId && oUser.role === ROLE.ADMIN) isAdmin = true
    }

    return {
        userCount: organization.users.length,
        adminCount,
        isAdmin
    }
}

async function getUserConversationFromOrganization(userId, organizationId) {
    const organization = (await model.organizations.getByIdAndUser(organizationId, userId))[0]
    if (!organization) throw new OrganizationError('You are not part of ' + organization.name)

    let userRole = ROLES.MEMBER
    organization.users.map(oUser => {
        if (oUser.userId === userId) {
            userRole = oUser.role
            return
        }
    })
    const projection = {
        speakers: 0,
        keywords: 0,
        highlights: 0
    }
    const conversations = await model.conversations.getByOrga(organizationId, projection)

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

    return listConv
}

module.exports = {
    getOrganization,
    countAdmin,
    getUserConversationFromOrganization
}