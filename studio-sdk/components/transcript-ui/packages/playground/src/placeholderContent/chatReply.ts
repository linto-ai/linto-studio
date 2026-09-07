// Mock chat assistant reply, streamed token by token to exercise the chat
// drawer's streaming UI end to end — see setupChatMock in App.vue.
export const REPLY_MARKDOWN =
  "Bonne question. Voici ce que je retiens de la transcription :\n\n" +
  "- **Charge réseau** au-dessus des prévisions pendant les pics\n" +
  "- Trois pistes envisagées dont le **cache distribué**\n" +
  "- Migration prévue la semaine prochaine\n\n" +
  "```js\n// invalidation à revoir si cache distribué\ncache.invalidate(key)\n```\n\n" +
  "Tu veux que je détaille un point ?"
