const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:organizations:utility')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)


async function getOrganization(organizationId) {
    const organization = await organizationModel.getOrganizationById(organizationId)

    if (organization.length !== 1) throw new OrganizationNotFound()
    return {
        ...organization[0],
        organizationId: organization[0]._id.toString()
    }
}

function countAdmin(organization, userId) {
    let adminCount = 0
    let isAdmin = false
    let replaceOwner
    for (let oUser of organization.users) {
        if (oUser.role === ROLE.ADMIN) adminCount++
        if (oUser.userId === userId && oUser.role === ROLE.ADMIN) isAdmin = true
        if (oUser.userId !== userId && oUser.role === ROLE.ADMIN) replaceOwner = oUser.userId
    }

    return {
        userCount : organization.users.length,
        adminCount,
        isAdmin,
        replaceOwner
    }
}

async function canReadOrganization(organizationId, userId) {
    const organization = await getOrganization(organizationId)

    if (organization.type === 'public') return true

    for (let oUser of organization.users) {
        if (oUser.userId === userId) return true
    }
    return false
}

async function checkOrganization(organizationId, userId) {
    if (organizationId) {
        const organization = await organizationModel.getOrganizationById(organizationId)
        if (organization.length === 1) return organizationId
    } else {
        const organizations = await organizationModel.getPersonalOrganization(userId)
        if (organizations[0]?._id) return organizations[0]._id.toString()
    }
    throw new OrganizationNotFound()
}

module.exports = { getOrganization, countAdmin, canReadOrganization, checkOrganization }