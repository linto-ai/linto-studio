const model = require(`${process.cwd()}/models/mongodb/models/conversations`)

async function getAllConversations(req, res, next) {
    try {
        let convos = await model.getAllConvos()

        /* --- modif romlop --- */

        //res.json({status: convos})
        res.json(convos)

        /* --- END --- */

    } catch (error) {
        console.error(error)
    }

}

module.exports = {
    getAllConversations
}