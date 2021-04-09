/*
 * Copyright (c) 2018 Linagora.
 *
 * This file is part of Business-Logic-Server
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const AuthsException = require('./exception/auth')
let customException = ['UnauthorizedError'] // Default JWT exception

let initByAuthType = function (webserver) {
  Object.keys(AuthsException).forEach(key => customException.push(key))
  webserver.express.use(function (err, req, res, next) {
    if (customException.indexOf(err.name) > -1) {
      res.status(err.status).send({ message: err.message })
      console.error(err)
      return
    }
    next()
  })
}

module.exports = {
  initByAuthType
}