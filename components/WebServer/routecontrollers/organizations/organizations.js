const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
    OrganizationError,
    OrganizationUnsupportedMediaType,
    OrganizationConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function createOrganization(req, res, next) {
    try {
        if (!req.body.name) throw new OrganizationUnsupportedMediaType()

        const isOrgaFound = await model.organization.getByName(req.body.name)
        if (isOrgaFound.length === 1) throw new OrganizationConflict()

        const organization = {
            name: req.body.name,
            description: req.body.description ? req.body.description : '',
            users: [{ userId: req.payload.data.userId, role: ROLES.ADMIN }],
            owner: req.payload.data.userId,
            token: ''
        }

        if (!!req.body.users) organization.users.push(...req.body.users)

        const result = await model.organization.create(organization)
        if (result.insertedCount !== 1) throw new OrganizationError()

        return res.status(201).send({
            message: 'Organization ' + organization.name + ' created',
            organizationId: result.insertedId
        })
    } catch (err) {
        next(err)
    }
}

async function getOrganization(req, res, next) {
    try {
        if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

        const lorganization = await model.organization.getByIdAndUser(req.params.organizationId, req.payload.data.userId)
        if (lorganization.length !== 1) throw new OrganizationError()

        let organization = lorganization[0]
        let orgaUser = []
        for (let luser of organization.users) {
            let user = await model.user.getById(luser.userId)

            orgaUser.push({
                ...user[0],
                ...luser
            })
        }
        organization.users = orgaUser

        return res.status(200).send(organization)
    } catch (err) {
        next(err)
    }
}

async function listSelfOrganization(req, res, next) {
    try {
        const organizations = await model.organization.listSelf(req.payload.data.userId)
        return res.status(200).send(organizations)
    } catch (err) {
        next(err)
    }
}

// List all public organization
async function listOrganization(req, res, next) {
    try {
        const organizations = await model.organization.getAll()
        return res.status(200).send(organizations)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createOrganization,
    listSelfOrganization,
    listOrganization,
    getOrganization
}