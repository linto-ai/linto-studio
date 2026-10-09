// What the purchase modal says about each kind of pack before its prices: a
// headline, three features and, when the kind needs one, a note on how it is
// counted. A kind missing from the table shows its packs only.
export const PACK_KIND_PITCHES = {
  live: {
    headlineKey: "billing.settings.packs.pitch.live.headline",
    features: [
      { icon: "microphone", key: "billing.settings.packs.pitch.live.input" },
      { icon: "users", key: "billing.settings.packs.pitch.live.speakers" },
      {
        icon: "translate",
        key: "billing.settings.packs.pitch.live.translation",
      },
    ],
    // Live is counted per language: a translation doubles the time used
    noteKey: "billing.settings.packs.pitch.live.counting",
  },
  transcription: {
    headlineKey: "billing.settings.packs.pitch.transcription.headline",
    features: [
      {
        icon: "file-audio",
        key: "billing.settings.packs.pitch.transcription.media",
      },
      {
        icon: "users",
        key: "billing.settings.packs.pitch.transcription.speakers",
      },
      { icon: "sparkle", key: "billing.settings.packs.pitch.transcription.ai" },
    ],
    noteKey: null,
  },
}
