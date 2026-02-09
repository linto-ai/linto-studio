import test from "ava"
import { countSyllabsFromWord } from "../countSyllabsFromWord.js"
import SyllabicFR from "@/lib/syllabic/syllabicFR.js"

const syllabicFr = new SyllabicFR("fr-FR")

test("Count syllabes for french word", (t) => {
  t.is(countSyllabsFromWord("bonjour", syllabicFr), 2)
})

test("Return true number of syllabe for french word known as error", (t) => {
  t.is(countSyllabsFromWord("étymologiste", syllabicFr), 5)
})
