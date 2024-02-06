import Vue, { h } from "vue"
import AppEditorHighlightDescToolbox from "@/components/AppEditorHighlightDescToolbox.vue"

export default async function highlightRange(
  { range, category },
  isFromHighlight = true
) {
  // AppEditorHighlightDescToolbox
  const color = category.color || "yellow"
  let toolboxComponent = null

  let { startContainer, endContainer, startOffset, endOffset } = range

  let startWord = startContainer.children.item(startOffset)
  let endWord = endContainer.children.item(endOffset)

  if (!endWord) {
    highlightWord(
      startWord,
      color,
      range,
      category,
      isFromHighlight,
      this.$i18n
    )
    return
  }

  do {
    highlightWord(
      startWord,
      color,
      range,
      category,
      isFromHighlight,
      this.$i18n
    )
    startWord = startWord.nextSibling
  } while (startWord !== endWord)

  endWord.previousSibling.setAttribute("highlighted--last-word", "true")
}

function highlightWord(
  word,
  color,
  range,
  category,
  isFromHighlight = true,
  i18n
) {
  const wordHasToolbox = word.querySelector(
    ".conversation-highlight-toolbox.text-toolbox"
  )

  word.setAttribute("highlighted", "true")
  word.classList.add(`background-${color}-100`)

  let toolboxDiv = document.createElement("div")
  toolboxDiv.style.display = "inline"
  word.appendChild(toolboxDiv)
  if (isFromHighlight && !wordHasToolbox) {
    var toolbox = Vue.extend(AppEditorHighlightDescToolbox)
    new toolbox({
      i18n,
      propsData: { tag: range._tag, category },
    }).$mount(toolboxDiv)
  }
}
