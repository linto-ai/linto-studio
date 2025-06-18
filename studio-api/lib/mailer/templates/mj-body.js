const debug = require("debug")("linto:lib:Mailer:templates:builder:body")

const Handlebars = require("handlebars")

const TYPE = require("./../dao/type")
const langJSON = require("./../lang/french.json")
const enlangJSON = require("./../lang/english.json")

const templates = require("../lang/templates")

module.exports = function (Type, payload) {
  const mailContent = bodyContent(Type, payload)
  const body = `
    <mj-section background-color="#ffffff" padding="10px 25px">
      <mj-column>
        ${mailContent}
      </mj-column>
    </mj-section>
  `
  return body
}

function bodyContent(Type, payload) {
  switch (Type.type) {
    case TYPE.ACCOUNT_CREATED.type:
      return accountCreated(payload)
    case TYPE.RESET_PASSWORD.type:
      return passwordReset(payload)
    case TYPE.SHARE_CONVERSATION.type:
      return shareConversation(payload)
    case TYPE.SHARE_CONVERSATION_EXTERNAL.type:
      return shareExternalLink(payload)
    case TYPE.SHARE_CONVERSATION_RIGHT_UPDATE.type:
      return shareConversationRightUpdate(payload)
    case TYPE.UNSHARE_CONVERSATION.type:
      return unshareConversation(payload)
    case TYPE.VERIFY_ADDRESS_EMAIL.type:
      return verifyEmailAddress(payload)
    case TYPE.INVITE_ORGANIZATION.type:
      return shareMemberOrga(payload)
    case TYPE.ACCOUNT_CREATE_INVITE_ORGANIZATION.type:
      return accountInviteMemberOrga(payload)
    case TYPE.DELETE_ORGANIZATION_RIGHT.type:
      return deleteMemberOrga(payload)
    case TYPE.UPDATE_ORGANIZATION_RIGHT.type:
      return updateMemberOrga(payload)
    case TYPE.SHARE_MULTIPLE_CONVERSATION_RIGHT.type:
      return shareMultipleConversation(payload)
    default:
      throw new Error("Unknown mail type")
  }
}

function renderTemplate(template, payload) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => payload[key] || "")
}

function passwordReset(payload) {
  const template = Handlebars.compile(templates.reset_password)
  debug({ ...langJSON, ...payload })
  let resultHtml = template({ ...langJSON, ...payload }) // interpolates both $t() and {{...}}
  resultHtml = renderTemplate(resultHtml, payload)
  return resultHtml
}

function accountCreated(payload) {
  return `
  <mj-text>Félicitations, vous venez de créer un compte sur ${payload.origin}! Votre adresse e-mail est liée à votre compte et l’identifie. Pour finaliser la création de votre compte, veuillez cliquer sur le lien de vérification ci-dessous. Cela nous permettra de nous assurer que vous êtes bien propriétaire de cette adresse e-mail.</mj-text>
 
  <mj-text><a href="${payload.origin}/magiclink-auth/${payload.magicId}?type=account_create" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></mj-text>
  `
}

function shareConversation(payload) {
  return `
  <mj-text>Vous avez reçu une transcription de média sur la plateforme LinTO Studio de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>
  <mj-text>Cliquez sur le lien pour accéder à la transcription partagée : </mj-text>

  <mj-text><a href="${payload.origin}/interface/conversations/${payload.conversationId}" target="_blank">${payload.origin}/interface/conversations/${payload.conversationId}</a></mj-text>
  `
}

function shareConversationRightUpdate(payload) {
  return `
  <mj-text>Vous avez reçu une mise à jour de droits sur une transcription de média sur la plateforme LinTO Studio de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>
  <mj-text>Cliquez sur le lien pour accéder à la transcription partagée : </mj-text>
  
  <mj-text><a href="${payload.origin}/interface/conversations/${payload.conversationId}" target="_blank">${payload.origin}/interface/conversations/${payload.conversationId}</a></mj-text>
  `
}

function shareExternalLink(payload) {
  return `
  <mj-text>Vous avez reçu une transcription de média sur la plateforme LinTO Studio de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>
  <mj-text>Utilisez le lien unique ci-après pour accéder à cette ressource et lier un compte à votre adresse e-mail qui l’identifie. N'oubliez pas de définir un mot de passe pour les connexions futures en allant dans "Mon Compte" > "Modifier le mot de passe". </mj-text>
  <mj-text>Ce lien a une validité de 48h.</mj-text>
  <mj-text> Cliquez sur le lien pour accéder à votre compte ainsi qu'à la transcription partagée : </mj-text>
  <mj-text><a href="${payload.origin}/magiclink-auth/${payload.magicId}?type=share_conversation&conversationId=${payload.conversationId}" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></mj-text>
  `
}

function shareMemberOrga(payload) {
  return `
  <mj-text>Vous avez reçu une invitation à l'organization ${payload.orgaName} de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>`
}

function accountInviteMemberOrga(payload) {
  return `
  <mj-text>Vous avez reçu une invitation a l'organization ${payload.orgaName} sur la plateforme LinTO Studio de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>
  <mj-text>Utilisez le lien unique ci-après pour accéder à cette ressource et lier un compte à votre adresse e-mail qui l’identifie. N'oubliez pas de définir un mot de passe pour les connexions futures en allant dans "Mon Compte" > "Modifier le mot de passe". </mj-text>
  <mj-text>Ce lien a une validité de 48h.</mj-text>
  <mj-text> Cliquez sur le lien pour accéder à votre compte: </mj-text>
  <mj-text><a href="${payload.origin}/magiclink-auth/${payload.magicId}?type=invite_organization&organizationId=${payload.organizationId}" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></mj-text>
  `
}

function deleteMemberOrga(payload) {
  return `
  <mj-text>Vous avez été supprimé de l'organization ${payload.orgaName} sur la plateforme LinTO Studio.</mj-text>
  `
}

function updateMemberOrga(payload) {
  return `
  <mj-text>Vos droit avez été mis à jour dans l'organization ${payload.orgaName} sur la plateforme LinTO Studio </strong>.</mj-text>
  `
}

function unshareConversation(payload) {
  return `
  <mj-text>Révocation de vos droit sur le média "${payload.name}.</mj-text>
 `
}
function verifyEmailAddress(payload) {
  return `
  <mj-text>Vous avez récemment modifié votre adresse email sur la plateforme LinTO Studio</mj-text>
  <mj-text>Cliquez sur ce lien ci-dessous pour vérifier que vous êtes bien le propriétaire de l'adresse email que vous avez renseigné.</mj-text>
  <mj-text>Ce lien a une validité de 30 minutes.</mj-text>
  <mj-text><a href="${payload.origin}/magiclink-auth/${payload.magicId}?type=verify_mail" target="_blank">${payload.origin}/magiclink-auth/${payload.magicId}</a></mj-text>
  `
}

function shareMultipleConversation(payload) {
  let conv_link = '<ul class="list-conversation">'
  for (let conv_id of payload.conversationsList) {
    conv_link += `<li><p style="margin:0;"><a href="${payload.origin}/interface/conversations/${conv_id}" target="_blank">${payload.origin}/interface/conversations/${conv_id}</a></p></li>`
  }
  conv_link += "</ul>"

  return `
  <mj-text>Vous avez reçu une transcription de média sur la plateforme LinTO Studio de la part de <strong>${payload.sharedByEmail}</strong>.</mj-text>
  <mj-text>Cliquez sur les liens pour accéder aux transcriptions partagées : </mj-text>

  ${conv_link}
  `
}
