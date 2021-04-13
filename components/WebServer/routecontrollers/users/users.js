const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const model = require(`${process.cwd()}/models/mongodb/models/users`)

const { UserEmailAlreadyUsed, UserParameterMissing, UserCreationError,
    UserLogoutError } = require(`${process.cwd()}/components/WebServer/error/exception/users`)


async function getUsers(req, res, next) {
    try {
        let lol = await model.getAllUsers()
        res.json({
            status: lol
        })
    } catch (error) {
        console.error(error)
    }
}

async function getUserbyId(req, res, next) {
    // get user id input then return user
    try {
        if (req.params.userid != "undefined") {
            const postUserId = req.params.userid
            let response = await model.getUserbyId(postUserId)
            if (response && response.length) {
                res.json({
                    status: response[0]
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

async function getUserByName(req, res, next) {
    // get user id input then return user
    try {
        const username = req.params.username
        let response = await model.getUserByName(username)
        res.json(response)
    } catch (error) {
        console.error(error)
        res.json({
            status: "error",
            msg: error
        })
    }
}

async function getUserByEmail(req, res, next) {
    try {
        const email = req.params.email
        let response = await model.getUserByEmail(email)
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
        const payload = req.body
        const email = payload.email
        if (!payload.email || !payload.firstname || !payload.lastname || !payload.password) next(new UserParameterMissing())

        //TODO: Manage file path

        const userEmail = await model.getUserByEmail(email)
        if (userEmail.length > 0) next(new UserEmailAlreadyUsed())
        else {
            debug('CREATE ON')
            const createUser = await model.createUser(payload)
            debug(createUser)
            if (createUser.status === 'success') {
                res.json({
                    status: 'success',
                    msg: 'User has been created'
                })
            } else next(new UserCreationError())
        }
    } catch (error) {
        next(error)
    }
}

async function deleteUser(req, res, next) {
    if (req.params.userid != "") {
        const postUserId = req.params.userid
        try {
            let response = await model.deleteUserbyId(postUserId)
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

async function addUserConvoAccess(req, res, next) {
    try {
        const payload = req.body
        const addConvo = await model.updateUserAccess(payload)
        if (addConvo === 'success') {
            res.json({
                status: 'success',
                msg: 'convo has been added to user'
            })
            //!! now need to add user to convo with rights??

        } else {
            res.json({
                status: "error",
                msg: error
            })
        }
    } catch (error) {
        res.json({
            status: "error",
            msg: error
        })
    }
}

/// WIP
async function removeUserConvoAccess(req, res, next) {
    try {
        const payload = req.body
        const removeConvo = await model.removeUserAccess(payload)
        if (removeConvo === 'success') {
            res.json({
                status: 'success',
                msg: 'convo has been added to user'
            })
            //!! now need to remove user from convo?

        } else {
            res.json({
                status: "error",
                msg: error
            })
        }
    } catch (error) {
        res.json({
            status: "error",
            msg: error
        })
    }
}

async function logout(req, res, next) {
    try {
        if(!req.payload.data && !req.payload.data.userId) next(next (new UserParameterMissing()))
        let userId = model.getObjectId(req.payload.data.userId)
        model.update({
            _id: userId,
            keyToken: ''
        }).then(user => {
            if (user) res.json({ status: 'success', msg: 'User has been disconnected' })
            else next (new UserLogoutError())
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers,
    getUserbyId,
    getUserByEmail,
    getUserByName,
    deleteUser,
    createUser,
    addUserConvoAccess,
    removeUserConvoAccess,
    logout
}