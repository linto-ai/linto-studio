import test from "ava"
import { isCollaboratorRole } from "../isCollaboratorRole.js"
import { ORGANIZATION_ROLES } from "../../const/organizationRoles.js"

test("uploader and above occupy a seat, readers do not", (t) => {
  t.false(isCollaboratorRole(ORGANIZATION_ROLES.MEMBER))
  t.true(isCollaboratorRole(ORGANIZATION_ROLES.UPLOADER))
  t.true(isCollaboratorRole(ORGANIZATION_ROLES.ADMINISTRATOR))
  t.false(isCollaboratorRole(undefined))
})
