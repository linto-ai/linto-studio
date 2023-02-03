const Mail = require('nodemailer/lib/mailer')

const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const { storeFile, defaultPicture, deleteFile, getStorageFolder } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
    OrganizationConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const {
    UserConflict,
    UserError,
    UserNotFound,
    UserUnsupportedMediaType,
    GenerateMagicLinkError
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function createUser(req, res, next) {
    try {
        const user = req.body
        let organizationName = req.body.organizationName

        if (!user.email || !user.firstname || !user.lastname || !user.password) throw new UserUnsupportedMediaType()

        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            user.img = await storeFile(req.files.file, 'picture')
        else user.img = defaultPicture()

        if (!organizationName) organizationName = user.email + '\'s Organization'

        if (((await model.user.getByEmail(user.email)).length) !== 0) throw new UserConflict()
        if (((await model.organization.getByName(organizationName)).length) !== 0) throw new OrganizationConflict()

        const createdUser = await model.user.createUser(user)
        if (createdUser.insertedCount !== 1) throw new UserError()

        const createdOrganization = await model.organization.createDefault(createdUser.insertedId.toString(), organizationName)
        if (createdOrganization.insertedCount !== 1) {
            model.user.deleteUser(createdUser.insertedId.toString())
            throw new UserError()
        }

        const mail_result = await Mailing.accountCreate(user.email, req, createdUser.ops[0].authLink.magicId)
        if (!mail_result) debug('Error when sending mail')

        res.status(201).send({
            message: 'Account created. An email has been sent to you. Please open it and click on the link to validate your email address.'
        })
    } catch (err) {
        next(err)
    }
}

async function listUser(req, res, next) {
    try {
        const publicUsers = await model.user.listPublicUsers()
        res.status(200).send(publicUsers)
    } catch (err) {
        next(err)
    }
}


async function searchUser(req, res, next) {
    try {
        if (!req.body.search) throw new UserUnsupportedMediaType()

        const userList = (await model.user.listPublicUsers()).filter(user => {
            const userField = [user.firstname, user.lastname, user.email,
            user.firstname + ' ' + user.lastname, user.lastname + ' ' + user.firstname]

            const find = userField
                .map(field => field.toLowerCase())
                .filter(field => field.indexOf(req.body.search.toLowerCase()) >= 0)

            return (find.length > 0)
        })

        if (searchUser.length === 0) res.status(204).send()
        else res.status(200).send(userList)
    } catch (err) {
        next(err)
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await model.user.getById(req.params.userId)
        if (user && user.length !== 1) throw new UserNotFound()

        res.status(200).send({
            ...user[0]
        })
    } catch (err) {
        next(err)
    }
}

async function updateUser(req, res, next) {
    try {
        if (!(req.body.email || req.body.firstname || req.body.lastname || req.body.accountNotifications || req.body.emailNotifications)) throw new UserUnsupportedMediaType()

        const myUser = await model.user.getById(req.payload.data.userId)
        if (myUser.length !== 1) throw new UserNotFound()
        let user = myUser[0]

        if (req.body.email) {
            if ((await model.user.getByEmail(req.body.email)).length === 1) throw new UserConflict("Email already used")
            user.email = req.body.email
        }
        if (req.body.firstname) user.firstname = req.body.firstname
        if (req.body.lastname) user.lastname = req.body.lastname


        if (req.body.accountNotifications) {
            for (let key of Object.keys(req.body.accountNotifications)) {
                user.accountNotifications[key] = req.body.accountNotifications[key]
            }
        }
        if (req.body.emailNotifications) {
            for (let keyParent of Object.keys(req.body.emailNotifications)) {
                for (let keyChild of Object.keys(req.body.emailNotifications[keyParent])) {
                    user.emailNotifications[keyParent][keyChild] = req.body.emailNotifications[keyParent][keyChild]
                }
            }
        }

        const result = await model.user.update(user)
        if (result.matchedCount === 0) throw new UserError()
        else if (result.modifiedCount === 1) res.status(200).send({ message: 'User updated' })
        else res.status(200).send({ message: 'No modification to user' })
    } catch (err) {
        next(err)
    }
}

async function updateUserPicture(req, res, next) {
    try {
        if (!req.files && Object.keys(req.files).length === 0 && !req.files.file) throw new UserUnsupportedMediaType()
        const payload = {
            _id: req.payload.data.userId,
            img: await storeFile(req.files.file, 'picture')
        }

        const user = await model.user.getById(req.payload.data.userId)
        if (user.length !== 1) throw new UserNotFound()

        const result = await model.user.update(payload)
        if (result.matchedCount === 0) throw new UserError()

        if (user[0].img !== defaultPicture())
            await deleteFile(`${getStorageFolder()}/${user[0].img}`)


        res.status(200).send({
            message: 'User picture updated'
        })
    } catch (err) {
        next(err)
    }
}

async function updateUserPassword(req, res, next) {
    try {
        if (!req.body.newPassword) throw new UserUnsupportedMediaType()

        const result = await model.user.updatePassword(req.payload.data.userId, req.body.newPassword)
        if (result.matchedCount === 0) throw new UserError()

        res.status(200).send({
            message: 'Password updated'
        })
    } catch (err) {
        next(err)
    }
}

async function logout(req, res, next) {
    try {
        if (!req.payload.data && !req.payload.data.userId) throw new UserUnsupportedMediaType()
        const result = await model.user.logout(req.payload.data.userId)
        if (result.matchedCount === 0) throw new UserError()

        res.status(200).send({ message: 'User has been disconnected' })
    } catch (err) {
        next(err)
    }
}

async function recoveryAuth(req, res, next) {
    try {
        if (!req.body.email) throw new UserUnsupportedMediaType()
        const userList = await model.user.getUserByEmail(req.body.email, true)
        if (userList.length !== 1) {
            debug(`Forgotten password request for an unknown or invalid email address: ${req.body.email}`)
            res.status(200).send({
                message: 'An email with an authentication link has been sent to you.'
            })
        } else {
            const updatedUser = await model.user.generateMagicLink(userList[0])
            if (updatedUser.modifiedCount === 0) throw new GenerateMagicLinkError()

            const mail_result = await Mailing.resetPassword(userList[0].email, req, updatedUser.data.magicId)
            if (!mail_result) res.status(400).send({ message: 'Error while sending email' })
            else res.status(200).send({ message: 'An email with an authentication link has been sent to you.' })
        }
    } catch (error) {
        next(error)
    }
}


async function deleteUser(req, res, next) {
    try {
        const userId = req.payload.data.userId

        // Remove user from organizations
        const organizations = await model.organization.getAllOrganizations()
        organizations.filter(organization => {
            if (organization.owner === userId && organization.users.length === 0) return true
            else if ((organization.users.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async (organization) => {
            if (organization.owner === userId && organization.users.length === 1) {
                let resultOperation = await model.organization.deleteById(organization._id.toString())
                if (resultOperation.deletedCount !== 1) throw new UserError('Error on personal organization')
            } else {
                organization.users = organization.users.filter(user => user.userId !== userId)
                let resultOperation = await model.organization.update(organization)
                if (resultOperation.modifiedCount === 0) throw new UserError('Error on organization rights deletion')
            }
        })

        // Delete conversation if owner and remove user from shared with
        const conversations = await model.conversation.getAllConvos()
        conversations.filter(conversation => {
            if ((conversation.sharedWithUsers.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async conversation => {
            conversation.sharedWithUsers = conversation.sharedWithUsers.filter(user => user.userId !== userId)
            const resultConvoUpdate = await model.conversation.update(conversation)
            if (resultConvoUpdate.modifiedCount === 0) throw new UserError('Error on conversation rights deletion')
        }).map(async conversation => {
            if (conversation.owner === userId) await model.conversation.deleteById(conversation._id.toString())
        })

        const result = await model.user.deleteUser(req.payload.data.userId)
        if (result.deletedCount !== 1) throw new UserError

        res.status(200).send({
            message: 'User deleted'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    listUser,
    searchUser,
    getUserById,
    deleteUser,
    createUser,
    logout,
    updateUser,
    updateUserPassword,
    updateUserPicture,
    recoveryAuth
}