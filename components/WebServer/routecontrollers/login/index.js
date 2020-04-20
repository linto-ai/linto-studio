const model = require(`${process.cwd()}/models/mongodb/models/users`)
const sha1 = require('sha1')


async function userLogin (req, res, next ){
    try {
        if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
            const postUserName = req.body.userName
            const postPassword = req.body.password
            try {
                let user = await model.getUserLoginInfo(postUserName)
                user = user[0] // is there a better way to take the first element?
                if (!user) { // User not found
                    throw 'User not found'
                } else { // User found
                    // Compare password with database
                    // Shall be like sha1(password + salt) == userPswdHash
                    pswdHash = sha1(postPassword + user.salt)
                    if (pswdHash == user.passwordHash) {
                        req.session.logged = 'on'
                        req.session.user = postUserName
                        req.session.userid = user._id
                        req.session.save((err) => {
                            if (err) {
                                throw "Error on saving session"
                            } else {
                                //Valid password
                                res.json({
                                    "status": "success",
                                    "msg": "valid login"
                                })
                                //res.redirect('/api')
                            }
                        })
                    } else {
                        // Invalid password
                        throw "Invalid password"
                    }
                }
            } catch (error) {
                res.json({
                    status: "error",
                    msg: error,
                })
                //res.sendFile(process.cwd() + '/components/WebServer/public/login.html')
            }
        } else {
            res.json({
                status: "error",
                msg: "An error has occured when trying to connect to database"
            })
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