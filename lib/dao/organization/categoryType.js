const TYPE = Object.freeze({
  "HIGHLIGHT": 'highlight',
  "KEYWORD": 'keyword',
  "CONVERSATION_METADATA": 'conversation_metadata',
  "CONVERSATION_TEXT": 'conversation_text',
  "COMMENTARY": 'commentary',

  // check if the type is valid
  checkValue: (type) => (type === TYPE.KEYWORD || type === TYPE.CONVERSATION_METADATA || type === TYPE.CONVERSATION_TEXT || type === TYPE.COMMENTARY),
  desiredType: (type, categoryType) => {
    if (categoryType !== undefined) {
      if (type === TYPE.HIGHLIGHT && TYPE.HIGHLIGHT.includes(categoryType)) return true
      if (type === TYPE.KEYWORD && TYPE.KEYWORD.includes(categoryType)) return true
      if (type === TYPE.CONVERSATION_METADATA && TYPE.CONVERSATION_METADATA.includes(categoryType)) return true
      if (type === TYPE.CONVERSATION_TEXT && TYPE.CONVERSATION_TEXT.includes(categoryType)) return true
      if (type === TYPE.COMMENTARY && TYPE.COMMENTARY.includes(categoryType)) return true
    }
    return false
  }

})

module.exports = TYPE