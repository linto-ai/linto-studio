import test from "ava"
import { filterMembersByText } from "../filterMembersByText.js"

const MEMBERS = [
  { firstname: "Jérôme", lastname: "Martin", email: "jmartin@linagora.com" },
  { firstname: "Alexandre", lastname: "Pujol", email: "apujol@linagora.com" },
  { firstname: "", lastname: "", email: "cmcaron@linagora.com" },
]

test("an empty search returns every member", (t) => {
  t.is(filterMembersByText(MEMBERS, "").length, 3)
  t.is(filterMembersByText(MEMBERS, "   ").length, 3)
})

test("matches on the first name, ignoring diacritics and case", (t) => {
  const found = filterMembersByText(MEMBERS, "jerome")
  t.is(found.length, 1)
  t.is(found[0].lastname, "Martin")
})

test("matches on the e-mail alone", (t) => {
  const found = filterMembersByText(MEMBERS, "cmcaron")
  t.is(found.length, 1)
  t.is(found[0].email, "cmcaron@linagora.com")
})

test("matches on the full name", (t) => {
  t.is(filterMembersByText(MEMBERS, "alexandre pujol").length, 1)
})

test("no match returns an empty list", (t) => {
  t.deepEqual(filterMembersByText(MEMBERS, "zzz"), [])
})

test("a missing list is not an error", (t) => {
  t.deepEqual(filterMembersByText(undefined, "a"), [])
})
