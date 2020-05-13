const debug = require('debug')('app:webserver:middlewares')
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const jwt = require('jsonwebtoken')

function isProduction() {
	return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
	debug(`[${Date.now()}] new user entry on ${req.url}`)
	next()
}

async function isOwner(req, res, next) {
    // isOwner will alway require ownerid as input 
    // (rather than getting it from session)
    if (isProduction()) {
        if (req && req.session){
            const userid = req.session.userid
            try{
                const user = await userModel.getUserbyId(userid)
                const convos = user[0].convoAccess[req.body.convoId]
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
    if (req.header['Authorization'] != "undefined") {
        if (isProduction()){
            //var token = req.headers['Authorization']
            const token = req.header('Authorization').replace('Bearer ', '')
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return res.json({msg: "invalid token"})
                    } else {
                        req.decoded = decoded, 
                        next()
                    }
                })
            } else {
                res.send({
                    msg: "No token provided"
                })
            }
        } else {
            next()
        }
    } else {
        res.status(400) // bad request
    }  
}

// function checkAuth(req, res, next) {
// 	if (isProduction()) {
// 		// If not connected
// 		if (!!req && !!req.session) {res.json({
//             status: "error",
//             msg: error
//         })
// 			if (!!req.session.logged) {
// 				if (req.session.logged == 'on' && req.url == '/login') {
// 					req.session.save((err) => {
// 						if (err && err != 'undefined') {
// 							console.error('Err:', err)
// 						}
// 					})
// 					res.redirect('/api')
// 				} else if (req.session.logged == 'on' && req.url != '/login') {
// 					//Pass !
//                     next()
// 				} else if (req.session.logged != 'on' && req.url != '/login') {
// 					//Not logged, redirect to login page
// 					res.redirect('/login')
// 				}
// 			} else {
// 				if (req.url != '/login') {
// 					res.redirect('/login')
// 				} else {
// 					next()
// 				}
// 			}
// 		} else {
// 			res.redirect('/sessionNotFound')
// 		}
// 	} else {
// 		next()
// 	}
// }

module.exports = {
	checkAuth,
    logger, 
    isOwner
}