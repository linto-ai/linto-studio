import test from "ava"
import { PLATFORM_ROLES } from "../../const/platformRoles.js"
import {
  roleIsUser,
  roleIsOrganizationInitiator,
  roleIsSessionOperator,
  roleIsSystemAdministrator,
  roleIsSuperAdministrator,
  isAtLeastSystemAdministrator,
  computeRoleValue,
} from "../platformRoles.js"

test("roleIsX matches a role contained in the bitmask", (t) => {
  const role = PLATFORM_ROLES.USER + PLATFORM_ROLES.SYSTEM_ADMINISTRATOR
  t.true(roleIsUser(role))
  t.true(roleIsSystemAdministrator(role))
})

test("roleIsX rejects a role absent from the bitmask", (t) => {
  t.false(roleIsSessionOperator(PLATFORM_ROLES.USER))
  t.false(roleIsUser(PLATFORM_ROLES.UNDEFINED))
  t.false(roleIsOrganizationInitiator(PLATFORM_ROLES.SESSION_OPERATOR))
  t.false(roleIsSuperAdministrator(PLATFORM_ROLES.SYSTEM_ADMINISTRATOR))
})

test("isAtLeastSystemAdministrator accepts system and super administrators", (t) => {
  t.true(isAtLeastSystemAdministrator(PLATFORM_ROLES.SYSTEM_ADMINISTRATOR))
  t.true(isAtLeastSystemAdministrator(PLATFORM_ROLES.SUPER_ADMINISTRATOR))
  t.true(
    isAtLeastSystemAdministrator(
      PLATFORM_ROLES.USER + PLATFORM_ROLES.SYSTEM_ADMINISTRATOR,
    ),
  )
})

test("isAtLeastSystemAdministrator rejects lower roles", (t) => {
  t.false(isAtLeastSystemAdministrator(PLATFORM_ROLES.UNDEFINED))
  t.false(isAtLeastSystemAdministrator(PLATFORM_ROLES.USER))
  t.false(
    isAtLeastSystemAdministrator(
      PLATFORM_ROLES.USER + PLATFORM_ROLES.SESSION_OPERATOR,
    ),
  )
})

test("computeRoleValue builds the bitmask from checked roles", (t) => {
  t.is(
    computeRoleValue({
      USER: true,
      SESSION_OPERATOR: false,
      SYSTEM_ADMINISTRATOR: true,
    }),
    PLATFORM_ROLES.USER + PLATFORM_ROLES.SYSTEM_ADMINISTRATOR,
  )
  t.is(computeRoleValue({}), 0)
})
