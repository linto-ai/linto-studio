const debug = require('debug')('linto:lib:Mailer:mailing')
const Mailer = require(`./mailer`)
const TYPE = require('./dao/type')
const htmlBuilder = require('./templates/html.js')

class Mailing {

    constructor() {
        this.no_reply = 'noreply@convos.linto.ai'
        if (process.env.NO_REPLY_EMAIL !== undefined)
            this.no_reply = process.env.NO_REPLY_EMAIL
    }

    exctractRequestOrigin(req) {
        if (!!req.headers['x-forwarded-host'] && req.headers['x-forwarded-proto'])
            return `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
        else if (req.headers.origin)
            return req.headers.origin
        else if (req.headers.host)
            return req.headers.host
        else if (process.env.WEBSERVER_SWAGGER_HTTP_HOST !== undefined)
            return process.env.WEBSERVER_SWAGGER_HTTP_HOST + ':' + process.env.WEBSERVER_HTTP_PORT
        else
            return 'http://localhost:' + process.env.WEBSERVER_HTTP_PORT
    }

    /*Origin can be also the request */
    async accountCreate(email, origin, magicId) {
        if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)

        return await this.sendMail(TYPE.ACCOUNT_CREATED, { email, origin }, { origin, magicId })
    }

    async resetPassword(email, origin, magicId) {
        if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)

        return await this.sendMail(TYPE.RESET_PASSWORD, { email, origin }, { origin, magicId, email })
    }

    async conversationShared(email, origin, sharedByEmail, conversationId) {
        if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)

        return await this.sendMail(TYPE.SHARE_CONVERSATION, { email, origin }, { origin, sharedByEmail, conversationId })
    }

    async conversationSharedExternal(email, origin, magicId, sharedByEmail) {
        if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)

        return await this.sendMail(TYPE.SHARE_CONVERSATION_EXTERNAL, { email, origin }, { origin, magicId, sharedByEmail })
    }

    async conversationUnshare(email, origin, name) {
        if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)

        return await this.sendMail(TYPE.UNSHARE_CONVERSATION, { email, origin }, { name })
    }

    async verifyEmailAddress(email, origin, magicId) {
      if (typeof origin === 'object') origin = this.exctractRequestOrigin(origin)
      
      return await this.sendMail(TYPE.VERIFY_ADDRESS_EMAIL, { email, origin }, { email, origin, magicId })
    }

    async sendMail(TYPE, mail_data, payload) {
        const mail_payload = this.prepareMail(TYPE, mail_data, payload)
        return await Mailer.sendMail(mail_payload)
    }

    async isEmailValid(email) {
      return Mailer.isEmailValid(email)
    }

    prepareMail(TYPE, mail_data, payload) {
        const html = htmlBuilder(TYPE, payload)
        return this.generateMailPayload(mail_data, TYPE.subject, html)
    }

    generateMailPayload(mail_data, subject, html) {
        return {
            from: `${mail_data.origin} <${this.no_reply}>`,
            to: mail_data.email,
            subject: `${mail_data.origin} - ${subject}`,
            html: html
        }
    }
}

module.exports = new Mailing()