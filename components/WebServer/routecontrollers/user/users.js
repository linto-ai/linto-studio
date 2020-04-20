const model = require(`${process.cwd()}/models/mongodb/models/users`)

async function getUsers(req, res, next) {
    try {
        let lol = await model.getAllUsers()
        res.json({
            status: lol
        })
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    getUsers
}