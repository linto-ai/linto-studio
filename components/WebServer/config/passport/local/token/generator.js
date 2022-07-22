const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:tokenGenerator')


const jwt = require('jsonwebtoken')

const TOKEN_DAYS_TIME = '7d'
const REFRESH_TOKEN_DAYS_TIME = '14d'

module.exports = function (tokenData) {
    let expiration_time_days = 60
    const authSecret = tokenData.salt

    delete tokenData.salt

    return {
        _id: tokenData._id,
        token: generateJWT(tokenData, authSecret, expiration_time_days)
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