import { COLLECTION_TYPE } from "@/tools/voiceprintConstants.js"

// Resolve a voiceprint collection to its display name. Organization collections
// are auto-managed and their stored name is not meaningful to users, so surface
// a natural, fixed label instead. Returns null when there is nothing to show.
// `t` is the i18n translate function (e.g. `this.$t`).
export default function resolveDiarizationCollectionName(collection, t) {
  if (!collection) return null
  return collection.type === COLLECTION_TYPE.ORGANIZATION
    ? t("speaker_diarization.organization_collection_name")
    : collection.name || null
}
