import test from "ava"

/* Regex Firstname and Lastname */

const regexNames = new RegExp("^[ a-zA-ZÀ-ÿ-’'.]+$", "g")

test("test regex on valid simple name", (t) => {
  let txt = "Jean Pierre"
  t.not(txt.match(regexNames), null)
})

test("test regex on valid simple name with '-' + accents ", (t) => {
  let txt = "Jean-Pierre Lorré"
  t.not(txt.match(regexNames), null)
})

test("test regex on valid complex name with ", (t) => {
  let txt = "Romano D'Angelo Saint-andré"
  t.not(txt.match(regexNames), null)
})

test("test regex on invalid names", (t) => {
  let txt = "Romain&a Lopez"
  let txt3 = "Romain!a Lopze?"
  t.is(txt.match(regexNames), null)
  t.is(txt3.match(regexNames), null)
})

/* Regex Title/descriptions */
const regexContent = new RegExp(
  "^[ a-zA-ZÀ-ÿ0-9-’'&@#*/._!?;,:$€\"()+=]+$",
  "g"
)

test("test regex on simple content", (t) => {
  let txt = "Ceci est un titre"
  t.not(txt.match(regexContent), null)
})

test("test regex on simple content with special char", (t) => {
  let txt = "Ceci est un contenu: comment-allez vous?"
  let txt2 = "Ceci est (je précise) un contneu bizarre"
  let txt3 = "1 + 1 = 2"
  let txt4 = '"entre guillemets"'
  let txt5 = "portet/garonne"
  t.not(txt.match(regexContent), null)
  t.not(txt2.match(regexContent), null)
  t.not(txt3.match(regexContent), null)
  t.not(txt4.match(regexContent), null)
  t.not(txt5.match(regexContent), null)
})

test("test regex on simple content with invalid char", (t) => {
  let txt = "<div>Ceci est un contenu: comment-allez vous?</div>"
  let txt2 = "Je suis un contenu non valide: <script> alert('hello')</script>"
  let txt3 = "Je suis un contenu non valide^"
  let txt4 = "Je suis un contenu non valide | a bon ?"
  t.is(txt.match(regexContent), null)
  t.is(txt2.match(regexContent), null)
  t.is(txt3.match(regexContent), null)
  t.is(txt4.match(regexContent), null)
})
