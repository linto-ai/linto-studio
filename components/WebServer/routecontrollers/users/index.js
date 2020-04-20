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
    // WIP -- ADD PASSWORD REQUIREMENTS 
    // WIP -- ADD name and email form requirements
    try {
        const payload = req.body
        const username = payload.userName
        const email = payload.email
        //const password = payload.password

        // check user parameters ==> should we use the getUserbyName controller function here instead?
        const getUserName = await model.getUserByName(username)
        if (getUserName.length > 0) {
            throw ({
                status: 'error',
                msg: 'User name already exists',
                code: 'UsernameAlreadyUsed'
            })
        } else {
            const getUserEmail = await model.getUserByEmail(email)
            if (getUserEmail.length > 0) {
                throw ({
                    status: 'error',
                    msg: 'Email address already exists',
                    code: 'EmailAlreadyUsed'
                })
            } else {
                const createUser = await model.createUser(payload)
                if (createUser === 'success') {
                    res.json({
                        status: 'success',
                        msg: 'User has been created'
                    })
                } else {
                    res.json({
                        status: "error",
                        msg: error
                    })
                }
            }
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

async function addUserConvoAccess(req, res, next) {
    try {
        const payload = req.body
        // const convoid = payload.convoId
        // const useradd = payload.userId
        // const rights = payload.rights
        //console.log(payload)
        console.log(payload)
        const addConvo = await model.updateUserConvo(payload)
        if (addConvo === 'success') {
            res.json({
                status: 'success',
                msg: 'convo has been added to user'
            })
        } else {
            res.json({
                status: "error",
                msg: error
            })
        }
    } catch(error) {
        res.json({
            status: "error",
            msg: error
        })
    }
}

/// WIP
async function removeUserConvoAccess(req, res, next) {
    try {

    } catch(error) {

    }
}

module.exports = {
    getUsers,
    getUserbyId,
    getUserByEmail,
    getUserByName,
    deleteUser,
    createUser, 
    addUserConvoAccess
}