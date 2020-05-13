const model = require(`${process.cwd()}/models/mongodb/models/users`)
const sha1 = require('sha1')
const jwt = require('jsonwebtoken')

async function userLogin (req, res, next ){
    try {
        if (req.body.userName != "undefined" && req.body.password != "undefined") { 
            const postUserName = req.body.userName
            const postPassword = req.body.password
            try {
                let user = await model.getUserLoginInfo(postUserName)
                user = user[0] // is there a better way to take the first element?
                if (!user) { // User not found
                    res.json({msg: "please check username"})
                } else { // User found
                    // Compare password with database
                    pswdHash = sha1(postPassword + user.salt)
                    if (pswdHash == user.passwordHash) {
                        // req.session.logged = 'on'
                        // req.session.user = postUserName
                        // req.session.userid = user._id
                        // req.session.save((err) => {
                        //     if (err) {
                        //         throw "Error on saving session"
                        //     } else {
                        //Valid password
                        //create jwt
                        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: 180})
                        console.log(token)
                        res.json({
                            msg: "valid login/authentication done", 
                            token: token
                        })
                    } else {
                        // Invalid password
                        res.json({msg: "please check your password"})
                    }
                }
            } catch (error) {
                res.json({
                    status: "error",
                    msg: "couldn't validate user",
                })
            }
        } else {
            res.status(400) // bad request
        }
    } catch (error) {
        console.error(error)
        res.json({
            status: "error",
            msg: error
        })
    }
}

module.exports = {
    userLogin
}