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

const {
    NodemailerError
} = require(`${process.cwd()}/components/WebServer/error/exception/nodemailer`)

async function createUser(req, res, next) {
    try {
        const user = req.body
        let organizationName = req.body.organizationName

        if (!user.email || !user.firstname || !user.lastname || !user.password) throw new UserUnsupportedMediaType()

        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            user.img = await storeFile(req.files.file, 'picture')
        else user.img = defaultPicture()

        if (!organizationName) organizationName = user.email + '\'s Organization'

        if (((await model.user.getUserByEmail(user.email)).length) !== 0) throw new UserConflict()
        if (((await model.organization.getOrganizationByName(organizationName)).length) !== 0) throw new OrganizationConflict()

        const createdUser = await model.user.createUser(user)
        if (createdUser.insertedCount !== 1) throw new UserError()

        const createdOrganization = await model.organization.create(createdUser.insertedId.toString(), organizationName)
        if (createdOrganization.insertedCount !== 1) {
            model.user.deleteUser(createdUser.insertedId.toString())
            throw new UserError()
        }

        const magicId = createdUser.ops[0].authLink.magicId
        let mail_result = await Mailing.accountCreate(user.email, req, magicId)
        if(!mail_result) debug('Error when sending mail')
        // }
        res.status(201).send({
            message: 'Account created. An email has been sent to you. Please open it and click on the link to validate your email address.'
        })
    } catch (err) {
        next(err)
    }
}

async function listUser(req, res, next) {
    try {
        let userId = req.payload.data.userId
        let allUsers = await model.user.getAllUsers()
        let allOrganizations = await model.organization.getAllOrganizations()
        let publicUsers = []

        // Get all users with "public" personal organization
        allUsers.map(user => {
            let userOrga = allOrganizations.find(orga => orga.owner.toString() === user._id.toString() && orga.personal === true)
            if (userOrga.type === 'public') publicUsers.push(user)
        })

        // Get users in current user organizations
        let userOrganizations = allOrganizations.filter(orga => !orga.personal && (orga.owner === userId || orga.users.findIndex(usr => usr.userId === userId) >= 0))
        userOrganizations.map(uorga => {
            for (let user of uorga.users) {
                if (publicUsers.findIndex(usr => usr._id.toString() === user.userId.toString()) < 0) {
                    publicUsers.push(allUsers.find(auser => auser._id.toString() === user.userId.toString()))
                }
            }
        })

        res.status(200).send(publicUsers)
    } catch (err) {
        next(err)
    }
}


async function searchUser(req, res, next) {
    try {
        if (!req.body.search)
            throw new UserUnsupportedMediaType()

        let userId = req.payload.data.userId
        let userList = await model.user.getAllUsers()
        let allOrganizations = await model.organization.getAllOrganizations()
        let filterUser = []

        // Filter not searched user
        searchUser = userList.map(user => {
            const userField = [user.firstname, user.lastname, user.email,
            user.firstname + ' ' + user.lastname, user.lastname + ' ' + user.firstname]

            const fieldFind = userField
                .map(field => field.toLowerCase())
                .filter(field => field.indexOf(req.body.search.toLowerCase()) >= 0)

            if (fieldFind.length > 0) return user
        }).filter(user => user !== undefined)

        if (searchUser.length === 0) throw new UserNotFound()

        // Get users in user current related organizations
        let userOrganizations = allOrganizations.filter(orga => !orga.personal && (orga.owner === userId || orga.users.findIndex(usr => usr.userId === userId) >= 0))

        userOrganizations.map(uorga => {
            uorga.users.map(user => {
                searchUser = searchUser.filter(usr => {
                    if (usr._id.toString() === user.userId.toString()) {
                        filterUser.push(usr)
                        return false
                    }
                    return true
                })
            })
        })

        // Get all users with "public" personal organization
        searchUser.map(user => {
            let userOrga = allOrganizations.find(orga => orga.owner.toString() === user._id.toString() && orga.personal === true)
            if (userOrga?.type === 'public') {
                filterUser.push(user)
                return false
            }
        })

        res.status(200).send(filterUser)
    } catch (err) {
        next(err)
    }
}

