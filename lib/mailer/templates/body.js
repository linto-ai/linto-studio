const debug = require('debug')('linto:lib:Mailer:templates:builder:body')

const TYPE = require('./../dao/type')

module.exports = function (Type, payload) {
  switch (Type.type) {
    case TYPE.ACCOUNT_CREATED.type:
      return accountCreated(payload)
    case TYPE.RESET_PASSWORD.type:
      return passwordReset(payload)
    case TYPE.SHARE_CONVERSATION.type:
      return shareConversation(payload)
    case TYPE.SHARE_CONVERSATION_EXTERNAL.type:
      return shareExternalLink(payload)
    case TYPE.UNSHARE_CONVERSATION.type:
      return unshareConversation(payload)
    default:
      throw new Error('Unknown mail type')
  }
}

function accountCreated(payload) {
  return `
  <p>Félicitations, vous venez de créer un compte sur ${payload.origin}! Votre adresse e-mail est liée à votre compte et l’identifie. Pour finaliser la création de votre compte, veuillez cliquer sur le lien de vérification ci-dessous. Cela nous permettra de nous assurer que vous êtes bien propriétaire de cette adresse e-mail.</p>
 
  <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.origin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></p></div>
  `
}

function authLink(payload) {
  passwordReset(payload)
}

function passwordReset(payload) {
  return `
  <p>Il y a eu une demande de réinitialisation de mot de passe pour votre compte avec l'adresse e-mail associée "${payload.email}. Pour vous connecter immédiatement, utilisez le lien unique ci-après, valable pendant 30 minutes. 
  Cliquez sur ce lien pour continuer: </p>
  <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.origin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></p></div>
  
  <p style="color: #777; font-style: italic;">Si vous n’avez plus accès à votre mot de passe, pensez à le mettre à jour “Mon Compte” > “Modifier le mot de passe”</p>
  <p style="color: #777; font-style: italic;">Si vous n’avez pas fait de demande de mot de passe oublié, vous pouvez ignorer cet email.</p>
  `
}

function shareConversation(payload) {
  return `
  <p>Vous avez reçu une transcription de conversation sur la plateforme LinTO - Conversation Manager de la part de <strong>${payload.sharedByEmail}</strong>.</p>
  <p>Cliquez sur le lien pour accéder à la transcription partagée : </p>

  <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.origin}/inteface/conversations/${payload.conversationId}" target="_blank">${payload.origin}/inteface/conversations/${payload.conversationId}</a></p></div>
  `
}

function shareExternalLink(payload) {
  return `
  <p>Vous avez reçu une transcription de conversation sur la plateforme LinTO - Conversation Manager de la part de <strong>${payload.sharedByEmail}</strong>.</p>
  <p>Utilisez le lien unique ci-après pour accéder à cette ressource et lier un compte à votre adresse e-mail qui l’identifie. N'oubliez pas de définir un mot de passe pour les connexions futures en allant dans "Mon Compte" > "Modifier le mot de passe". </p>
  <p>Ce lien a une validité de 48h.</p>
  <p> Cliquez sur le lien pour accéder à votre compte et à la transcription partagée : </p>
  <div style="margin: 0 auto 20px auto; padding:20px; background-color: #fff; max-width: 960px; min-width: 320px;"><p style="margin:0;"><a href="${payload.origin}/magiclink-auth/${payload.magicId}" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></p></div>
  `
}

function unshareConversation(payload) {
  return `
  <p>Révocation de vos droit sur la conversation "${payload.name}.</p>
 `
}