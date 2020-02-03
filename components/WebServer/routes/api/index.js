const debug = require('debug')('app:router:api')
const model = require(`${process.cwd()}/models`)

module.exports = (webserver) => {
    return [{
        path: '/conversations',
        method: 'get',
        requireAuth: false,
        controller: async (req, res, next) => {
            res.json({
                status: "success"
            })
        }
    }]
}