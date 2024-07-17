const debug = require("debug")(
  "linto:session-api:router:api:transcriber_profiles",
)
const { Model } = require("live-srt-lib")
const axios = require("axios")

const { storeSession } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)

const {
  SessionError,
  SessionNotFound,
  SessionForbidden,
  SessionNotStarted,
  TranscriberUnavailable,
} = require(`${process.cwd()}/components/WebServer/error/exception/session`)

module.exports = (webserver) => {
  return [
    {
      path: "/organizations/:organizationId/sessions/:id",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: async (req, res, next) => {
        try {
          const transcriber_id = req.query.transcriber_id
          const session = await Model.Session.findByPk(req.params.id, {
            include: {
              model: Model.Channel,
              attributes: {
                exclude: ["id", "sessionId"],
              },
              where: transcriber_id ? { transcriber_id: transcriber_id } : {}, // Apply filter if transcriberId is provided
            },
            where: {
              organizationId: req.params.organizationId,
            },
          })

          if (!session) {
            throw new SessionNotFound()
          } else if (session.organizationId != req.params.organizationId) {
            throw new SessionForbidden()
          }
          res.json(session)
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/sessions/:id/public",
      method: "get",
      controller: async (req, res, next) => {
        try {
          const transcriber_id = req.query.transcriber_id
          const session = await Model.Session.findByPk(req.params.id, {
            include: {
              model: Model.Channel,
              attributes: {
                exclude: ["id", "sessionId"],
              },
              where: transcriber_id ? { transcriber_id: transcriber_id } : {}, // Apply filter if transcriberId is provided
            },
          })

          if (!session || session.public === false) {
            throw new SessionNotFound()
          }
          res.json(session)
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: async (req, res, next) => {
        const limit = req.query.limit ?? 10
        const offset = req.query.offset ?? 0
        const searchName = req.query.searchName
        const searchStatus = req.query.status

        let where = {}

        const statusList = req.query.status ? req.query.status.split(",") : null
        if (statusList) {
          where.status = { [Model.Op.in]: statusList }
        }

        if (searchName) {
          where.name = { [Model.Op.startsWith]: searchName }
        }

        if (
          searchStatus &&
          [
            "pending_creation",
            "ready",
            "active",
            "errored",
            "terminated",
          ].includes(searchStatus)
        ) {
          where.status = searchStatus
        }

        where.organizationId = req.params.organizationId

        Model.Session.findAndCountAll({
          limit: limit,
          offset: offset,
          include: {
            model: Model.Channel,
            attributes: {
              exclude: ["id", "sessionId", "closed_captions"],
            },
          },
          where: where,
        })
          .then((results) => {
            res.json({
              sessions: results.rows,
              totalItems: results.count,
            })
          })
          .catch((err) => next(err))
      },
    },
    {
      path: "/organizations/:organizationId/sessions",
      method: "post",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: async (req, res, next) => {
        try {
          const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions`
          req.body.owner = req.payload.data.userId
          req.body.organizationId = req.params.organizationId

          const response = await axios.post(url, req.body)
          const sessionId = response.data.sessionId
          const sessionWithChannels = await Model.Session.findByPk(sessionId, {
            include: {
              model: Model.Channel,
              attributes: {
                exclude: ["id", "sessionId"],
              },
            },
          })
          res.json(sessionWithChannels)
        } catch (err) {
          var msg = err.message
          if (
            err.response &&
            err.response.data &&
            err.response?.data?.error.includes(
              "No available transcribers to enroll into session",
            )
          ) {
            next(new TranscriberUnavailable())
          } else if (err.response && err.response.data) {
            res.status(500).json({ error: err.response.data.error })
          } else {
            res.status(500).json({ error: msg })
          }
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions/:id",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: async (req, res, next) => {
        try {
          const session = await Model.Session.findByPk(req.params.id)
          if (!session) {
            throw new SessionNotFound()
          }
          const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions/${session.id}`
          try {
            await axios.delete(url)
            res.json(session)
          } catch (err) {
            var msg = err.message
            if (err.response && err.response.data) {
              msg = err.response.data.error
            }
            next(new SessionError(msg, err))
          }
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions/:id/start",
      method: "put",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: async (req, res, next) => {
        try {
          const sessionId = req.params.id
          const session = await Model.Session.findByPk(sessionId)
          if (!session) {
            throw new SessionNotFound()
          }
          if (session.status == "active") {
            res.json(session)
            return
          }

          const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions/${session.id}/start`
          try {
            await axios.put(url)
            res.json(await Model.Session.findByPk(sessionId))
          } catch (err) {
            var msg = err.message
            if (err.response && err.response.data) {
              msg = err.response.data.error
            }
            next(new SessionError(msg, err))
          }
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions/:id/reset",
      method: "put",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: async (req, res, next) => {
        try {
          const sessionId = req.params.id
          const session = await Model.Session.findByPk(sessionId)
          if (!session) {
            throw new SessionNotFound()
          }
          if (!["active", "ready"].includes(session.status)) {
            throw new SessionNotStarted()
          }

          const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions/${session.id}/reset`
          try {
            await axios.put(url)
            res.json(session)
          } catch (err) {
            var msg = err.message
            if (err.response && err.response.data) {
              msg = err.response.data.error
            }
            next(new SessionError(msg, err))
          }
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions/:id/stop",
      method: "put",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: async (req, res, next) => {
        try {
          const sessionId = req.params.id
          const session = await Model.Session.findByPk(sessionId)
          if (!session) {
            throw new SessionNotFound()
          }
          if (session.status == "terminated") {
            res.json(session)
            return
          }

          const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions/${session.id}/stop`
          try {
            await axios.put(url)

            const sessionToStore = await Model.Session.findByPk(req.params.id, {
              include: {
                model: Model.Channel,
                attributes: {
                  exclude: ["id", "sessionId"],
                },
              },
            })
            let conversation = await storeSession(sessionToStore)
            const sessionTerminate = await Model.Session.findByPk(sessionId)

            res.json({
              ...sessionTerminate.dataValues,
              conversationId: conversation.insertedId.toString(),
            })
          } catch (err) {
            var msg = err.message
            if (err.response && err.response.data) {
              msg = err.response.data.error
            }
            next(new SessionError(msg, err))
          }
        } catch (err) {
          next(err)
        }
      },
    },
    {
      path: "/organizations/:organizationId/sessions/:id/store",
      method: "post",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: async (req, res, next) => {
        try {
          const session = await Model.Session.findByPk(req.params.id, {
            include: {
              model: Model.Channel,
              attributes: {
                exclude: ["id", "sessionId"],
              },
            },
          })

          if (!session) {
            throw new SessionNotFound()
          }

          let conversation = await storeSession(session)
          res.json({ _id: conversation.insertedId.toString() })
        } catch (err) {
          next(err)
        }
      },
    },
  ]
}
