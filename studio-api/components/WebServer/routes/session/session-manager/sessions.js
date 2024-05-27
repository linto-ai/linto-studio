const debug = require('debug')('session-api:router:api:transcriber_profiles')
const { Model } = require("live-srt-lib")
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')


module.exports = (webserver) => {
    return [{
        path: '/sessions/active',
        method: 'get',
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
        path: '/sessions/terminated',
        method: 'get',
        controller: async (req, res, next) => {
            try {
                const sessions = await Model.Session.findAll({
                    where: {
                        status: 'terminated'
                    }
                });
                res.json(sessions);
            } catch (err) {
                next(err);
            }
        }
    },
    {
        path: '/sessions/:id',
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
                if (!session) {
                    return res.status(404).send('Session not found');
                }
                res.json(session);
            } catch (err) {
                next(err);
            }
        }
    }, {
        path: '/sessions',
        method: 'get',
        controller: async (req, res, next) => {
            const limit = req.query.limit ?? 10
            const offset = req.query.offset ?? 0
            const searchName = req.query.searchName
            let where = {}

            const statusList = req.query.status ? req.query.status.split(',') : null
            if (statusList) {
                where.status = {[Model.Op.in]: statusList}
            }

            if (searchName) {
                where.name = {[Model.Op.startsWith]: searchName}
            }

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
        path: '/sessions',
        method: 'post',
        controller: async (req, res, next) => {
            try {
                try {
                    const url = `${process.env.SESSION_SCHEDULER_URL}/v1/sessions`
                    console.log(url)
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
        path: '/sessions/:id',
        method: 'delete',
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
        path: '/sessions/:id/start',
        method: 'put',
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
        path: '/sessions/:id/reset',
        method: 'put',
        controller: async (req, res, next) => {
            try {
                const sessionId = req.params.id
                const session = await Model.Session.findByPk(sessionId)
                if (!session) {
                    return res.status(404).send('Session not found')
                }
                if (!['active', 'ready'].includes(session.status)) {
                    res.status(400).json({ 'error': 'Session must be ready or active'})
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
        path: '/sessions/:id/stop',
        method: 'put',
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
    }];
};
