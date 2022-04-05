const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const TYPES = organizationModel.getTypes()
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const {
    OrganizationError,
    OrganizationUnsupportedMediaType,
    OrganizationConflict,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)


async function createOrganization(req, res, next) {
    try {
        if (!req.body.name) throw new OrganizationUnsupportedMediaType()

        // Type is optional (default is public)
        if (!req.body.type) req.body.type = TYPES.public
        else if (!TYPES.asType(req.body.type)) throw new OrganizationUnsupportedMediaType()

        const isOrgaFound = await organizationModel.getOrganizationByName(req.body.name)
        if (isOrgaFound.length === 1)
            throw new OrganizationConflict()

        const organization = {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            users: [{ userId: req.payload.data.userId, role: ROLES.OWNER, visibility: TYPES.public }],
            owner: req.payload.data.userId,
            token: ''
        }

        const dbResult = await organizationModel.create(organization)
        if (dbResult.status !== 'success')
            throw new OrganizationError()

        return res.json({
            msg: 'Organization ' + organization.name + ' has been created'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function listOrganization(req, res, next) {
    try {
        let organizations = (await organizationModel.getAllOrganizations())
            .filter(organization => organization.type === TYPES.public)

        organizations.map(organization => {
            organization.users = organization.users.filter(oUser => oUser.visibility === TYPES.public)
        })
        return res.json({ organizations })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}


async function getOrganization(req, res, next) {
    try {
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        const organization = await orgaUtility.getOrganization(req.params.organizationId)

        res.status(200).send(organization)
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}



module.exports = {
    createOrganization,
    listOrganization,
    getOrganization
}
