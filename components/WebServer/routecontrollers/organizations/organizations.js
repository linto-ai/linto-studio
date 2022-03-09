const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const {
    OrganizationError,
    OrganizationNotFound,
    OrganizationParameterMissing,
    OrganizationAddUserError
} = require(`${process.cwd()}/components/WebServer/error/exception/organizations`)

const {
    UserNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function listUserOrganization(req, res, next) {
    try{
        const organizations = await organizationModel.getAllOrganizations()
        const userOrganizations = organizations.filter(organization => { 
            return (organization.users.indexOf(req.payload.data.userId) > -1)
        })
        res.json({
            userOrganizations
        })
    }catch(err){
        const error = new OrganizationError(err)
        res.status(error.status).send({ message: error.message })
    }
}

async function addUserInOrganization(req, res, next) {
    try{
        if(!req.body.organization || !req.body.email) throw new OrganizationParameterMissing()
        
        if(!req.body.rights) req.body.rights = 1

        const organization = await organizationModel.getOrganizationByName(req.body.organization)
        const user = await userModel.getUserByEmail(req.body.email)

        if (organization.length !== 1 || organization[0].type === 'personal') throw new OrganizationNotFound()
        if (user.length !== 1) throw new UserNotFound()
        
        const userId = user[0]._id.toString()
        if(organization[0].users.indexOf(userId) > -1) throw new OrganizationAddUserError('User already in '+ req.body.organization +' organization')

        organization[0].users.push(user[0]._id.toString())
        const result = await organizationModel.update(organization[0])
        if(result !== 'success') throw new OrganizationAddUserError('Error when updating organization')

        res.status(200).send({
            msg: 'User added to the '+ req.body.organization +' organization'
        })

    }catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

module.exports = {
    listUserOrganization,
    addUserInOrganization
}