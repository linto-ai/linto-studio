import Vue from "vue"
import AppEditorHighlightDescToolbox from "@/components/AppEditorHighlightDescToolbox.vue"

export default function highlightRange(
  { range, category },
  isFromHighlight = true
) {
  // AppEditorHighlightDescToolbox
  const color = category.color || "yellow"

  if (isFromHighlight) {
    var toolbox = Vue.extend(AppEditorHighlightDescToolbox)
    var toolboxComponent = new toolbox({
      i18n: this.$i18n,
      propsData: { tag: range._tag, category },
    }).$mount()
  }

  let { startContainer, endContainer, startOffset, endOffset } = range
  console.log(
    "highlightRange",
    startContainer,
    endContainer,
    startOffset,
    endOffset
  )
  let startWord = startContainer.children.item(startOffset)
  let endWord = endContainer.children.item(endOffset)

  if (!endWord) {
    startWord.setAttribute("highlighted", "true")
    startWord.classList.add(`background-${color}-100`)
    if (isFromHighlight) {
      startWord.appendChild(toolboxComponent.$el)
    }
    return
  }

  do {
    startWord.setAttribute("highlighted", "true")
    startWord.classList.add(`background-${color}-100`)
    if (isFromHighlight) {
      startWord.appendChild(toolboxComponent.$el)
    }
    startWord = startWord.nextSibling
  } while (startWord !== endWord)

  endWord.previousSibling.setAttribute("highlighted--last-word", "true")
}
