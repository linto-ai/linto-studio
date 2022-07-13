const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const TYPES = organizationModel.getTypes()
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const {
    OrganizationError,
    OrganizationUnsupportedMediaType,
    OrganizationConflict,
    OrganizationForbidden,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function searchOrganizationByName(req, res, next) {
    try {
        if (!req.body.name) throw new OrganizationUnsupportedMediaType()

        let organizations = await organizationModel.getAllOrganizations()

        organizations = organizations
            .filter(orga => orga.name.includes(req.body.name))
            .filter(orga => orga.owner === req.payload.data.userId || !orga.personal)
            .map(orga => {
                const isInOrga = orga.users.some(oUser => oUser.userId === req.payload.data.userId)
                if (!isInOrga && orga.type === TYPES.private) return null

                if (!isInOrga) {
                    orga.users = orga.users.filter(oUser => oUser.visibility === TYPES.public)
                }
                delete orga.users

                return orga
            }).filter(orga => orga !== null)

        return res.json({ organizations })
    } catch (err) {
        next(err)
    }
}

async function createOrganization(req, res, next) {
    try {
        if (!req.body.name) throw new OrganizationUnsupportedMediaType()

        // Type is optional (default is public)
        if (!req.body.type) req.body.type = TYPES.public
        else if (!TYPES.asType(req.body.type)) throw new OrganizationUnsupportedMediaType()

        const isOrgaFound = await organizationModel.getOrganizationByName(req.body.name)
        if (isOrgaFound.length === 1) throw new OrganizationConflict()

        const organization = {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description ? req.body.description : '',
            users: [{ userId: req.payload.data.userId, role: ROLES.OWNER, visibility: TYPES.public }],
            owner: req.payload.data.userId,
            token: ''
        }

        if (!!req.body.users) organization.users.push(...req.body.users)

        const result = await organizationModel.create(organization)
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
        let organization = await orgaUtility.getOrganization(req.params.organizationId)

        const isInOrga = organization.users.some(oUser => oUser.userId === req.payload.data.userId)

        if (!isInOrga && organization.type === TYPES.private) throw new OrganizationForbidden()
        else {
            if (!isInOrga) {
                organization.users = organization.users.filter(oUser => oUser.visibility === TYPES.public)
            }

            let orgaUser = []
            for (let user of organization.users) {
                const myUser = await userModel.getUserById(user.userId)
                if (myUser && myUser.length !== 1) {
                    orgaUser.push(user)
                } else {
                    orgaUser.push({
                        ...myUser[0],
                        role: user.role,
                        visibility: user.visibility
                    })
                }
            }
            organization.users = orgaUser

            res.status(200).send(organization)
        }
    } catch (err) {
        next(err)
    }
}

async function listSelfOrganization(req, res, next) {
    try {
        const organizations = await organizationModel.getAllOrganizations()
        const userOrganizations = organizations.filter(organization => {
            if (organization.owner === req.payload.data.userId) return true

            if ((organization.users.filter(user => user.userId === req.payload.data.userId)).length === 1) return true
        }).map(organization => {
            delete organization.users
            return organization
        })
        return res.json({ userOrganizations })
    } catch (err) {
        next(err)
    }
}


async function listOrganization(req, res, next) {
    try {
        let organizations = await organizationModel.getAllOrganizations()

        organizations = organizations
            .filter(orga => orga.owner === req.payload.data.userId || !orga.personal)
            .map(orga => {
                const isInOrga = orga.users.some(oUser => oUser.userId === req.payload.data.userId)
                if (!isInOrga && orga.type === TYPES.private) return null

                if (!isInOrga) {
                    orga.users = orga.users.filter(oUser => oUser.visibility === TYPES.public)
                }

                return orga
            }).filter(orga => orga !== null)

        return res.json({ organizations })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createOrganization,
    listSelfOrganization,
    listOrganization,
    searchOrganizationByName,
    getOrganization
}