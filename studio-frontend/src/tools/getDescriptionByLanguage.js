export default function getDescriptionByLanguage(
  descriptionDict,
  language,
  fallback = null,
) {
  // Handle null/undefined description
  if (!descriptionDict || typeof descriptionDict !== "object") {
    return fallback
  }
  // transform language to get the first two letters
  language = language.substring(0, 2)
  // Check for non-empty string values
  if (descriptionDict[language] && descriptionDict[language].trim()) {
    return descriptionDict[language]
  } else if (descriptionDict["en"] && descriptionDict["en"].trim()) {
    return descriptionDict["en"]
  } else {
    // return the first non-empty one, or fallback
    const nonEmptyValue = Object.values(descriptionDict).find(
      (v) => v && typeof v === "string" && v.trim(),
    )
    return nonEmptyValue || fallback
  }
}
