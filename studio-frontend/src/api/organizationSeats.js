import { apiUpdateUserRoleInOrganisation } from "./user.js"
import { grantSeatsToMembers } from "@/tools/grantSeatsToMembers.js"

/**
 * Gives a seat to each member of a batch by assigning their role, sequentially.
 * `notif` is left null on every call: a batch reports itself once, it does not
 * raise one global toast per member.
 * @param {string} organizationId
 * @param {Array<{userId: string, role: number}>} assignments
 * @param {Function} [onProgress]
 * @returns {Promise<{succeeded: Array, failed: Array, stopped: boolean}>}
 */
export function apiGrantSeatsToMembers(
  organizationId,
  assignments,
  onProgress,
) {
  return grantSeatsToMembers(
    assignments,
    (userId, role) =>
      apiUpdateUserRoleInOrganisation(organizationId, userId, role, null),
    onProgress,
  )
}
