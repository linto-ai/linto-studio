export default function getTextTurnWithTranslation(turn, selectedTranslations, channelLanguages) {
  if (selectedTranslations === "original") {
    return turn.text ?? ""
  } else if (selectedTranslations === "crossSubtitles") {
    const translationsList = Object.keys(turn.translations)
    const lang = turn.lang.split("-")[0]
    const oppositeLang = channelLanguages.find((l) => l.split("-")[0] !== lang)
    const oppositeTranslation = translationsList.find((t) => t.split("-")[0] === oppositeLang.split("-")[0])
    return turn?.translations?.[oppositeTranslation] ?? ""
  } else {
    return turn?.translations?.[selectedTranslations] ?? ""
  }
}
