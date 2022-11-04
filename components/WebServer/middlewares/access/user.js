const debug = require('debug')('linto:conversation-manager:components:webserver:middlewares:access:users')

const OrganizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const UserModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const {
  UserForbidden,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

module.exports = {
  isVisibility: (req, res, next) => { //.owner
    if (req.payload.data.userId === req.params.userId) next()
    else {
      OrganizationModel.getPersonalOrganization(req.params.userId).then(async orga => {
        if (orga[0].type === 'public') next()
        else next(new UserForbidden())
      })
    }
  },
}