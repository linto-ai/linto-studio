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
  //console.log("start", startWord, "end", endWord)
  if (!endWord || startWord === endWord) {
    highlightWord(
      startWord,
      color,
      range,
      category,
      isFromHighlight,
      this.$i18n
    )
    startWord.setAttribute("highlighted--last-word", "true")
  } else {
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
    highlightWord(endWord, color, range, category, isFromHighlight, this.$i18n)
    endWord.setAttribute("highlighted--last-word", "true")
  }

  //highlightWord(startWord, color, range, category, isFromHighlight, this.$i18n)
}

function highlightWord(
  word,
  color,
  range,
  category,
  isFromHighlight = true,
  i18n
) {
  const wordHasToolbox = word.querySelector(".conversation-highlight-toolbox")

  word.setAttribute("highlighted", "true")
  word.classList.add(`background-${color}-100`)

  let toolboxDiv = document.createElement("div")
  toolboxDiv.style.display = "inline"
  word.appendChild(toolboxDiv)
  if (isFromHighlight && !wordHasToolbox) {
    var toolbox = Vue.extend(AppEditorHighlightDescToolbox)
    // find how to listen to the event, workaround for now is to use the global event bus
    new toolbox({
      i18n,
      propsData: {
        tag: range._tag,
        category,
      },
    }).$mount(toolboxDiv)
  }
}
