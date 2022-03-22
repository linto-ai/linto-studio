const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const TYPES = organizationModel.getTypes()
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const {
    OrganizationError,
    OrganizationNotFound,
    OrganizationParameterMissing,
    OrganizationAddUserError,
    OrganizationWrongParameterType,
    OrganizationUpdateUserError,
    OrganizationNameAlreadyUsed,
    OrganizationUnknowType,
    OrganizationDeleteError
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function createOrganization(req, res, next) {
    try{
        if(!req.body.name || !req.body.type) 
            throw new OrganizationParameterMissing()
        if(!TYPES.asType(req.body.type)) 
            throw new OrganizationUnknowType()

        const isOrgaFound = await organizationModel.getOrganizationByName(req.body.name)
        if (isOrgaFound.length === 1) 
            throw new OrganizationNameAlreadyUsed()

        const organization = {
            name : req.body.name,
            type : req.body.type,
            description : req.body.description,
            users : [{userId : req.payload.data.userId, role : ROLES.OWNER}],
            owner : req.payload.data.userId
        }

        const dbResult = await organizationModel.create(organization)
        if(dbResult.status !== 'success') 
            throw new OrganizationError('Error while creating an organization')
        
        return res.json({ 
            msg : 'Organization '+ organization.name +' has been created'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function listOrganization(req, res, next) {
    try{
        const organizations = (await organizationModel.getAllOrganizations())
            .filter(organization => organization.type === TYPES.public)
        return res.json({ organizations })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function listUserOrganization(req, res, next) {
    try{
        const organizations = await organizationModel.getAllOrganizations()
        const userOrganizations = organizations.filter(organization => { 
            if(organization.owner === req.payload.data.userId) return true
            return organization.users.filter(user => user.userId === req.payload.data.userId) ? true : false
        })

        return res.json({ userOrganizations })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function addUserInOrganization(req, res, next) {
    try{
        if(!req.params.organizationId || !req.body.email) 
            throw new OrganizationParameterMissing()
        if(!req.body.role) 
            req.body.role = ROLES.MEMBER
        else if(isNaN(req.body.role) && req.body.role > ROLES.OWNER) 
            throw new OrganizationWrongParameterType("Unknown role value")
        
        const organization = await getOrga(req.params.organizationId)
        const user = await getUser(req.body.email)

        if(organization.users.filter(oUser => oUser.userId === user.userId).length !== 0) 
            throw new OrganizationAddUserError('User already in '+ organization.name +' organization')
        organization.users.push( { userId : user.userId, role: req.body.role }) // add user to organization

        const dbResult = await organizationModel.update(organization)
        if(dbResult !== 'success') 
            throw new OrganizationAddUserError('Error while updating organization')

        res.status(200).send({
            msg: 'User added to the '+ organization.name +' organization'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserRoleInOrganization(req, res, next) {
    try{
        if(!req.params.organizationId || !req.body.email || !req.body.role) 
            throw new OrganizationParameterMissing()
        if(isNaN(req.body.role) && req.body.role > ROLES.OWNER) 
            throw new OrganizationWrongParameterType("Unknown role value")

        let organization = await getOrga(req.params.organizationId)
        const user = await getUser(req.body.email)

        if(organization.users.filter(oUser => oUser.userId === user.userId).length === 0) throw new OrganizationUpdateUserError('User is not part of the '+ organization.name +' organization')

        organization.users.map(oUser => {
            if(oUser.userId === user.userId) {
                oUser.role = parseInt(req.body.role)
                return
            }
        })

        const result = await organizationModel.update(organization)
        if(result !== 'success') throw new OrganizationAddUserError('Error when updating organization')

        res.status(200).send({
            msg: 'User role updated'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}


async function deleteUserFromOrganization(req, res, next){
    try{
        if(!req.params.organizationId || !req.body.email) throw new OrganizationParameterMissing()

        let organization = await getOrga(req.params.organizationId)
        const user = await getUser(req.body.email)

        if(organization.users.filter(oUser => oUser.userId === user.userId).length === 0) throw new OrganizationUpdateUserError('User is not part of the '+ organization.name +' organization')

        organization.users = organization.users.filter(oUser => oUser.userId !== user.userId)
        const result = await organizationModel.update(organization)

        if(result !== 'success') throw new OrganizationDeleteError('Error when delete user in organization')

        res.status(200).send({
            msg: 'User role deleted'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}


async function deleteOrganization(req, res, next) {
    try{
        if(!req.params.organizationId) throw new OrganizationParameterMissing()
        const organization = await getOrga(req.params.organizationId)
        const result = await organizationModel.deleteById(organization._id.toString())

        if(result.status !== 'success') throw new OrganizationDeleteError('Error when updating organization')

        res.status(200).send({
            msg: 'Organization deleted'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function getOrganization(req, res, next) {
    try{
        if(!req.params.organizationId) throw new OrganizationParameterMissing()

        const organization = await getOrga(req.params.organizationId)

        res.status(200).send(organization)
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

module.exports = {
    createOrganization,
    listOrganization,
    listUserOrganization,
    addUserInOrganization,
    updateUserRoleInOrganization,
    deleteUserFromOrganization,
    deleteOrganization,
    getOrganization
}


async function getOrga(organizationId) {
    const organization = await organizationModel.getOrganizationById(organizationId)
    if (organization.length !== 1) throw new OrganizationNotFound()
    return {
        ...organization[0],
        organizationId : organization[0]._id.toString()
    }
}

async function getUser(email){
    const user = await userModel.getUserByEmail(email)
    if (user.length !== 1) throw new UserNotFound()
    
    return {
        ...user[0],
        userId : user[0]._id.toString()
    }
}
