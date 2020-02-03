const debug = require('debug')('app:router:login')
const model = require(`${process.cwd()}/models`)


module.exports = (webServer) => {
	return [{
			path: '/',
			method: 'get',
			requireAuth: false,
			controller: async (req, res, next) => {
				try {
					const getUsers = await model.getUsers()
					// Check if an user exist
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
		{
			path: '/',
			method: 'post',
			controller: async (req, res, next) => {
				if (req.body.userName != "undefined" && req.body.password != "undefined") { // get post datas
					const postUserName = req.body.username
					const postPassword = req.body.password
					try {
						let user = await model.getUserByName(postUserName)
						if (!user) { // User not found
							throw 'User not found'
						} else { // User found
							// Compare password with database
							// Shall be like sha1(password + salt) == userPswdHash
							if (postPassword == user.password) {
								req.session.logged = 'on'
								req.session.user = postUserName
								req.session.save((err) => {
									if (err) {
										throw "Error on saving session"
									} else {
										//Valid password
										res.json({
											"status": "success",
											"msg": "valid"
										})
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
							msg: error
						})
					}
				} else {
					res.json({
						status: "error",
						msg: "An error has occured whent trying to connect to database"
					})
				}
			}
		}
	]
}