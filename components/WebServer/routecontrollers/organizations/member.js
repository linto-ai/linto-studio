const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:member')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const CONVERSATION_RIGHT = require(`${process.cwd()}/lib/dao/rights/conversation`)

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
        next(err)
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
        next(err)
    }
}

async function listSelfConversationFromOrganization(req, res, next) {
    try {
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()
        const conversations = await conversationModel.getConvoByOrga(req.params.organizationId)

        let selfConvFromOrga = []
        conversations.filter(conv => {
            if (conv.owner === req.payload.data.userId) {
                selfConvFromOrga.push(conv)
            } else {
                let access = conv.organization.customRights.find(customRight =>
                    (customRight.userId === req.payload.data.userId))

                if (access && CONVERSATION_RIGHT.hasRightAccess(access.right, CONVERSATION_RIGHT.READ)) {
                    selfConvFromOrga.push(conv)
                } else if (CONVERSATION_RIGHT.hasRightAccess(conv.organization.membersRight, CONVERSATION_RIGHT.READ)) {
                    selfConvFromOrga.push(conv)
                }
            }
        })
        res.status(200).send(selfConvFromOrga)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    listSelfConversationFromOrganization,
    updateSelfFromOrganization,
    leaveSelfFromOrganization
}