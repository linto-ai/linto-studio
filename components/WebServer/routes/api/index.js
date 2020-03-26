const debug = require('debug')('app:router:api')
const model = require(`${process.cwd()}/models/mongodb/models/users`)


module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: async (req, res, next) => {
            console.log("butt")
            // let lol = await model.getUserbyId('5e7c69270eb41d18682c9853')
            // let lol = await model.createUser({
            //     name : 'pootietang', 
            //     email: 'pt@kate.com',
            //     password: 'wa_da_tah'
            // })
            // let lol = await model.updateUserConvo({
            //     _id : '5e7c76022e7294231f8ab53a', 
            //     convoAccess: ['brainstorm5', 'monday_meeting']
            // })
            // let lol = await model.removeUserAccess({
            //     _id: '5e7c8693ed87be31464cda9c', 
            //     convoAccess: ['monday_meeting']
            // })
            let lol = await model.getAllUserIds()
            // let lol = await model.deleteUserbyId('5e7c69270eb41d18682c9853')
            res.json({
                status: lol,
            })
        }
    }]
}