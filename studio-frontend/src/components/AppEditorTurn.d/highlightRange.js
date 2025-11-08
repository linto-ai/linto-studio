import { h, createApp } from "vue"
import AppEditorHighlightDescToolbox from "@/components/AppEditorHighlightDescToolbox.vue"
import i18n from "@/i18n"

export default async function highlightRange(
  { range, category },
  { functionToHighlightWord = highlightWord, functionArgs = [] } = {}
) {
  // AppEditorHighlightDescToolbox
  const color = category.color || "yellow"
  let toolboxComponent = null

  let { startContainer, endContainer, startOffset, endOffset } = range

  let startWord = startContainer.children.item(startOffset)
  let endWord = endContainer.children.item(endOffset)
  let isFirstWord = true
  //console.log("start", startWord, "end", endWord)
  if (!endWord || startWord === endWord) {
    functionToHighlightWord(
      startWord,
      color,
      range,
      category,
      this.$i18n,
      { isLastWord: true, isFirstWord: true },
      ...functionArgs
    )
    startWord.setAttribute("highlighted--last-word", "true")
  } else {
    do {
      functionToHighlightWord(
        startWord,
        color,
        range,
        category,
        this.$i18n,
        { isLastWord: false, isFirstWord },
        ...functionArgs
      )
      isFirstWord = false
      startWord = startWord.nextSibling
    } while (startWord !== endWord)
    functionToHighlightWord(
      endWord,
      color,
      range,
      category,
      this.$i18n,
      { isLastWord: true, isFirstWord: false },
      ...functionArgs
    )
  }

  //highlightWord(startWord, color, range, category, isFromHighlight, this.$i18n)
}

function highlightWord(
  word,
  color,
  range,
  category,
  i18n,
  { isLastWord = false, isFirstWord = false } = {},
  isFromHighlight = true
) {
  const wordHasToolbox = word.querySelector(".conversation-highlight-toolbox")

  word.setAttribute("highlighted", "true")
  word.classList.add(`background-${color}-100`)

  if (isLastWord) {
    word.setAttribute("highlighted--last-word", "true")
  }

  if (isFirstWord) {
    word.setAttribute("highlighted--first-word", "true")
  }

  let toolboxDiv = document.createElement("div")
  toolboxDiv.style.display = "inline"
  word.appendChild(toolboxDiv)
  if (isFromHighlight && !wordHasToolbox) {
    // Vue 3: Use createApp instead of Vue.extend
    const app = createApp(AppEditorHighlightDescToolbox, {
      tag: range._tag,
      category,
    })
    app.use(i18n)
    app.mount(toolboxDiv)
  }
}
