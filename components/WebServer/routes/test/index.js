const debug = require('debug')('app:router:test')

module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: false,
        controller: async (req, res, next) => {
            res.json({
                status: "success"
            })
        }
    }]
}