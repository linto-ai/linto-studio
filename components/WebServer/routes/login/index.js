const debug = require('debug')('app:router:login')
const model = require(`${process.cwd()}/models/mongodb/models/users`)
const sha1 = require('sha1')
// const {
// 	test,
// 	checkauth
// } = require(`${process.cwd()}/routecontrollers/login/index.js`)


module.exports = webServer => {
	return [{
			path: '/',
			method: 'get',
			requireAuth: true,
			controller: async (req, res, next) => {
				try {
					const getUsers = await model.getAllUserIds()
					// Check if users
					if (!!getUsers && getUsers.length > 0) {
						res.setHeader("Content-Type", "text/html")
						res.sendFile(process.cwd() + '/components/WebServer/public/login.html')
					} else {
						// If no user exist > redirect /setup first user page
                        // like : res.redirect('/setup')
						res.sendFile(process.cwd() + '/components/WebServer/public/login.html') // until implemented :)
					}
				} catch (err) {
					console.error(err)
				}
			}
		},
		// {
		// 	path: '/test',
		// 	method: 'get',
		// 	requireAuth: true,
		// 	controller: [checkauth, test]
		// },
		{
			path: '/',
			method: 'post',
			controller: async (req, res, next) => {
				if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
					const postUserName = req.body.username
					const postPassword = req.body.password
					try {
                        let user = await model.getUserByName(postUserName)
                        user = user[0] // is there a better way to take the first element?
						if (!user) { // User not found
							throw 'User not found'
						} else { // User found
							// Compare password with database
                            // Shall be like sha1(password + salt) == userPswdHash
                            pswdHash = sha1(postPassword + user.salt)
							if (pswdHash == user.pswdHash) {
								req.session.logged = 'on'
								req.session.user = postUserName
								req.session.save((err) => {
									if (err) {
										throw "Error on saving session"
									} else {
										//Valid password
										// res.json({
										// 	"status": "success",
										// 	"msg": "valid"
                                        // })
                                        res.redirect('/api')
									}
                                })
							} else {
								// Invalid password
								throw "Invalid password"
							}
						}
					} catch (error) {
						// res.json({
						// 	status: "error",
                        //     msg: error,
                        // })
                        res.sendFile(process.cwd() + '/components/WebServer/public/login.html') 
					}
				} else {
					res.json({
						status: "error",
						msg: "An error has occured when trying to connect to database"
					})
				}
			}
		}
	]
}