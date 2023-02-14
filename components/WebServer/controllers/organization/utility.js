const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:organizations:utility')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)


async function getOrganization(organizationId) {
    const organization = await model.organization.getById(organizationId)

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
        userCount : organization.users.length,
        adminCount,
        isAdmin
    }
}

module.exports = { getOrganization, countAdmin }