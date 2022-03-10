const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const { RIGHTS, TYPES } = require(`${process.cwd()}/lib/dao/organizations.js`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const {
    OrganizationError,
    OrganizationNotFound,
    OrganizationParameterMissing,
    OrganizationAddUserError,
    OrganizationUpdateUserError,
    OrganizationNameAlreadyUsed,
    OrganizationUnknowType
} = require(`${process.cwd()}/components/WebServer/error/exception/organizations`)

const {
    UserNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function createOrganization(req, res, next) {
    try{
        if(!req.body.name || !req.body.type) throw new OrganizationParameterMissing()
        if(!TYPES.asType(req.body.type)) throw new OrganizationUnknowType()
        if(req.body.type === TYPES.personal) throw new OrganizationUnknowType('Unable to create an '+ TYPES.personal+' organization')

        const organizationSearch = await organizationModel.getOrganizationByName(req.body.name)
        if (organizationSearch.length === 1) throw new OrganizationNameAlreadyUsed()

        const organization = {
            name : req.body.name,
            type : req.body.type,
            description : req.body.description,
            users : [{userId : req.payload.data.userId, rights : RIGHTS.OWNER}],
            owner : req.payload.data.userId
        }

        const result = await organizationModel.create(organization)
        if(result.status !== 'success') throw new OrganizationError('Error while creating an organization')
        res.json({
            msg : 'Organization '+ organization.name +' has been created'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}


async function listUserOrganization(req, res, next) {
    try{
        const organizations = await organizationModel.getAllOrganizations()

        const userOrganizations = organizations.filter(organization => { 
            return (organization.users.filter(user => user.userId === req.payload.data.userId))
        })
        res.json({
            userOrganizations
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function addUserInOrganization(req, res, next) {
    try{
        if(!req.params.organizationId || !req.body.email) throw new OrganizationParameterMissing()
        if(!req.body.rights) req.body.rights = 1

        const organization = await organizationModel.getOrganizationById(req.params.organizationId)
        const user = await userModel.getUserByEmail(req.body.email)
        if (organization.length !== 1) throw new OrganizationNotFound()
        if (organization[0].type === 'personal') throw new OrganizationAddUserError('Unable to add an user to a personal organization')
        if (user.length !== 1) throw new UserNotFound()
        
        const userId = user[0]._id.toString()
        if(organization[0].users.filter(user => user.userId === userId).length !== 0) throw new OrganizationAddUserError('User already in '+ organization[0].name +' organization')

        organization[0].users.push( { userId : user[0]._id.toString(), rights: req.body.rights })
        const result = await organizationModel.update(organization[0])
        if(result !== 'success') throw new OrganizationAddUserError('Error when updating organization')

        res.status(200).send({
            msg: 'User added to the '+ organization[0].name +' organization'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserRightInOrganization(req, res, next) {
    try{
        if(!req.params.organizationId || !req.body.email) throw new OrganizationParameterMissing()
        if(!req.body.rights) throw new OrganizationParameterMissing()

        const organizationRes = await organizationModel.getOrganizationById(req.params.organizationId)
        const user = await userModel.getUserByEmail(req.body.email)

        if (organization.length !== 1) throw new OrganizationNotFound()
        if (organization[0].type === 'personal') throw new OrganizationAddUserError('Unable to update an user from personal organization')
        if (user.length !== 1) throw new UserNotFound()

        let organization = organizationRes[0]
        const userId = user[0]._id.toString()
        if(organization.users.filter(user => user.userId === userId).length === 0) throw new OrganizationUpdateUserError('User is not part of the '+ organization.name +' organization')

        organization.users.map(user => {
            if(user.userId === userId) {
                user.rights = req.body.rights
                return
            }
        })

        const result = await organizationModel.update(organization)
        if(result !== 'success') throw new OrganizationAddUserError('Error when updating organization')

        res.status(200).send({
            msg: 'User rights updated'
        })
    }catch(err){
        debug(err)
        res.status(err.status).send({ message: err.message })
    }
}


async function deleteUserFromOrganization(req, res, next){
    try{
        if(!req.params.organizationId || !req.body.email) throw new OrganizationParameterMissing()

        const organizationRes = await organizationModel.getOrganizationById(req.params.organizationId)
        const user = await userModel.getUserByEmail(req.body.email)

        if (organizationRes.length !== 1) throw new OrganizationNotFound()
        if (organizationRes[0].type === 'personal') throw new OrganizationAddUserError('Unable to delete an user from personal organization')
        if (user.length !== 1) throw new UserNotFound()

        let organization = organizationRes[0]
        const userId = user[0]._id.toString()
        if(organization.users.filter(user => user.userId === userId).length === 0) throw new OrganizationUpdateUserError('User is not part of the '+ organization.name +' organization')

        organization.users = organization.users.filter(user => user.userId !== userId)

        const result = await organizationModel.update(organization)
        if(result !== 'success') throw new OrganizationAddUserError('Error when delete user in organization')

        res.status(200).send({
            msg: 'User rights deleted'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}


async function deleteOrganization(req, res, next) {
    try{
        if(!req.params.organizationId) throw new OrganizationParameterMissing()

        const organization = await organizationModel.getOrganizationById(req.params.organizationId)

        if (organization.length !== 1) throw new OrganizationNotFound()
        if (organization[0].type === 'personal') throw new OrganizationAddUserError('Personal organization cannot be deleted' )

        const result = await organizationModel.deleteById(organization[0]._id.toString())
        debug(result)
        if(result.status !== 'success') throw new OrganizationAddUserError('Error when updating organization')

        res.status(200).send({
            msg: 'Organization deleted'
        })
    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}


module.exports = {
    createOrganization,
    listUserOrganization,
    addUserInOrganization,
    updateUserRightInOrganization,
    deleteUserFromOrganization,
    deleteOrganization
}