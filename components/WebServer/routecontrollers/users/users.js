const { cpSync } = require('fs')

const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)

const {
    OrganizationConflict,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const {
    UserConflict,
    UserError,
    UserNotFound,
    UserUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function listUser(req, res, next) {
    try {
        const users = await userModel.getAllUsers()
        res.status(200).send(users)
    } catch (error) {
        res.send({ message: error.message })
    }
}

async function getUserById(req, res, next) {
    try {
        const userList = await userModel.getUserById(req.params.userid)
        if (userList && userList.length !== 1) throw new UserNotFound()

        res.status(200).send({
            ...userList[0]
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function createUser(req, res, next) {
    try {
        const user = req.body
        if (!user.email || !user.firstname || !user.lastname || !user.password) throw (new UserUnsupportedMediaType())

        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            user.img = await StoreFile.storeFile(req.files.file, 'picture')
        else user.img = StoreFile.defaultPicture()

        const isUserFound = await userModel.getUserByEmail(user.email)
        if (isUserFound.length !== 0) throw (new UserConflict())

        const isOrganizationFound = await organizationModel.getOrganizationByName(user.email)
        if (isOrganizationFound.length !== 0) throw (new OrganizationConflict())

        const createdUser = await userModel.createUser(user)
        if (createdUser.insertedCount !== 1) throw (new UserError())
        const createdOrganization = await organizationModel.createDefaultOrganization(createdUser.insertedId.toString(), user.email)

        if (createdOrganization.insertedCount !== 1) {
            userModel.deleteById(createdUser.insertedId.toString())
            throw (new UserError())
        }

        res.status(201).send({
            message: 'User account created'
        })
    } catch (err) {
        res.status(err.status).send({
            message: !!err.message ? err.message : 'An error occured during user creation'
        })
    }
}

async function updateUser(req, res, next) {
    try {
        if (!(req.body.email || req.body.firstname || req.body.lastname)) throw (new UserUnsupportedMediaType())

        const myUser = await userModel.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw (new UserNotFound())
        let user = myUser[0]

        if (req.body.email) user.email = req.body.email
        if (req.body.firstname) user.firstname = req.body.firstname
        if (req.body.lastname) user.lastname = req.body.lastname

        const result = await userModel.update(user)
        if (result.matchedCount === 0) throw new UserError()

        let message
        (result.modifiedCount === 1) ? message = 'User updated' : message = 'No modification to user'
        res.status(200).send({
            message
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserPicture(req, res, next) {
    try {
        if (!req.files && Object.keys(req.files).length === 0 && !req.files.file) throw new UserUnsupportedMediaType()
        const payload = {
            _id: req.payload.data.userId,
            img: await StoreFile.storeFile(req.files.file, 'picture')
        }

        const myUser = await userModel.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw (new UserNotFound())

        const result = await userModel.update(payload)
        if (result.matchedCount === 0) throw new UserError()

        res.status(200).send({
            message: 'User picture updated'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function updateUserPassword(req, res, next) {
    try {
        if (!req.body.newPassword) throw (new UserUnsupportedMediaType())

        const myUser = await userModel.getUserById(req.payload.data.userId)

        if (myUser.length !== 1) throw (new UserNotFound())
        const payload = {
            ...myUser[0],
            newPassword: req.body.newPassword
        }

        const result = await userModel.updatePassword(payload)
        if (result.matchedCount === 0) throw new UserError()

        res.cookie('authToken', '')
        res.cookie('userId', '')
        req.session.destroy(function (err) {
            if (err) throw 'Error on deleting session'
            res.redirect('/login')
        })

        res.status(200).send({
            message: 'User password updated'
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
                req.session.destroy(function (err) {
                    // cannot access session here
                    if (err) throw 'Error on deleting session'
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

        organizations.filter(organization => {
            if (organization.owner !== userId && organization.personal === true) return false
            else if (organization.owner === userId && organization.users.length === 0) return true
            else if ((organization.users.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async (organization) => {
            if (organization.owner === userId && organization.users.length === 0) {
                let resultOperation = await organizationModel.deleteById(organization._id.toString())
                if (resultOperation.deletedCount !== 1) throw new UserError('Error on personal organization')
            } else {
                organization.users = organization.users.filter(user => user.userId !== userId)
                let resultOperation = await organizationModel.update(organization)
                if (resultOperation.modifiedCount === 0) throw new UserError('Error on organization rights deletion')
            }
        })

        const conversations = await conversationModel.getAllConvos()
        conversations.filter(conversation => {
            if ((conversation.sharedWithUsers.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async (conversation) => {
            conversation.sharedWithUsers = conversation.sharedWithUsers.filter(user => user.userId !== userId)
            const resultConvoUpdate = await conversationModel.update(conversation)
            if (resultConvoUpdate.modifiedCount === 0) throw new UserError('Error on conversation rights deletion')
        })

        const result = await userModel.deleteUser(req.payload.data.userId)
        if (result.deletedCount !== 1) throw new UserError

        res.status(200).send({
            message: 'User deleted'
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