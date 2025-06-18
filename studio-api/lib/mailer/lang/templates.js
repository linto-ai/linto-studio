module.exports = Object.freeze({
  account_created: `
    <mj-text>{{account_created.email_message_intro}}</mj-text>
    <mj-text><a href=\"{{link}}\" target=\"_blank\">{{link}}</a></mj-text>
  `,
  reset_password: `
    <mj-text>{{reset_password.email_intro}}</mj-text>
    <mj-text>
      <a href="{{origin}}/magiclink-auth/{{magicId}}?type=password_reset" target="_blank">
        {{origin}}/magiclink-auth/{{magicId}}
      </a>
    </mj-text>
    <mj-text>{{reset_password.email_tip}}</mj-text>
    <mj-text>{{reset_password.email_ignore}}</mj-text>
  `,
  share_conversation: `
    <mj-text>{{share_conversation.email_shared_by}}</mj-text>
    <mj-text>{{share_conversation.email_cta_intro}}</mj-text>
    <mj-text>
      <a href="{{link}}" target="_blank">{{link}}</a>
    </mj-text>
  `,
  share_conversation_right_update: `
    <mj-text>{{share_conversation_right_update.email_shared_by}}</mj-text>
    <mj-text>{{share_conversation_right_update.email_cta_intro}}</mj-text>
    <mj-text>
      <a href="{{origin}}/interface/conversations/{{conversationId}}" target="_blank">
        {{origin}}/interface/conversations/{{conversationId}}
      </a>
    </mj-text>
  `,
  share_conversation_external: `
    <mj-text>{{share_conversation_external.email_shared_by}}</mj-text>
    <mj-text>{{share_conversation_external.email_account_linking}}</mj-text>
    <mj-text>{{share_conversation_external.email_expiry_notice}}</mj-text>
    <mj-text>{{share_conversation_external.email_cta_intro}}</mj-text>
    <mj-text>
      <a href="{{origin}}/magiclink-auth/{{magicId}}?type=share_conversation&conversationId={{conversationId}}" target="_blank">
        {{origin}}/magiclink-auth/{{magicId}}
      </a>
    </mj-text>
  `,
  invite_organization: `
    <mj-text>{{invite_organization.email_invitation}}</mj-text>
  `,
  account_create_invite_organization: `
    <mj-text>{{account_create_invite_organization.email_invitation}}</mj-text>
    <mj-text>{{account_create_invite_organization.email_account_linking}}</mj-text>
    <mj-text>{{account_create_invite_organization.email_expiry_notice}}</mj-text>
    <mj-text>{{account_create_invite_organization.email_cta_intro}}</mj-text>
    <mj-text>
      <a href="{{origin}}/magiclink-auth/{{magicId}}?type=invite_organization&organizationId={{organizationId}}" target="_blank">
        {{origin}}/magiclink-auth/{{magicId}}
      </a>
    </mj-text>
  `,
  delete_organization_right: `
  <mj-text>{{delete_organization_right.email_info}}</mj-text>
  `,
  update_organization_right: `
    <mj-text>{{update_organization_right.email_info}}</mj-text>
  `,
  unshare_conversation: `
    <mj-text>{{unshare_conversation.email_revocation}}</mj-text>
  `,
  verify_address_email: `
    <mj-text>{{verify_address_email.email_info}}</mj-text>
    <mj-text>{{verify_address_email.email_verification_cta}}</mj-text>
    <mj-text>{{verify_address_email.email_expiry_notice}}</mj-text>
    <mj-text>
      <a href="{{origin}}/magiclink-auth/{{magicId}}?type=verify_mail" target="_blank">
        {{origin}}/magiclink-auth/{{magicId}}
      </a>
    </mj-text>
  `,
  share_multiple_conversation_right: `
    <mj-text>{{share_multiple_conversation_right.email_shared_by}}</mj-text>
    <mj-text>{{share_multiple_conversation_right.email_cta_intro}}</mj-text>
  `,
})
