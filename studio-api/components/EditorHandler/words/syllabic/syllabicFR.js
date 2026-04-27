// Work based on:
// https://github.com/chrplr/openlexicon/blob/master/scripts/french-syllabation/syllabation.awk

const Syllabic = require("./syllabic")
const rulesFR = require("./rules/fr-FR")
const wordErrorFR = require("./dict/fr-FR-errored.json")

class SyllabicFR extends Syllabic {
  constructor(language = "fr-FR") {
    super(language)
  }

  count(term) {
    let wordInError = false
    let wordErrCount = 0
    for (const wordErr of wordErrorFR) {
      if (wordErr.indexOf(term) >= 0) {
        wordErrCount = wordErr[1]
        wordInError = true
      }
    }
    if (wordInError) {
      return wordErrCount
    }
    return this.syllabify(term).length
  }

  syllabify(term) {
    return syllabation(term)
  }
}

const v = ["a","à","â","e","é","è","ê","i","ï","î","o","ô","u","ü","û","y"]
const c = ["b","c","ç","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]

function getVC(word) {
  let result = ""
  word.split("").forEach((l) => {
    if (v.includes(l)) result += "v"
    if (c.includes(l)) result += "c"
  })
  return result
}

function getForm(form, base) {
  const match = [
    "bl","br","ch","cl","cr","dr","fl","fr","gh","gl","gn","gr","gu",
    "kl","kr","kh","kn","ph","pl","pr","rh","qu","tr","th","vr",
  ]
  const match2 = ["oo", "oé"]

  for (const m of match) form = replaceOn(form, base, m, "gg")
  for (const m of match2) form = replaceOn(form, base, m, "oo")
  return replaceOn(form, base, "gu", "gu")
}

function replaceOn(on, base, replace, by) {
  const re = new RegExp(replace, "g")
  const tab = on.split("")
  let m
  while ((m = re.exec(base)) !== null) {
    tab.splice(re.lastIndex, by.length, ...by.split(""))
  }
  return tab.join("")
}

function syllabation(term) {
  const form = getForm(getVC(term), term)
  const result = []
  const re = new RegExp(`(${rulesFR.join("|")})`, "g")
  const syl = form.match(re)
  let start = 0
  let end = 0
  if (syl !== null && syl.length > 0) {
    for (const s of syl) {
      end += s.length
      result.push(term.substring(start, end))
      start = end
    }
  }
  return result
}

module.exports = SyllabicFR
