const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:member')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const convUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)

const TYPES = organizationModel.getTypes()

const {
    OrganizationError,
    OrganizationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)


async function updateSelfFromOrganization(req, res, next) {
    try {
        const userId = req.payload.data.userId
        if (!req.params.organizationId || !req.body.visibility) throw new OrganizationUnsupportedMediaType()
        if (!TYPES.asType(req.body.visibility)) throw new OrganizationUnsupportedMediaType('Visibility parameter must be public or private')

        let organization = await orgaUtility.getOrganization(req.params.organizationId)
        if (organization.users.filter(oUser => oUser.userId === userId).length === 0)
            throw new OrganizationError('User is not part of the ' + organization.name + ' organization')

        organization.users.map(oUser => {
            if (oUser.userId === userId) {
                oUser.visibility = req.body.visibility
                return
            }
        })

        const result = await organizationModel.update(organization)
        if (result.matchedCount === 0) throw new OrganizationError()

        res.status(200).send({
            message: 'User updated from the organization'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function leaveSelfFromOrganization(req, res, next) {
    try {
        const userId = req.payload.data.userId
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        let organization = await orgaUtility.getOrganization(req.params.organizationId)
        if (organization.users.filter(oUser => oUser.userId === userId).length === 0)
            throw new OrganizationError('You are not part of ' + organization.name)

        organization.users = organization.users.filter(oUser => oUser.userId !== userId)
        const result = await organizationModel.update(organization)

        if (result.matchedCount === 0) throw new OrganizationError()

        res.status(200).send({
            message: 'You have leaved the organization'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function listConversationFromOrganization(req, res, next) {
    try {
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        const conversations = await convUtility.getOrgaConversation(req.params.organizationId)

        res.status(200).send(conversations)
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

module.exports = {
    listConversationFromOrganization,
    updateSelfFromOrganization,
    leaveSelfFromOrganization
}