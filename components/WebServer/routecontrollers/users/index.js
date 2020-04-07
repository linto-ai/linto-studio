const model = require(`${process.cwd()}/models/mongodb/models/users`)


async function getUsers(req, res, next){
    try{
        let lol = await model.getAllUsers()
        res.json({
            status: lol
        })
    } catch(error) {
        console.error(error)
    }
    
}

async function getUserbyId(req, res, next){
    // get user id input then return user
    if (req.params.userid != "") {
        const postUserId = req.params.userid
        try{
            let response = await model.getUserbyId(postUserId)
            res.json({
                status: response[0]
            })

        } catch(error) {
            res.json({
            	status: "error",
                msg: error
            })
        }
    } else {
        console.log("empty string")
        // res.json({
        //     status: "error",
        //     msg: "user id undefined"
        // })
    }
}

async function createUser(req, res, next){
    const userObj = {}
    if (req.body.userName != "undefined" && req.body.email != "undefined" && req.body.password != "undefined") {
        userObj.name = req.body.userName
        userObj.email = req.body.email
        userObj.password = req.body.password
        if (req.params.convoAccess != "") {
            userObj.accessArray = req.body.convoAccess
            console.log("array ", req.body.convoAccess)
        } else {
            userObj.accessArray = []
        }
        try {
            let response = await model.createUser(userObj)
            res.json({
                status: response
            })

        } catch(error) {
            res.json({
                status: "error", 
                msg: error
            })
        }
    } else {
        console.log("missing user information")
    }
}

async function deleteUser(req, res, next){
    if (req.params.userid != "") {
        const postUserId = req.params.userid
        try{
            let response = await model.deleteUserbyId(postUserId)
            res.json({
                status: response
            })
        } catch(error) {
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
    deleteUser, 
    createUser
}
