const model = require(`${process.cwd()}/models/mongodb/models/conversations`)

async function getAllConversations(req, res, next) {
    try {
        let convos = await model.getAllConvos()
        res.json({
            status: convos
        })
    } catch (error) {
        console.error(error)
    }

}

module.exports = {
    getAllConversations
}