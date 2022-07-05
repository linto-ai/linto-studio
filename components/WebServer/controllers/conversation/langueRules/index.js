const debug = require('debug')('linto:components:WebServer:controller:langueRules')

const frFr = require('./french')

function selectLang(lang) {
  if (lang === 'fr-FR')
    return frFr
  return undefined
}

function executeLangRule(lang, segment_text, words, loop_data) {
  const functionLangueArr = selectLang(lang)

  // if (!segment_text || !words || !loop_data) return {}

  for (let func of functionLangueArr) {
    let res = {}
    try {
      res = func(segment_text, words, loop_data)
    } catch (err) {
      debug(func.name)
      debug(err)
    }

    // handle different rules
    if (typeof res === 'object' && res.original !== undefined) {
      segment_text = res
    } else if (typeof res === 'object') {
      return res
    } else if (Array.isArray(res)) {
      return res
    }
  }
}


module.exports = {
  selectLang,
  executeLangRule
}