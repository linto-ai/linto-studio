const TYPE = Object.freeze({
  "HIGHLIGHT": 'highlight',
  "KEYWORD": 'keyword',
  "CONVERSATION_METADATA": 'conversation_metadata',
  "CONVERSATION_TEXT": 'conversation_text',
  "COMMENTARY": 'commentary',

  // check if the type is valid
  checkValue: (type) => (type === TYPE.KEYWORD || type === TYPE.CONVERSATION_METADATA || type === TYPE.CONVERSATION_TEXT || type === TYPE.COMMENTARY)
})

module.exports = TYPE