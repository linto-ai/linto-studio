import test from "ava"
import { canUploadMedia } from "../canUploadMedia.js"

const SUMMARY_ONLY = 2
const UPLOAD_AND_SUMMARY = 3
const MEMBER = 1
const UPLOADER = 2
const ADMINISTRATOR = 6

test("canUploadMedia() needs the upload permission on the organization", (t) => {
  t.true(canUploadMedia(UPLOAD_AND_SUMMARY, ADMINISTRATOR))
  t.false(canUploadMedia(SUMMARY_ONLY, ADMINISTRATOR))
})

test("canUploadMedia() needs at least the uploader role", (t) => {
  t.true(canUploadMedia(UPLOAD_AND_SUMMARY, UPLOADER))
  t.false(canUploadMedia(UPLOAD_AND_SUMMARY, MEMBER))
})

test("canUploadMedia() is false while the organization is not loaded", (t) => {
  t.false(canUploadMedia(undefined, undefined))
  t.false(canUploadMedia(UPLOAD_AND_SUMMARY, undefined))
})
