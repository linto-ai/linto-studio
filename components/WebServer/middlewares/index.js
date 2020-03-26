const debug = require('debug')('app:webserver:middlewares')

function isProduction() {
	return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
	debug(`[${Date.now()}] new user entry on ${req.url}`)
	next()
}

function checkAuth(req, res, next) {
	if (isProduction()) {
		// If not connected
		if (!!req && !!req.session) {
			if (!!req.session.logged) {
				if (req.session.logged == 'on' && req.url == '/login') {
					req.session.save((err) => {
						if (err && err != 'undefined') {
							console.error('Err:', err)
						}
					})
					res.redirect('/')
				} else if (req.session.logged == 'on' && req.url != '/login') {
					//Pass !
                    //next()
                    res.redirect('/api')
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
	logger
}