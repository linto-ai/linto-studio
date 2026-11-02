import { computeLanguageSelection } from "./computeLanguageSelection.js"
import { computeOfferedLanguageCodes } from "./computeOfferedLanguageCodes.js"
import { isEngineChangedBy } from "./isEngineChangedBy.js"

/**
 * Languages to offer for a draft, telling which ones would change the engine
 * once picked.
 * @param {object} draft
 * @param {object} catalog - see reconcileDraft
 * @returns {{ code: string, changesEngine: boolean }[]}
 */
export function computeLanguageOptions(draft, catalog) {
  return computeOfferedLanguageCodes(draft, catalog).map((code) => ({
    code,
    changesEngine:
      !draft.languages.includes(code) &&
      isEngineChangedBy(
        draft,
        {
          languages: computeLanguageSelection(draft.languages, [
            ...draft.languages,
            code,
          ]),
        },
        catalog,
      ),
  }))
}
