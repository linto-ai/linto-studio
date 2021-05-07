const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:user')
const model = require(`${process.cwd()}/models/mongodb/models/users`)

const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/file`)
const {
    UserEmailAlreadyUsed,
    UserParameterMissing,
    UserCreationError,
    UserLogoutError
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function getUsers(req, res, next) {
    try {
        let users = await model.getAllUsers()
        res.json(users)
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
        const payload = JSON.parse(req.body.payload)
        if (!payload.email || !payload.firstname || !payload.lastname || !payload.password) throw (new UserParameterMissing())

        const email = payload.email
        if (req.files && Object.keys(req.files).length !== 0 && req.files.file)
            payload.img = await StoreFile.storeFile(req.files.file, 'picture')
        else payload.img = StoreFile.defaultPicture()

        const userEmail = await model.getUserByEmail(email)
        if (userEmail.length > 0) throw (new UserEmailAlreadyUsed())
        else {
            const createUser = await model.createUser(payload)
            if (createUser.status === 'success') {
                res.json({
                    status: 'success',
                    msg: 'Your account has been created'
                })
            } else throw (new UserCreationError())
        }
    } catch (error) {
        res.json({ error })
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

async function logout(req, res, next) {
    try {
        if (!!req.session.userId) {
            let userId = req.session.userId
            model.update({
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
    getUserbyId,
    getUserByEmail,
    deleteUser,
    createUser,
    logout
}