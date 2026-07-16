import test from "ava"
import {
  PLATFORM_ROLES,
  hasPlatformRole,
  isAtLeastSystemAdministrator,
} from "../platformRoles.js"

test("hasPlatformRole matches a role contained in the bitmask", (t) => {
  const role = PLATFORM_ROLES.USER + PLATFORM_ROLES.SYSTEM_ADMINISTRATOR
  t.true(hasPlatformRole(role, PLATFORM_ROLES.SYSTEM_ADMINISTRATOR))
  t.true(hasPlatformRole(role, PLATFORM_ROLES.USER))
})

test("hasPlatformRole rejects a role absent from the bitmask", (t) => {
  t.false(hasPlatformRole(PLATFORM_ROLES.USER, PLATFORM_ROLES.SESSION_OPERATOR))
  t.false(hasPlatformRole(PLATFORM_ROLES.UNDEFINED, PLATFORM_ROLES.USER))
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
