const TITLE_NAME = 'LinTO Conversation Manager -'

module.exports = Object.freeze({
  ACCOUNT_CREATED: {
    type: `send_account_created`,
    title: `${TITLE_NAME} Validation de votre compte`,
    subject: `Validation de votre compte`
  },
  RESET_PASSWORD: {
    type: `send_reset_link`,
    title: `${TITLE_NAME} Lien de connexion unique`,
    subject: `Lien de connexion unique`
  },
  SHARE_CONVERSATION: {
    type: `send_share_conversation`,
    title: `${TITLE_NAME} Partage de conversation`,
    subject: `Partage d'une conversation`
  },
  SHARE_CONVERSATION_EXTERNAL: {
    type: `send_share_external_link`,
    title: `${TITLE_NAME} Partage de conversation`,
    subject: `Partage d'une conversation`
  },
  UNSHARE_CONVERSATION: {
    type: `send_unshare_conversation`,
    title: `${TITLE_NAME} Révocation de vos droits sur une conversation`,
    subject: `Révocation de vos droit sur une conversation`
  },
  VERIFY_ADDRESS_EMAIL: {
    type: `send_verify_email`,
    title: "Vérification de votre adresse email",
    subject: "Vérification de votre adresse email"
  },
  checkType: (TYPE, strType) => (TYPE.type === strType),
})
