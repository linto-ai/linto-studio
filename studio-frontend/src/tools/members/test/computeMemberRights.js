import test from "ava"
import { computeMemberRights } from "../computeMemberRights.js"

const MAINTAINER_VIEWER = {
  id: "me",
  role: 5,
  isSystemAdministrator: false,
  isBackoffice: false,
}

test("a maintainer administers a member below them", (t) => {
  const rights = computeMemberRights(
    { _id: "other", role: 1 },
    MAINTAINER_VIEWER,
  )
  t.true(rights.canChangeRole)
  t.true(rights.canRemove)
  t.true(rights.canGrantSeat)
  t.false(rights.canLeave)
})

test("a collaborator can still be re-roled, but not given a seat again", (t) => {
  const rights = computeMemberRights(
    { _id: "other", role: 2 },
    MAINTAINER_VIEWER,
  )
  t.true(rights.canChangeRole)
  t.false(rights.canGrantSeat)
})

test("nobody administers a member above them", (t) => {
  const rights = computeMemberRights(
    { _id: "other", role: 6 },
    MAINTAINER_VIEWER,
  )
  t.false(rights.canChangeRole)
  t.false(rights.canRemove)
})

test("acting on oneself is leaving, never a role change", (t) => {
  const rights = computeMemberRights({ _id: "me", role: 5 }, MAINTAINER_VIEWER)
  t.false(rights.canChangeRole)
  t.false(rights.canRemove)
  t.true(rights.canLeave)
})

test("a plain member administers nobody", (t) => {
  const rights = computeMemberRights(
    { _id: "other", role: 1 },
    { id: "me", role: 1, isSystemAdministrator: false, isBackoffice: false },
  )
  t.false(rights.canChangeRole)
  t.false(rights.canGrantSeat)
})

test("a seat holder cannot be granted a seat twice", (t) => {
  const rights = computeMemberRights(
    { _id: "other", role: 4 },
    MAINTAINER_VIEWER,
  )
  t.true(rights.canChangeRole)
  t.false(rights.canGrantSeat)
})

test("on the backoffice only the platform role decides", (t) => {
  const viewer = {
    id: "me",
    role: 1,
    isSystemAdministrator: true,
    isBackoffice: true,
  }
  const rights = computeMemberRights({ _id: "other", role: 6 }, viewer)
  t.true(rights.canChangeRole)
  t.true(rights.canRemove)
  t.false(rights.canLeave)
})

test("a platform admin still cannot act on their own row", (t) => {
  const viewer = {
    id: "me",
    role: 1,
    isSystemAdministrator: true,
    isBackoffice: true,
  }
  t.false(computeMemberRights({ _id: "me", role: 6 }, viewer).canChangeRole)
})

test("a non-admin on the backoffice administers nobody", (t) => {
  const viewer = {
    id: "me",
    role: 6,
    isSystemAdministrator: false,
    isBackoffice: true,
  }
  t.false(computeMemberRights({ _id: "other", role: 1 }, viewer).canChangeRole)
})
