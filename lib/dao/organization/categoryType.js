const TYPE = Object.freeze({
  "HIGHLIGHT": 'highlight',
  "KEYWORD": 'keyword',
  "CONVERSATION_METADATA": 'conversation_metadata',
  "CONVERSATION_TEXT": 'conversation_text',
  "COMMENTARY": 'commentary',

  // check if the type is valid
  checkValue: (type) => (type === TYPE.KEYWORD || type === TYPE.CONVERSATION_METADATA || type === TYPE.CONVERSATION_TEXT || type === TYPE.COMMENTARY),
  desiredType: (type, categoryType) => {
    switch (true) {
      case type === undefined: return false
      case categoryType === undefined: return true
      case type === TYPE.HIGHLIGHT && categoryType.includes(TYPE.HIGHLIGHT):
      case type === TYPE.KEYWORD && categoryType.includes(TYPE.KEYWORD):
      case type === TYPE.CONVERSATION_METADATA && categoryType.includes(TYPE.CONVERSATION_METADATA):
      case type === TYPE.CONVERSATION_TEXT && categoryType.includes(TYPE.CONVERSATION_TEXT):
      case type === TYPE.COMMENTARY && categoryType.includes(TYPE.COMMENTARY):
        return true
      default:
        return false
    }
  }

})

module.exports = TYPE