const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:organizations:utility')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)
const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)


async function getOrganization(organizationId) {
    const organization = await organizationModel.getOrganizationById(organizationId)

    if (organization.length !== 1) throw new OrganizationNotFound()
    return {
        ...organization[0],
        organizationId: organization[0]._id.toString()
    }
}

async function getUser(email) {
    const user = await userModel.getUserByEmail(email)
    if (user.length !== 1) throw new UserNotFound()

    return {
        ...user[0],
        userId: user[0]._id.toString()
    }
}

module.exports = { getOrganization, getUser }