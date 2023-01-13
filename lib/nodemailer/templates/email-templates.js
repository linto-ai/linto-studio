const MAIL_HEADER = `<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style type="text/css">
  body{
    background-color: #fbfbfb;
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
  #mail-wrapper{
    width: 100%;
    background-color: #f2f2f2;
    text-align:center;
  }
  table{
    width: 100%;
    max-width: 960px;
    min-width: 320px;
    border: none;
    border-collapse: collapse !important;
    margin: 0 auto;
  }

  #mail-header{
    background-color: #f2f2f2;
  }
  .logo{
    display: inline-block;
    max-height: 100px;
    width: auto;
    margin: 0 10px;
  }

  #mail-body {
    padding: 20px;
    background-color: #ffffff;
  }
  #mail-body tbody tr{
    border-bottom: 1px solid #eeeeee;
  }
  #mail-body tbody tr td{
    padding: 10px;
    vertical-align: top;
  }
  .mail-title{
    font-size: 22px;
    font-weight: 600;
    color: #1daf92;
    text-align: center;
    padding: 40px 0 20px 0;
  }
  td.mail-contact-label {
    font-size: 14px;
    width: 25%;
    text-align: right;
    vertical-align: top;
  }
  td.mail-content{
    font-size: 14px;
    line-height: 22px;
    text-align: left;
    vertical-align: top;
  }
  td.mail-link{
    text-align: center;
    padding: 20px 0;
  }
  a#reset-link {
    display: inline-block;
    padding: 20px 10px;
    background-color: #2da800;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
    text-decoration: none;
    -moz-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
    -webkit-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
    box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  a.link{
    color: #007bff;
    text-decoration: underline;
  }
  strong {
    font-weight: 700;
    color: #364954;
  }

  #mail-footer{
    background-color: #ffffff;
    border-top: 1px solid #ccc;

  }
  .logo-footer{
    display: inline-block;
    height: 60px;
    width: auto;
    padding: 20px 0;
  }
  .copyright{
    padding: 10px 0;
    background-color: #1daf92;
    text-align: center;
    color: #fff;
  }
</style>
</head>`

const MAIL_FOOTER = `
<table id="mail-footer" cellpadding="0" cellspacing="0" width="100%">
  <tbody>
    <tr>
      <td align="center" class="copyright">
        © COPYRIGHT LINAGORA 2022
      </td>
    </tr>
  </tbody>
</table>`

function htmlAccountCreatedTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  ${MAIL_HEADER}
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">LinTO Conversation Manager - validation de votre compte</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>Félicitations, vous venez de créer un compte sur ${payload.reqOrigin}! Votre adresse e-mail est liée à votre compte et l’identifie. Pour finaliser la création de votre compte, veuillez cliquer sur le lien de vérification ci-dessous. Cela nous permettra de nous assurer que vous êtes bien propriétaire de cette adresse e-mail.</p>
 
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.reqOrigin}/magiclink-auth/${payload.magicId}</a></p></div>
      <!-- END Body -->
      ${MAIL_FOOTER}
    </div>
  </body>
  </html>`
  return htmlTemplate
}


function htmlAuthLinkTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  ${MAIL_HEADER}
  <html>
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">LinTO Conversation Manager - Lien de connexion unique</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>Il y a eu une demande de réinitialisation de mot de passe pour votre compte avec l'adresse e-mail associée "${payload.email}. Pour vous connecter immédiatement, utilisez le lien unique ci-après, valable pendant XX minutes. 

      Cliquez sur ce lien pour continuer: </p>
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.reqOrigin}/magiclink-auth/${payload.magicId}</a></p></div>
      
      <p style="color: #777; font-style: italic;">Si vous n’avez plus accès à votre mot de passe, pensez à le mettre à jour “Mon Compte” > “Modifier le mot de passe”</p>
      <p style="color: #777; font-style: italic;">Si vous n’avez pas fait de demande de mot de passe oublié, vous pouvez ignorer cet email.</p>
      <!-- END Body -->
      ${MAIL_FOOTER}
    </div>
  </body>
  </html>`
  return htmlTemplate
}
function htmlShareConversationTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  ${MAIL_HEADER}
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">LinTO Conversation Manager - Partage de conversation</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>Vous avez reçu une transcription de conversation sur la plateforme LinTO - Conversation Manager de la part de <i>${payload.sharedByName}</i> - <strong>${payload.sharedByEmail}</strong>.</p>
      <p>Cliquez sur le lien pour accéder à la transcription partagée : </p>
 
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/inteface/conversations/${payload.conversationId}" target="_blank">${payload.reqOrigin}/inteface/conversations/${payload.conversationId}</a></p></div>
      <!-- END Body -->
      ${MAIL_FOOTER}
    </div>
  </body>
  </html>`
  return htmlTemplate
}

function htmlUnshareConversationTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  ${MAIL_HEADER}
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">Conversation Manager - Révocation de vos droits sur une conversation</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>${payload.subject}</p>
      <!-- END Body -->
      ${MAIL_FOOTER}
    </div>
  </body>
  </html>`
  return htmlTemplate
}

function htmlShareConversationExternalTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  ${MAIL_HEADER}
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">Conversation Manager - partage de conversation</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>UVous avez reçu une transcription de conversation sur la plateforme LinTO - Conversation Manager de la part de <i>${payload.sharedByName}</i> - <strong>${payload.sharedByEmail}</strong>.</p>
      <p>Utilisez le lien unique ci-après pour accéder à cette ressource et lier un compte à votre adresse e-mail qui l’identifie. N'oubliez pas de définir un mot de passe pour les connexions futures en allant dans "Mon Compte" > "Modifier le mot de passe". </p>
      <p> Cliquez sur le lien pour accéder à votre compte et à la transcription partagée : </p>
 
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.reqOrigin}/magiclink-auth/${payload.magicId}</a></p></div>
      <!-- END Body -->
      ${MAIL_FOOTER}
    </div>
  </body>
  </html>`
  return htmlTemplate
}


module.exports = {
  htmlAccountCreatedTemplate,
  htmlAuthLinkTemplate,
  htmlShareConversationTemplate,
  htmlUnshareConversationTemplate,
  htmlShareConversationExternalTemplate
}