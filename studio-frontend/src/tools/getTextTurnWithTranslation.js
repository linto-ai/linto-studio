export default function getTextTurnWithTranslation(turn, selectedTranslations) {
  if (selectedTranslations === "original") {
    return turn.text ?? ""
  } else if (selectedTranslations === "crossSubtitles") {
    const translationsList = Object.keys(turn.translations)
    switch (turn.lang.split("-")[0]) {
      case translationsList[0].split("-")[0]:
        return turn?.translations?.[translationsList[1]] ?? ""
      case translationsList[1].split("-")[0]:
        return turn?.translations?.[translationsList[0]] ?? ""
      default:
        return ""
    }
  } else {
    return turn?.translations?.[selectedTranslations] ?? ""
  }
}
