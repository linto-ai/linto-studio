// Work based on :
//https://github.com/chrplr/openlexicon/blob/master/scripts/french-syllabation/syllabation.awk

// This tool "trie" to compute the syllabic form of a word
import Syllabic from "./syllabic.js"
import rulesFR from "./rules/fr-FR.js"
import wordErrorFR from "./dict/fr-FR-errored.json" with { type: "json" }

export default class syllabicFR extends Syllabic {
  constructor(language = "fr-FR") {
    super(language)
  }

  count(term) {
    // return syllabic form of term
    let wordInError = false
    let wordErrCount = 0
    for (let wordErr of wordErrorFR) {
      if (wordErr.indexOf(term) >= 0) {
        wordErrCount = wordErr[1]
        wordInError = true
      }
    }
    if (wordInError) {
      return wordErrCount
    } else {
      return this.syllabify(term).length
    }
  }

  syllabify(term) {
    return syllabation(term)
  }
}

const v = [
  "a",
  "à",
  "â",
  "e",
  "é",
  "è",
  "ê",
  "i",
  "ï",
  "î",
  "o",
  "ô",
  "u",
  "ü",
  "û",
  "y",
]
const c = [
  "b",
  "c",
  "ç",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "z",
]

const getVC = (word) => {
  let result = ""
  word.split("").forEach((l) => {
    if (v.includes(l)) {
      result += "v"
    }

    if (c.includes(l)) {
      result += "c"
    }
  })
  return result
}

const getForm = (form, base) => {
  let match = [
    "bl",
    "br",
    "ch",
    "cl",
    "cr",
    "dr",
    "fl",
    "fr",
    "gh",
    "gl",
    "gn",
    "gr",
    "gu",
    "kl",
    "kr",
    "kh",
    "kn",
    "ph",
    "pl",
    "pr",
    "rh",
    "qu",
    "tr",
    "th",
    "vr",
  ]
  let match2 = ["oo", "oé"]

  for (let i = 0; i < match.length; i++) {
    form = replaceOn(form, base, match[i], "gg")
  }

  for (let i = 0; i < match2.length; i++) {
    form = replaceOn(form, base, match2[i], "oo")
  }

  return replaceOn(form, base, "gu", "gu")
}

const replaceOn = (on, base, replace, by) => {
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
    for (let i = 0; i < syl.length; i++) {
      end += syl[i].length
      result.push(term.substring(start, end))
      start = end
    }
  }
  return result
}
