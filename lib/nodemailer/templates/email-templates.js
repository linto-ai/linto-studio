function htmlAuthLinkTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Forgotten password</title>
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
        padding: 30px 0;
        background-color: #1daf92;
        text-align: center;
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">Conversation Manager - Mot de passe oublié</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->
      <!-- Body -->
      <p>Pour vous connecter à votre compte Conversation Manager, cliquez sur le lien suivant : </p>
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.reqOrigin}/magiclink-auth/${payload.magicId}</a></p></div>
      
      <p style="color: #777; font-style: italic;">Si vous n'avez pas fait de demande de mot de passe oublié, vous pouvez ignorer cet email</p>
      <p style="color: #777; font-style: italic;">Pour modifier votre mot de passe, connectez vous à votre compte : "Mon Compte" > "Modifier le mot de passe"</p>
      <!-- END Body -->
      <table id="mail-footer" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td align="center" class="copyright">
              © COPYRIGHT LINAGORA 2022
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`
  return htmlTemplate
}
function htmlShareLinkTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>A conversation has been shared to you</title>
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
        padding: 30px 0;
        background-color: #1daf92;
        text-align: center;
        color: #fff;
      }
    </style>
  </head>
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
      <p>Une conversation vous a été partagé par ${payload.sharedBy}, cliquez sur le lien suivant : </p>
      <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.reqOrigin}/interface/conversations/${payload.conversationId}" target="_blank">${payload.reqOrigin}/interface/conversations/${payload.conversationId}</a></p></div>
      
      <p style="color: #777; font-style: italic;">Si vous souhaitez ne plus recevoir les notifications de partage, connectez vous à votre compte : "Mon Compte" > décochez "Recevoir les notifcations de partage."</p>
      <!-- END Body -->
      <table id="mail-footer" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td align="center" class="copyright">
              © COPYRIGHT LINAGORA 2022
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`
  return htmlTemplate
}

module.exports = {
  htmlAuthLinkTemplate,
  htmlShareLinkTemplate
}