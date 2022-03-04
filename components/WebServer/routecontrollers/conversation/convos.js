const model = require(`${process.cwd()}/lib/mongodb/models/conversations`)

async function getAllConversations(req, res, next) {
    try {
        let convos = await model.getAllConvos()
        res.json(convos)
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on getting speakers'
        })
    }
}

module.exports = {
    getAllConversations
}