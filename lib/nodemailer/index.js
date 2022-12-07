const nodemailer = require("nodemailer");
const emailTemplates = require('./templates/email-templates.js')

/*
payload: {
  email: 'user email',
  resetId : RESET_Id,
  subjet: 'Demande de mot de passe',
  type: 'send_reset_link'
}*/

async function sendMail(payload) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE, // true for 465, false for other ports
      requireTLS: process.env.SMTP_REQUIRE_TLS,
      auth: {
        user: process.env.SMTP_AUTH, // generated ethereal user
        pass: process.env.SMTP_PSWD // generated ethereal password
      }
    })

    transporter.verify(function (error, success) {
      if (error) {
        console.error(error);
        return 'mailerTransporterError'
      }
    })
    const to = payload.email
    let htmlMail = ''

    if(payload.type === 'send_reset_link') {
      htmlMail = emailTemplates.htmlResetLinkTemplate(payload)
    }
    
    const plainTextMail = 'todo'

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"convos.linto.ai" <${process.env.NO_REPLY_EMAIL}>`, // sender address
      to: to,
      subject: `convos.linto.ai - ${payload.subject}`, // Subject line
      //text: plainTextMail, // plain text body
      html: htmlMail
    })
    if (info.accepted.indexOf(to) >= 0) {
      // if email address is "accepted"
      return 'mailSend'
    } else if (info.rejected.indexOf(to) >= 0) {
      // if email address is "rejected"
      return 'mailReject'
    } else {
      return 'mailUnknownError'
    }
  } catch (err) {
    console.error('send mail error:', err)
    return err
  }
}

module.exports = {
  sendMail
}
