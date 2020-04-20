const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)


// create a conversation base after checking user id etc.
async function createConvoBase(req, res, next) {
    try{
        if (req.session.userid != undefined){
            const payload = req.body
            // const name = payload.name
            payload.ownerId = req.session.userid
            const createBase = await convoModel.createConvoBase(payload)
            if (createBase != undefined) {
                res.json({
                    status: 'success',
                    msg: 'convo has been created'
                })
                //update the user as the convo owner w createBase convo id
                newPayload = {
                    userId: req.session.userid, 
                    convoId: createBase,
                    userRights: 'owner'
                }
                const userUpdate = await userModel.updateUserConvo(newPayload)
                if (userUpdate != undefined) {
                    console.log({
                        status: 'success', 
                        msg: 'convo added to user'
                    })
                } else {
                    throw ({
                        status: 'error',
                        msg: 'convo not added to user',
                    })
                }
            } else {
                res.json({
                    status: 'error',
                    msg: 'error'
                })
            }
        } else {
            throw ({
                status: 'error',
                msg: 'user needs to login',
                code: 'notLoggedIn'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createConvoBase
}