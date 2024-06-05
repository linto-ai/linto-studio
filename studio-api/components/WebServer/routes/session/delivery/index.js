const debug = require('debug')('linto:delivery:webserver')
const txtGenerator = require('./txt')
const docGenerator = require('./doc')
const { srtGenerator, vttGenerator } = require('./subtitle')
const { Model } = require("live-srt-lib")

const {
    DeliveryError,
    DeliveryNotFound,
    DeliveryUnknowType,
    DeliveryUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/delivery`)


module.exports = (webserver) => {
    const fileGeneratorMapping = {
        'txt': txtGenerator,
        'doc': docGenerator,
        'srt': srtGenerator,
        'vtt': vttGenerator,
    }

    return [{
        path: '/:type',
        method: 'get',
        requireAuth: true,
        requireOrganizationMemberAccess: true,

        controller: async (req, res, next) => {
            try {
                const type = req.params.type
                if (!Object.keys(fileGeneratorMapping).includes(type)) {
                    throw new DeliveryUnknowType(`No export possible for ${type} type`)
                }

                const sessionId = req.query.sessionId
                const transcriberId = req.query.transcriberId
                const timezone = req.query.timezone

                if (!sessionId || !transcriberId) {
                    throw new DeliveryUnsupportedMediaType(`sessionId or transcriberId empty`)
                }

                await Model.Session.findByPk(sessionId, {
                    include: {
                        model: Model.Channel,
                    },
                    where: {
                        organizationId: req.params.organizationId
                    }
                }).then(session => {
                    if (!session) throw new DeliveryNotFound(`No session found for sessionId ${sessionId}`)

                    for (channel of session.channels) {
                        if ((channel.transcriber_id ?? channel.transcriberProfileId) == transcriberId) {
                            return [session, channel]
                        }
                    }
                    throw new DeliveryNotFound(`No channel found for transcriberId ${transcriberId}`)
                }).then(([session, channel]) => {
                    try {
                        fileGeneratorMapping[type](session, channel, timezone).then(content => {
                            const filename = `${session.name} - ${channel.name} (${channel.languages.join('_')}).${type}`
                            res.set('Content-Disposition', `attachment; filename=${filename}`)
                            res.type(content.type)
                            content.arrayBuffer().then(buf => {
                                res.send(Buffer.from(buf))
                            })
                        })
                    } catch (err) {
                        throw new DeliveryError(`Error while generating ${type} file`, err)
                    }
                }).catch(err => {
                    throw err
                })
            } catch (err) {
                next(err)
            }
        }
    }]
}
