const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

function createContext(req, message, service = "webserver") {
  const userId = req?.payload?.data?.userId || null
  const action = `${req.method} ${req.url}`
  const resource = req.baseUrl || req.path
  const roleValue = req?.payload?.data?.role || null
  const roleName = ROLE.print(roleValue)

  console.log("user role in orga :" + req.userRole)

  const context = {
    user: {
      id: userId,
      role: {
        value: roleValue,
        name: roleName,
      },
    },
    action,
    resource,
    service,
    message,
  }

  return context
}

function createSocketContext(socket, message, service = "websocket") {
  const userId = socket?.decoded?.data?.userId || null
  const roleValue = socket?.decoded?.data?.role || null
  const roleName = ROLE.print(roleValue)
  const action = `SOCKET ${socket.id}`
  const resource = socket.nsp.name || "/"
}

module.exports = {
  createContext,
  createSocketContext,
}
