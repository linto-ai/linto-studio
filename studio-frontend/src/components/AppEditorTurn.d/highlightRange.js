import Vue from "vue"
import AppEditorHighlightDescToolbox from "@/components/AppEditorHighlightDescToolbox.vue"

export default async function highlightRange(
  { range, category },
  isFromHighlight = true
) {
  // AppEditorHighlightDescToolbox
  const color = category.color || "yellow"
  let toolboxComponent = null
  var toolbox = Vue.extend(AppEditorHighlightDescToolbox)

  let { startContainer, endContainer, startOffset, endOffset } = range

  let startWord = startContainer.children.item(startOffset)
  let endWord = endContainer.children.item(endOffset)

  if (!endWord) {
    startWord.setAttribute("highlighted", "true")
    startWord.classList.add(`background-${color}-100`)
    if (isFromHighlight) {
      startWord.appendChild(
        new toolbox({
          i18n: this.$i18n,
          propsData: { tag: range._tag, category },
        }).$mount().$el
      )
      await Vue.nextTick()
    }
    return
  }

  do {
    startWord.setAttribute("highlighted", "true")
    startWord.classList.add(`background-${color}-100`)
    if (isFromHighlight) {
      startWord.appendChild(
        new toolbox({
          i18n: this.$i18n,
          propsData: { tag: range._tag, category },
        }).$mount().$el
      )
      //await Vue.nextTick()
    }
    startWord = startWord.nextSibling
  } while (startWord !== endWord)

  endWord.previousSibling.setAttribute("highlighted--last-word", "true")
}
