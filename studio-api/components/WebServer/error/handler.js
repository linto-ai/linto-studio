const debug = require('debug')('linto:conversation-manager:components:WebServer:error:handler')
const fs = require('fs');

const JWT_DEFAULT_EXCEPTION = 'UnauthorizedError' // Default JWT exception
const EXCEPTION_FOLDER = `${process.cwd()}/components/WebServer/error/exception/`

let init = function (webserver) {
    //Handle controller exception has API output
    let customException = [JWT_DEFAULT_EXCEPTION]

    fs.readdirSync(EXCEPTION_FOLDER).forEach(file => {
        const Exception = require(`${EXCEPTION_FOLDER}${file}`)
        Object.keys(Exception).forEach(key => customException.push(key))
    })

    webserver.express.use(function (err, req, res, next) {
        if (err) debug(err)
        if (customException.indexOf(err.name) > -1) {
            if (err.err) debug(err.err)
            const status = parseInt(err.status)
            if (isNaN(status)) {
                res.status(500).send({ message: err.message })
            } else {
                res.status(status).send({ message: err.message })
            }
            return
        } else if (err) { // Handle unsupported exception
            res.status(500).send({ message: err.message })
            return
        }

        next()
    })

}

module.exports = {
    init
}