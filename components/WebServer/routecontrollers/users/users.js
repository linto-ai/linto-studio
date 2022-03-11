const { cpSync } = require('fs')

const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const { TYPES } = require(`${process.cwd()}/lib/dao/organizations.js`)


const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)
const {
    UserNotFound,
    UserEmailAlreadyUsed,
    UserParameterMissing,
    UserCreationError,
    UserUpdateError,
    UserDeleteError,
    UserLogoutError
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function listUser(req, res, next) {
    try {
        const users = await userModel.getAllUsers()
        res.json(users)
    } catch (error) {
        res.send({ message: error.message })
    }
}

async function getUserById(req, res, next) {
    try {
        const userList = await userModel.getUserById(req.params.userid)
        if (userList && userList.length !== 1) throw new UserNotFound()

        res.json({
            ...userList[0]
        })

    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function createUser(req, res, next) {
    try {
        const user = req.body
        if (!user.email || !user.firstname || !user.lastname || !user.userName ||!user.password) throw (new UserParameterMissing())

        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            user.img = await StoreFile.storeFile(req.files.file, 'picture')
        else user.img = StoreFile.defaultPicture()

        const isUserFind = await userModel.getUserByEmail(user.email)
        if(isUserFind.length !== 0) throw (new UserEmailAlreadyUsed())

        const isOrganizationFind = await organizationModel.getOrganizationByName(user.email)
        if(isOrganizationFind.length !== 0) throw (new UserEmailAlreadyUsed())

        const createdUser = await userModel.createUser(user)
        if(createdUser.status !== 'success') throw (new UserCreationError())

        const createdOrganization = await organizationModel.createPersonal(createdUser.insertedId.toString(), user.email)
        if(createdOrganization.status !== 'success'){
            userModel.deleteById(createdUser.insertedId.toString())
            throw (new UserCreationError())
        } 

        res.json({
            status: 'success',
            msg: 'Your account has been created'
        })
    } catch (error) {
        res.status(error.status).send({
            msg: !!error.message ? error.message : 'An error occured during user creation'
        })
    }
}

async function updateUser(req, res, next) {
    try {
        if (!(req.body.userName || req.body.email || req.body.firstname || req.body.lastname)) throw (new UserParameterMissing())

        let myUser = await userModel.getUserById(req.payload.data.userId)
        if(myUser.length !== 1) throw (new UserNotFound())
        let user = myUser[0]

        req.body.userName ? user.userName = req.body.userName : ''
        req.body.email ? user.email = req.body.email : ''
        req.body.firstname ? user.firstname = req.body.firstname : ''
        req.body.lastname ? user.lastname = req.body.lastname : ''

        let result = await userModel.update(user)
        if (result !== 'success') throw new UserUpdateError()

        res.status(200).send({
            msg: 'User has been updated'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserPicture(req, res, next) {
    try {
        if(!req.files && Object.keys(req.files).length === 0 && !req.files.file) throw new UserParameterMissing()

        const payload = {
            _id: req.payload.data.userId,
            img: await StoreFile.storeFile(req.files.file, 'picture')
        }

        const myUser = await userModel.getUserById(req.payload.data.userId)
        if(myUser.length !== 1) throw (new UserNotFound())

        const result = await userModel.update(payload)
        if (result !== 'success') throw new UserUpdateError()

        res.status(200).send({
            msg: 'User picture has been updated'
        })

    } catch(err){
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserPassword(req, res, next) {
    try {
        if (!req.body.newPassword) throw (new UserParameterMissing())

        const myUser = await userModel.getUserById(req.payload.data.userId)

        if(myUser.length !== 1) throw (new UserNotFound())
        const payload = {
            ...myUser[0],
            newPassword : req.body.newPassword
        }

        const result = await userModel.updatePassword(payload)
        if (result !== 'success') throw new UserUpdateError()

        res.cookie('authToken', '')
        res.cookie('userId', '')
        req.session.destroy(function(err) {
            if (err) {
                throw 'Error on deleting session'
            }
            res.redirect('/login')
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function logout(req, res, next) {
    try {
        if (!!req.session.userId) {
            userModel.update({
                _id: req.session.userId,
                keyToken: ''
            }).then(user => {
                res.cookie('authToken', '')
                res.cookie('userId', '')
                req.session.destroy(function(err) {
                    // cannot access session here
                    if (err) {
                        throw 'Error on deleting session'
                    }
                    res.redirect('/login')
                })
            })
        } else {
            throw 'Session not found'
        }
    } catch (error) {
        console.error(error)
        res.redirect('/login')
    }
}


async function deleteUser(req, res, next) {
    try {

        const userId = req.payload.data.userId
        
        const organizations = await organizationModel.getAllOrganizations()
        const userOrganizations = organizations.filter(organization => { 
            const userFind = organization.users.filter(user => user.userId === userId)
            if(userFind.length !== 0) return true
        })
        userOrganizations.map(async (organization) => {
            if(organization.type === TYPES.personal) {
                const resultOrgaDelete = await organizationModel.deleteById(organization._id)
                if(resultOrgaDelete.status !== 'success') throw new UserDeleteError('Error during personal organization deletion')
            }else {
                organization.users = organization.users.filter(user => user.userId !== userId)
                const resultOrgaUpdate = await organizationModel.update(organization)
                if(resultOrgaUpdate !== 'success') throw new UserDeleteError('Error during organization rights deletion')
            }
        })

        const result = await userModel.deleteUserbyId(req.payload.data.userId)
        if(result.status !== 'success') throw new UserDeleteError

        res.status(200).send({
            msg: 'User deleted'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}


module.exports = {
    listUser,
    getUserById,
    deleteUser,
    createUser,
    logout,
    updateUser,
    updateUserPassword,
    updateUserPicture
}