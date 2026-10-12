// How each kind of prepaid pack looks: a material color family (see
// style/_material-colors-variables.scss), an icon and a background motif.
// A new kind only needs a line here.
export const PACK_KIND_LOOKS = {
  live: { color: "teal", icon: "microphone", motif: "waves" },
  transcription: { color: "blue", icon: "file-audio", motif: "curves" },
}

// A kind missing from the table still renders, in neutral grey
export const DEFAULT_PACK_LOOK = {
  color: "blue-grey",
  icon: "package",
  motif: "curves",
}
