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

module.exports = {
    logger, 
    isOwner
}