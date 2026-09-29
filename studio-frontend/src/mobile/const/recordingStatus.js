// Life of a local recording: recording → naming (the stop sheet) → queued
// (sent as soon as the network allows) → uploading → uploaded (audio kept
// on the phone) or error.
export const RECORDING_STATUS = Object.freeze({
  RECORDING: "recording",
  NAMING: "naming",
  QUEUED: "queued",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  ERROR: "error",
})
