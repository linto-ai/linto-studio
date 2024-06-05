const debug = require('debug')('linto:session-api:router:api:transcriber_profiles')
const { Model } = require("live-srt-lib")
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')

const {
    storeSession
} = require(`${process.cwd()}/components/WebServer/routecontrollers/session/conversation.js`)


module.exports = (webserver) => {
    return [{
        path: '/organizations/:organizationId/sessions/active',
        method: 'get',
        requireAuth: true,
        requireOrganizationMemberAccess: true,
        controller: async (req, res, next) => {
            try {
                const sessions = await Model.Session.findAll({
                    where: {
                        status: 'active'
                    }
                });
                res.json(sessions);
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions/terminated',
        method: 'get',
        requireAuth: true,
        requireOrganizationMemberAccess: true,
        controller: async (req, res, next) => {
            try {
                const sessions = await Model.Session.findAll({
                    where: {
                        status: 'terminated',
                        organizationId: req.params.organizationId
                    }
                });
                res.json(sessions);
            } catch (err) {
                next(err);
            }
        }
    },
    {
        path: '/organizations/:organizationId/sessions/:id',
        method: 'get',
        requireAuth: true,
        requireOrganizationMemberAccess: true,
        controller: async (req, res, next) => {
            try {
                const session = await Model.Session.findByPk(req.params.id, {
                    include: {
                        model: Model.Channel,
                        attributes: {
                            exclude: ['id', 'sessionId']
                        }
                    },
                    where: {
                        organizationId: req.params.organizationId
                    }
                });

                if (!session) {
                    return res.status(404).send('Session not found');
                } else if (session.organizationId != req.params.organizationId) {
                    return res.status(403).send('Forbidden');
                }
                res.json(session);
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/sessions/:id/public',
        method: 'get',
        controller: async (req, res, next) => {
            try {
                const session = await Model.Session.findByPk(req.params.id, {
                    include: {
                        model: Model.Channel,
                        attributes: {
                            exclude: ['id', 'sessionId']
                        }
                    }
                });

                //TODO: check if session is publicly open
                if (!session) {
                    return res.status(404).send('Session not found');
                }
                res.json(session)
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions',
        method: 'get',
        requireAuth: true,
        requireOrganizationMemberAccess: true,
        controller: async (req, res, next) => {
            const limit = req.query.limit ?? 10
            const offset = req.query.offset ?? 0
            const searchName = req.query.searchName
            let where = {}

            const statusList = req.query.status ? req.query.status.split(',') : null
            if (statusList) {
                where.status = { [Model.Op.in]: statusList }
            }

            if (searchName) {
                where.name = { [Model.Op.startsWith]: searchName }
            }

            where.organizationId = req.params.organizationId

            Model.Session.findAndCountAll({
                limit: limit,
                offset: offset,
                include: {
                    model: Model.Channel,
                    attributes: {
                        exclude: ['id', 'sessionId', 'closed_captions']
                    }
                },
                where: where
            }).then(results => {
                res.json({
                    sessions: results.rows,
                    totalItems: results.count
                })
            }).catch(err => next(err))
        }
    }, {
        path: '/organizations/:organizationId/sessions',
        method: 'post',
        requireAuth: true,
        requireOrganizationAdminAccess: true,
        controller: async (req, res, next) => {
            try {
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
                                exclude: ['id', 'sessionId']
                            }
                        }
                    });
                    res.json(sessionWithChannels);
                } catch (err) {
                    var msg = err.message
                    if (err.response && err.response.data) {
                        msg = err.response.data.error
                    }
                    res.status(500).json({ "error": msg })
                }
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions/:id',
        method: 'delete',
        requireAuth: true,
        requireOrganizationAdminAccess: true,
        controller: async (req, res, next) => {
            try {
                const session = await Model.Session.findByPk(req.params.id);
                if (!session) {
                    return res.status(404).send('Session not found');
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
                    res.status(500).json({ "error": msg })
                }
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions/:id/start',
        method: 'put',
        requireAuth: true,
        requireOrganizationMaintainerAccess: true,
        controller: async (req, res, next) => {
            try {
                const sessionId = req.params.id
                const session = await Model.Session.findByPk(sessionId)
                if (!session) {
                    return res.status(404).send('Session not found')
                }
                if (session.status == 'active') {
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
                    res.status(500).json({ "error": msg })
                }
            } catch (err) {
                next(err)
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions/:id/reset',
        method: 'put',
        requireAuth: true,
        requireOrganizationMaintainerAccess: true,
        controller: async (req, res, next) => {
            try {
                const sessionId = req.params.id
                const session = await Model.Session.findByPk(sessionId)
                if (!session) {
                    return res.status(404).send('Session not found')
                }
                if (!['active', 'ready'].includes(session.status)) {
                    res.status(400).json({ 'error': 'Session must be ready or active' })
                    return
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
                    res.status(500).json({ "error": msg })
                }
            } catch (err) {
                next(err)
            }
        }
    }, {
        path: '/organizations/:organizationId/sessions/:id/stop',
        method: 'put',
        requireAuth: true,
        requireOrganizationMaintainerAccess: true,
        controller: async (req, res, next) => {
            try {
                const sessionId = req.params.id
                const session = await Model.Session.findByPk(sessionId)
                if (!session) {
                    return res.status(404).send('Session not found')
                }
                if (session.status == 'terminated') {
                    res.json(session)
                    return
                }


                const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions/${session.id}/stop`
                try {
                    await axios.put(url)

                    const sessionTerminate = await Model.Session.findByPk(sessionId)
                    await storeSession(sessionTerminate)

                    res.json(sessionTerminate)
                } catch (err) {
                    var msg = err.message
                    if (err.response && err.response.data) {
                        msg = err.response.data.error
                    }
                    res.status(500).json({ "error": msg })
                }
            } catch (err) {
                next(err)
            }
        }
    },
    {
        path: '/organizations/:organizationId/sessions/:id/store',
        method: 'post',
        requireAuth: true,
        requireOrganizationAdminAccess: true,
        controller: async (req, res, next) => {
            try {
                const session = await Model.Session.findByPk(req.params.id, {
                    include: {
                        model: Model.Channel,
                        attributes: {
                            exclude: ['id', 'sessionId']
                        }
                    }
                });

                if (!session) {
                    return res.status(404).send('Session not found');
                }

                let conv = await storeSession(session)

                res.json(conv);


                // res.json(session);
            } catch (err) {
                next(err);
            }
        }
    }


    ];
};
