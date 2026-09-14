import { apiGetOptedInMembers } from "@/api/voiceprintCollection.js"
import { apiGetSpeakerLabels } from "@/api/speakerLabel.js"
import { COLLECTION_TYPE } from "@/tools/voiceprintConstants.js"

// Names of the voices enrolled in a collection. Organization collections
// are fed by opted-in members, custom ones by managed speaker labels.
// Never throws: an unreachable API is an empty list.
export async function loadCollectionVoices(organizationId, collection) {
  try {
    const entries =
      collection.type === COLLECTION_TYPE.ORGANIZATION
        ? await apiGetOptedInMembers(organizationId, collection._id)
        : await apiGetSpeakerLabels(organizationId, collection._id)
    return entries.map((entry) => entry.name).filter(Boolean)
  } catch (error) {
    console.error("cannot load collection voices", error)
    return []
  }
}