async function getUserById(req, res, next) {
    try {
        const userList = await model.user.getUserById(req.params.userId)
        if (userList && userList.length !== 1) throw new UserNotFound()

        res.status(200).send({
            ...userList[0]
        })
    } catch (err) {
        next(err)
    }
}

async function updateUser(req, res, next) {
    try {
        if (!(req.body.email || req.body.firstname || req.body.lastname || req.body.accountNotifications || req.body.emailNotifications)) throw new UserUnsupportedMediaType()

        const myUser = await model.user.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw new UserNotFound()
        let user = myUser[0]
        const userMail = user.email

        if (req.body.email) user.email = req.body.email
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
        if ((await model.user.getUserByEmail(req.body.email)).length !== 0) throw new UserConflict()
        if ((await model.organization.getOrganizationByName(req.body.email)).length !== 0) throw new OrganizationConflict()
        let organization = (await model.organization.getOrganizationByName(userMail))[0]

        if (req.body.email && organization?.personal === true) {
            organization.name = req.body.email
            let res = await model.organization.update(organization)
        }

        const result = await model.user.update(user)
        if (result.matchedCount === 0) throw new UserError()
        let message

        (result.modifiedCount === 1) ? message = 'User updated' : message = 'No modification to user'
        res.status(200).send({
            message
        })
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

        const user = await model.user.getUserById(req.payload.data.userId)
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

        const myUser = await model.user.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw new UserNotFound()
        const payload = {
            ...myUser[0],
            newPassword: req.body.newPassword,
            accountNotifications: {
                updatePassword: false,
                inviteAccount: false
            }
        }

        req.body.email = myUser[0].email
        req.body.password = req.body.newPassword

        const result = await model.user.updatePassword(payload)
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
        let userId = model.user.getObjectId(req.payload.data.userId)

        model.user.update({
            _id: userId,
            keyToken: ''
        }).then(user => {
            if (user)
                res.status(200).send({
                    message: 'User has been disconnected'
                })
            else throw new UserError()
        })
    } catch (err) {
        next(err)
    }
}

async function deleteUser(req, res, next) {
    try {
        const userId = req.payload.data.userId

        // Remove user from organizations
        const organizations = await model.organization.getAllOrganizations()
        organizations.filter(organization => {
            if (organization.owner !== userId && organization.personal === true) return false
            else if (organization.owner === userId && organization.users.length === 0) return true
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

async function recoverPassword(req, res, next) {
    try {
        if (!req.body.email) throw new UserUnsupportedMediaType()
        const user = await model.user.getUserByEmail(req.body.email)
        if (user.length === 1) {
            const reqOrigin = req.headers.origin
            const generateMagicId = await model.user.setUserMagicLink(req.body.email)
            if (generateMagicId.modifiedCount === 0) throw new GenerateMagicLinkError()
            const user = await model.user.getUserByEmail(req.body.email)
            let sendmail = await sendMail({
                email: req.body.email,
                subject: 'Lien de connexion unique',
                magicId: user[0].authLink.magicId,
                type: "send_reset_link",
                reqOrigin
            })
            if (sendmail === 'mailSend') {
                res.status(200).send({
                    status: 'success',
                    message: 'An email with an authentication link has been sent to you.'
                })
            } else throw new NodemailerError()

            const updateNotif = await model.user.update({ _id: user[0]._id, accountNotifications: { ...user[0].accountNotifications, updatePassword: true } }) // update account notifications
            if (updateNotif.matchedCount === 0) throw new UserError()

        }
        else {
            // if user is not found, fake a success to secure database informations
            debug(`Forgotten password request for an unknown or invalid email address: "${req.body.email}"`)
            res.status(200).send({
                status: 'success',
                message: 'An email with an authentication link has been sent to you.'
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
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
    recoverPassword
}