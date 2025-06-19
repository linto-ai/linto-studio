const TITLE_NAME = "LinTO Studio"

module.exports = Object.freeze({
  TITLE_NAME: TITLE_NAME,
  ACCOUNT_CREATED: {
    type: `send_account_created`,
    action: `account_created`,
  },
  RESET_PASSWORD: {
    type: `send_reset_link`,
    action: `reset_password`,
  },
  ACCOUNT_CREATE_INVITE_ORGANIZATION: {
    type: `send_account_create_invite_organization`,
    action: `account_create_invite_organization`,
  },
  INVITE_ORGANIZATION: {
    type: `send_invite_organization`,
    action: `invite_organization`,
  },
  UPDATE_ORGANIZATION_RIGHT: {
    type: `send_update_organization_right`,
    action: `update_organization_right`,
  },
  DELETE_ORGANIZATION_RIGHT: {
    type: `send_delete_organization_right`,
    action: `delete_organization_right`,
  },
  SHARE_CONVERSATION: {
    type: `send_share_conversation`,
    action: `share_conversation`,
  },
  SHARE_CONVERSATION_EXTERNAL: {
    type: `send_share_external_link`,
    action: `share_conversation_external`,
  },
  SHARE_CONVERSATION_RIGHT_UPDATE: {
    type: `send_share_conversation_right_update`,
    action: `share_conversation_right_update`,
  },
  UNSHARE_CONVERSATION: {
    type: `send_unshare_conversation`,
    action: `unshare_conversation`,
  },
  VERIFY_ADDRESS_EMAIL: {
    type: `send_verify_email`,
    action: `verify_address_email`,
  },
  SHARE_MULTIPLE_CONVERSATION_RIGHT: {
    type: `send_share_multiple_conversation_right`,
    action: `share_multiple_conversation_right`,
  },
  checkType: (TYPE, strType) => TYPE.type === strType,
})
