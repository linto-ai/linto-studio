const debug = require('debug')('linto:lib:Mailer:mailing')

const Mailer = require(`./mailer`)
const TYPE = require('./dao/type')

const htmlBuilder = require('./templates/html.js')

class Mailing {

    constructor(){
        if(process.env.NO_REPLY_EMAIL === undefined) {
            this.no_reply = 'noreply@convos.linto.ai'
        } else {
            this.no_reply = process.env.NO_REPLY_EMAIL
        }
    }

    accountCreate(email, origin, magicId) {
        this.sendMail(TYPE.ACCOUNT_CREATED, { email, origin }, { origin, magicId })
    }

    resetPassword(email, origin, magicId) {
        this.sendMail(TYPE.RESET_PASSWORD, { email, origin }, { origin, magicId, email })
    }

    conversationShared(email, origin, sharedByName, sharedByEmail, conversationId) {
        this.sendMail(TYPE.SHARE_CONVERSATION, { email, origin }, { origin, sharedByName, sharedByEmail, conversationId })
    }

    conversationShared(email, origin, magicId, sharedByName, sharedByEmail, conversationId) {
        this.sendMail(TYPE.SHARE_CONVERSATION_EXTERNAL, { email, origin }, { origin, magicId, sharedByName, sharedByEmail, conversationId })
    }

    async sendMail(TYPE, mail_data, payload) {
        const mail_payload = this.prepareMail(TYPE, mail_data, payload)
        const mail_result = await Mailer.sendMail(mail_payload)
        return mail_result
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