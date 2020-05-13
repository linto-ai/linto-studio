const debug = require('debug')('app:router:login')
const model = require(`${process.cwd()}/models/mongodb/models/users`)
const {userLogin} = require(`${process.cwd()}/components/WebServer/routecontrollers/login/index.js`)
    // const {
    // 	test,
    // 	checkauth
    // } = require(`${process.cwd()}/routecontrollers/login/index.js`)


module.exports = webServer => {
    return [{
            path: '/',
            method: 'post', 
            requireAuth: false, 
            controller: userLogin
        },
        {
            path: '/',
            method: 'get',
            requireAuth: false,
            controller: async(req, res, next) => {
                try {
                    res.sendFile(process.cwd() + '/components/WebServer/public/login.html') // until implemented :)

                } catch (err) {
                    console.error(err)
                }
            }
        }]
        // {
        //     path: '/createaccount',
        //     method: 'get',
        //     requireAuth: false,
        //     controller: async(req, res, next) => {
        //         try {
        //             res.sendFile(process.cwd() + '/components/WebServer/public/create-account.html') // until implemented :)
        //         } catch (err) {
        //             console.error(err)
        //         }
        //     }
        // },
        // {
        //     path: '/createaccount',
        //     method: 'post',
        //     requireAuth: false,
        //     controller: async(req, res, next) => {
        //         try {
        //             const payload = req.body

        //             const username = payload.username
        //             const email = payload.email
        //             const password = payload.password
        //             const confirmpassword = payload.confirmpassword

        //             // check if user doesn't exist
        //             const getUser = await model.getUserByName(username)

        //             if (getUser.length > 0) { // If username already exists
        //                 throw 'This user name already exists'
        //             }

        //             res.json({
        //                 status: 'success',
        //                 msg: 'success...'
        //             })

        //         } catch (err) {
        //             console.error(err)
        //             res.json({
        //                 status: 'error',
        //                 msg: error
        //             })
        //         }
        //     }
        // },
    //     {
    //         path: '/',
    //         method: 'post',
    //         controller: async(req, res, next) => {
    //             if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
    //                 const postUserName = req.body.userName
    //                 const postPassword = req.body.password
    //                 try {
    //                     let user = await model.getUserLoginInfo(postUserName)
    //                     user = user[0] // is there a better way to take the first element?
    //                     if (!user) { // User not found
    //                         throw 'User not found'
    //                     } else { // User found
    //                         // Compare password with database
    //                         // Shall be like sha1(password + salt) == userPswdHash
    //                         pswdHash = sha1(postPassword + user.salt)
    //                         if (pswdHash == user.passwordHash) {
    //                             req.session.logged = 'on'
    //                             req.session.user = postUserName
    //                             req.session.save((err) => {
    //                                 if (err) {
    //                                     throw "Error on saving session"
    //                                 } else {
    //                                     //Valid password
    //                                     res.json({
    //                                     	"status": "success",
    //                                     	"msg": "valid login"
    //                                     })
    //                                     //res.redirect('/api')
    //                                 }
    //                             })
    //                         } else {
    //                             // Invalid password
    //                             throw "Invalid password"
    //                         }
    //                     }
    //                 } catch (error) {
    //                     res.json({
    //                     	status: "error",
    //                         msg: error,
    //                     })
    //                     //res.sendFile(process.cwd() + '/components/WebServer/public/login.html')
    //                 }
    //             } else {
    //                 res.json({
    //                     status: "error",
    //                     msg: "An error has occured when trying to connect to database"
    //                 })
    //             }
    //         }
    //     }
    // ]
}