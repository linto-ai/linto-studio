const model = require(`${process.cwd()}/models/mongodb/models/users`)

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
        const postUserId = req.params.userid
        let response = await model.getUserbyId(postUserId)
        res.json({
            status: response[0]
        })
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
        const username = payload.username
        const email = payload.email
        const password = payload.password

        // check if user doesn't exist
        const getUserName = await model.getUserByName(username)
        if (getUserName.length > 0) {
            throw ({
                status: 'error',
                msg: 'User name is already used',
                code: 'UsernameAlreadyUsed'
            })
        }

        const getUserEmail = await model.getUserByEmail(email)
        if (getUserEmail.length > 0) {
            throw ({
                status: 'error',
                msg: 'Email address is already used',
                code: 'EmailAlreadyUsed'
            })
        }

        const createUser = await model.createUser({
            username,
            email,
            password
        })

        if (createUser === 'success') {
            res.json({
                status: 'success',
                msg: 'User has been created'
            })
        }
    } catch (error) {
        console.error(error)
        res.json(error)
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

module.exports = {
    getUsers,
    getUserbyId,
    getUserByEmail,
    getUserByName,
    deleteUser,
    createUser
}