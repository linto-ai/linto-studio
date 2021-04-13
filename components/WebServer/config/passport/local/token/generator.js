const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:tokenGenerator')


const jwt = require('jsonwebtoken')

const TOKEN_DAYS_TIME = 10
const REFRESH_TOKEN_DAYS_TIME = 20

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
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + days)

  let auth_token = jwt.sign({
    data,
    exp: parseInt(expirationDate.getTime() / 1000, TOKEN_DAYS_TIME),
  }, authSecret + process.env.LINTO_STACK_CM_JWT_SECRET)

  return {
    auth_token: auth_token,
    refresh_token: jwt.sign({
      data,
      exp: parseInt(expirationDate.getTime() / 1000, REFRESH_TOKEN_DAYS_TIME),
    }, authSecret + process.env.LINTO_STACK_CM_REFRESH_SECRET + process.env.LINTO_STACK_CM_JWT_SECRET),

    expiration_date: parseInt(expirationDate.getTime() / 1000, 10),
    session_id: data.sessionId
  }

}
