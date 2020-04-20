const debug = require('debug')('app:webserver:middlewares')
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)

function isProduction() {
	return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
	debug(`[${Date.now()}] new user entry on ${req.url}`)
	next()
}

async function isOwner(req, res, next) {
    if (isProduction()) {
        if (req && req.session){
            const userid = req.session.userid
            console.log("userid", userid)
            try{
                const user = await userModel.getUserbyId(userid)
                console.log(user)
                //[0] //check user convo access
                const convos = user[0].convoAccess[req.body.convoId]
                console.log(convos)
                if (convos === 'owner') {
                    //Pass!
                    next()
                } else {
                    throw ({
                        status: 'error',
                        msg: 'User does not have right to add users',
                        code: 'NotConvoOwner'
                    }) 
                }
            } catch(error){
                res.json({
                    status: "error",
                    msg: error
                }) 
            }
        } else {
            res.redirect('/sessionNotFound')
        }
    } else {
        next()
    }
}

function checkAuth(req, res, next) {
	if (isProduction()) {
		// If not connected
		if (!!req && !!req.session) {res.json({
            status: "error",
            msg: error
        })
			if (!!req.session.logged) {
				if (req.session.logged == 'on' && req.url == '/login') {
					req.session.save((err) => {
						if (err && err != 'undefined') {
							console.error('Err:', err)
						}
					})
					res.redirect('/api')
				} else if (req.session.logged == 'on' && req.url != '/login') {
					//Pass !
                    next()
				} else if (req.session.logged != 'on' && req.url != '/login') {
					//Not logged, redirect to login page
					res.redirect('/login')
				}
			} else {
				if (req.url != '/login') {
					res.redirect('/login')
				} else {
					next()
				}
			}
		} else {
			res.redirect('/sessionNotFound')
		}
	} else {
		next()
	}
}

module.exports = {
	checkAuth,
    logger, 
    isOwner
}