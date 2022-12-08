const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const { sendMail } = require(`${process.cwd()}/lib/nodemailer`)
const { storeFile, defaultPicture, deleteFile, getStorageFolder } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
    OrganizationConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const {
    UserConflict,
    UserError,
    UserNotFound,
    UserUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function listUser(req, res, next) {
    try {
        let userId = req.payload.data.userId
        let allUsers = await userModel.getAllUsers()
        let allOrganizations = await organizationModel.getAllOrganizations()
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
        let userId = req.payload.data.userId
        let userList = await userModel.getAllUsers()
        let allOrganizations = await organizationModel.getAllOrganizations()
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
        const userList = await userModel.getUserById(req.params.userId)
        if (userList && userList.length !== 1) throw new UserNotFound()

        res.status(200).send({
            ...userList[0]
        })
    } catch (err) {
        next(err)
    }
}

async function createUser(req, res, next) {
    try {
        const user = req.body
        if (!user.email || !user.firstname || !user.lastname || !user.password) throw new UserUnsupportedMediaType()

        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            user.img = await storeFile(req.files.file, 'picture')
        else user.img = defaultPicture()

        const isUserFound = await userModel.getUserByEmail(user.email)
        if (isUserFound.length !== 0) throw new UserConflict()

        const isOrganizationFound = await organizationModel.getOrganizationByName(user.email)
        if (isOrganizationFound.length !== 0) throw new OrganizationConflict()

        const createdUser = await userModel.createUser(user)
        if (createdUser.insertedCount !== 1) throw new UserError()
        const createdOrganization = await organizationModel.createDefaultOrganization(createdUser.insertedId.toString(), user.email)

        if (createdOrganization.insertedCount !== 1) {
            userModel.deleteById(createdUser.insertedId.toString())
            throw new UserError()
        }

        res.status(201).send({
            message: 'User account created'
        })
    } catch (err) {
        next(err)

    }
}

async function updateUser(req, res, next) {
    try {
        if (!(req.body.email || req.body.firstname || req.body.lastname)) throw new UserUnsupportedMediaType()

        const myUser = await userModel.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw new UserNotFound()
        let user = myUser[0]
        const userMail = user.email

        if (req.body.email) user.email = req.body.email
        if (req.body.firstname) user.firstname = req.body.firstname
        if (req.body.lastname) user.lastname = req.body.lastname

        if ((await userModel.getUserByEmail(req.body.email)).length !== 0) throw new UserConflict()
        if ((await organizationModel.getOrganizationByName(req.body.email)).length !== 0) throw new OrganizationConflict()
        let organization = (await organizationModel.getOrganizationByName(userMail))[0]

        if (req.body.email && organization?.personal === true) {
            organization.name = req.body.email
            let res = await organizationModel.update(organization)
        }

        const result = await userModel.update(user)
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

        const user = await userModel.getUserById(req.payload.data.userId)
        if (user.length !== 1) throw new UserNotFound()

        const result = await userModel.update(payload)
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

        const myUser = await userModel.getUserById(req.payload.data.userId)
        if (myUser.length !== 1) throw new UserNotFound()
        const payload = {
            ...myUser[0],
            newPassword: req.body.newPassword
        }

        req.body.email = myUser[0].email
        req.body.password = req.body.newPassword

        const result = await userModel.updatePassword(payload)
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
        let userId = userModel.getObjectId(req.payload.data.userId)

        userModel.update({
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
        const organizations = await organizationModel.getAllOrganizations()
        organizations.filter(organization => {
            if (organization.owner !== userId && organization.personal === true) return false
            else if (organization.owner === userId && organization.users.length === 0) return true
            else if ((organization.users.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async (organization) => {
            if (organization.owner === userId && organization.users.length === 1) {
                let resultOperation = await organizationModel.deleteById(organization._id.toString())
                if (resultOperation.deletedCount !== 1) throw new UserError('Error on personal organization')
            } else {
                organization.users = organization.users.filter(user => user.userId !== userId)
                let resultOperation = await organizationModel.update(organization)
                if (resultOperation.modifiedCount === 0) throw new UserError('Error on organization rights deletion')
            }
        })

        // Delete conversation if owner and remove user from shared with
        const conversations = await conversationModel.getAllConvos()
        conversations.filter(conversation => {
            if ((conversation.sharedWithUsers.filter(user => user.userId === userId)).length !== 0) return true
        }).map(async conversation => {
            conversation.sharedWithUsers = conversation.sharedWithUsers.filter(user => user.userId !== userId)
            const resultConvoUpdate = await conversationModel.update(conversation)
            if (resultConvoUpdate.modifiedCount === 0) throw new UserError('Error on conversation rights deletion')
        }).map(async conversation => {
            if (conversation.owner === userId) await conversationModel.deleteById(conversation._id.toString())
        })

        const result = await userModel.deleteUser(req.payload.data.userId)
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
    const isUserFound = await userModel.getUserByEmail(req.body.email)
    if(isUserFound.length === 0) throw new UserError('Email address was not found, please create an account')

    const generateResetId = await userModel.setUserResetLink(req.body.email)
    if(generateResetId.modifiedCount === 0) throw ('Error on generating reset link')

    const user = await userModel.getUserByEmail(req.body.email)
    
    if(user.length > 0) {
      let sendmail = await sendMail({
        email: req.body.email,
        resetId: user[0].resetId,
        type:"send_reset_link",
        subject: "Demande de mot de passe"
      })  
      if(sendmail === 'mailSend') {
        res.status(200).send({
          status: 'success',
          message: 'Une email avec un lien de connexion vien de vous être envoyé'
        })
      } else throw sendmail
    } else throw new UserNotFound()
  } catch (error) {
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