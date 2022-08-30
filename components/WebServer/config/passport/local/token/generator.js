const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:tokenGenerator')


const jwt = require('jsonwebtoken')

const EXPIRATION_TIME_DAYS = 60
const TOKEN_DAYS_TIME = '7d'
const REFRESH_TOKEN_DAYS_TIME = '14d'

module.exports = function (tokenData) {
    const authSecret = tokenData.salt

    delete tokenData.salt

    return {
        _id: tokenData._id,
        token: generateJWT(tokenData, authSecret, EXPIRATION_TIME_DAYS)
    }
}

function generateJWT(data, authSecret, days = 1) {
    let auth_token = jwt.sign({
        data,
    }, authSecret + process.env.CM_JWT_SECRET, { algorithm: 'HS256', expiresIn: TOKEN_DAYS_TIME })

    return {
        auth_token: auth_token,
        refresh_token: jwt.sign({
            data,
        }, authSecret + process.env.CM_REFRESH_SECRET + process.env.CM_JWT_SECRET, { algorithm: 'HS256', expiresIn: REFRESH_TOKEN_DAYS_TIME }),
        session_id: data.sessionId
    }

}