// The gateway records who uploaded a template in owner_user_id; older
// templates only carry the legacy user_id.
export function isPublicationTemplateOwner(template, userId) {
  const owner = template?.owner_user_id || template?.user_id
  return Boolean(owner) && owner === userId
}
