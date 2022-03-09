const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)


const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)
const {
    UserEmailAlreadyUsed,
    UserParameterMissing,
    UserCreationError,
    UserLogoutError
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function getUsers(req, res, next) {
    try {
        let users = await userModel.getAllUsers()
        res.json(users)
    } catch (error) {
        console.error(error)
    }
}

async function getUserById(req, res, next) {
    // get user id input then return user
    try {
        if (req.params.userid != "undefined") {
            const postUserId = req.params.userid
            let response = await userModel.getUserById(postUserId)
            if (response && response.length) {
                res.json({
                    ...response[0]
                })
            } else {
                res.json({
                    msg: "user id doesn't exist"
                })
            }
        } else {
            res.status(400) // bad request
        }
    } catch (error) {
        res.json({
            status: "error",
            msg: error
        })
    }
}


async function getUserByEmail(req, res, next) {
    try {
        const email = req.params.email
        let response = await userModel.getUserByEmail(email)
        res.json(response)
    } catch (error) {
        console.error(error)
        res.json({
            status: "error",
            msg: error
        })
    }
}

async function createUser(req, res, next) {
    try {
        const user = req.body
        if (!user.email || !user.firstname || !user.lastname || !user.password) throw (new UserParameterMissing())

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

async function updateUserPicture(req, res, next) {
    try {
        if (req.files && Object.keys(req.files).length !== 0 && req.files.file) {
            let userId = req.params.userid
            let img = await StoreFile.storeFile(req.files.file, 'picture')
            let payload = {
                _id: userId,
                img
            }
            let getUser = await userModel.getUserById(userId)
            if (getUser.length > 0) {
                let updateUserPswd = await userModel.update(payload)
                if (updateUserPswd === 'success') {
                    res.json({
                        status: 'success',
                        msg: 'User information have been updated'
                    })
                } else {
                    throw updateUserPswd
                }
            } else {
                throw 'User not found'
            }
        } else  {
            throw 'No file found'
        }
    } catch (error) {
        res.json({ error })
    }
}

async function deleteUser(req, res, next) {
    if (req.params.userid != "") {
        const postUserId = req.params.userid
        try {
            let response = await userModel.deleteUserbyId(postUserId)
            res.json({
                status: response
            })
        } catch (error) {
            res.json({
                status: "error",
                msg: error
            })
        }
    } else {
        console.log("empty string")
    }
}

async function updateUserInfos(req, res, next) {
    try {
        if (!req.body.payload || Object.keys(req.body.payload).length === 0) {
            throw 'Missing required informations'
        } else {
            let userId = req.params.userid
            let payload = req.body.payload
            payload._id = userId
            let getUser = await userModel.getUserById(userId)
            if (getUser.length > 0) {
                let updateUser = await userModel.update(payload)
                if (updateUser === 'success') {
                    res.json({
                        status: 'success',
                        msg: 'User information have been updated'
                    })
                } else {
                    throw updateUser
                }
            } else {
                throw 'User not found'
            }
        }
    } catch (error) {
        console.error(error)
        res.json({ error })
    }
}

async function updateUserPassword(req, res, next) {
    try {
        if (!req.body.newPassword || Object.keys(req.body).length === 0) {
            throw 'Missing required informations'
        } else {
            let userId = req.params.userid
            let payload = {
                newPswd: req.body.newPassword,
                _id: userId
            }
            let getUser = await userModel.getUserById(userId)
            if (getUser.length > 0) {
                let updateUserPswd = await userModel.updatePassword(payload)
                if (updateUserPswd === 'success') {
                    res.json({
                        status: 'success',
                        msg: 'User information have been updated'
                    })
                } else {
                    throw updateUserPswd
                }
            } else {
                throw 'User not found'
            }
        }
    } catch (error) {
        console.error(error)
        res.json({ error })
    }
}

async function logout(req, res, next) {
    try {
        if (!!req.session.userId) {
            let userId = req.session.userId
            userModel.update({
                _id: userId,
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

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    createUser,
    logout,
    updateUserInfos,
    updateUserPassword,
    updateUserPicture
}