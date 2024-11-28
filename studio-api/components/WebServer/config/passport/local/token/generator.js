const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:tokenGenerator",
)

const jwt = require("jsonwebtoken")

const TOKEN_DAYS_TIME = "7d"
const REFRESH_TOKEN_DAYS_TIME = "14d"

module.exports = function (tokenData) {
  const authSecret = tokenData.salt
  delete tokenData.salt

  const token = generateJWT(tokenData, authSecret)

  return {
    user_id: token.user_id,
    auth_token: token.auth_token,
    refresh_token: token.refresh_token,
  }
}

function generateJWT(data, authSecret) {
  return {
    auth_token: jwt.sign(
      {
        data,
      },
      authSecret + process.env.CM_JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.TOKEN_DAYS_TIME || TOKEN_DAYS_TIME,
      },
    ),
    refresh_token: jwt.sign(
      {
        data,
      },
      authSecret + process.env.CM_REFRESH_SECRET + process.env.CM_JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn:
          process.env.REFRESH_TOKEN_DAYS_TIME || REFRESH_TOKEN_DAYS_TIME,
      },
    ),
    user_id: data.userId,
  }
}
