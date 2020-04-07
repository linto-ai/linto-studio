const debug = require('debug')('app:router:api')
//const controller = require(path.join(__dirname, "../controllers/users"))
//const model = require(`${process.cwd()}/models/mongodb/models/users`)

const {getUsers, getUserbyId} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)
//const {getUsers} = require(path.join(__dirname, "../routecontrollers"))


module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: async (req, res, next) => {
            console.log("butt")
            let lol = "butt"
            // let lol = await model.getUserbyId('5e7c69270eb41d18682c9853')
            // let lol = await model.createUser({
            //     name : 'user', 
            //     email: 'user@kate.com',
            //     password: 'pw'
            // })
            // let lol = await model.updateUserConvo({
            //     _id : '5e81db5fe5cc5f436eea8673', 
            //     convoAccess: ['001']
            // })
            // let lol = await model.removeUserAccess({
            //     _id: '5e7c8693ed87be31464cda9c', 
            //     convoAccess: ['monday_meeting']
            // })
            //let lol = await model.getAllUserIds()
            // let lol = await model.deleteUserbyId('5e7c69270eb41d18682c9853')
            res.json({
                status: lol
            })
        }
    }, 
    {
        path: '/users',
        method: 'get', 
        requireAuth: false, 
        controller: getUsers
    }, 
    {
        path: '/userid', 
        method: 'get', 
        requireAuth: false, 
        controller: async(req, res, next) => {
            res.send('<html><body><form action="" method="POST"><input type="text" \
                name="userid" placeholder="user id"><button type="submit">send</button></form></body></html>')
        }

    },
    {
        path: '/userid', 
        method: 'post', 
        requireAuth: false, 
        controller: getUserbyId
    }]
}