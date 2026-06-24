const {
  findIndexSplit,
} = require(`${process.cwd()}/components/EditorHandler/words/findIndexSplit`)

describe("findIndexSplit", () => {
  test("get index when cut between two words", () => {
    expect(findIndexSplit(["hello", "world", "nice", "day"], "hello")).toEqual(0)
  })

  test("get index when cut inside a word", () => {
    expect(
      findIndexSplit(["hello", "world", "nice", "day"], "hello world ni"),
    ).toEqual(2)
  })

  test("get index when cut first word", () => {
    expect(findIndexSplit(["hello", "world", "nice", "day"], "hel")).toEqual(0)
  })

  test("get index when cut on last word", () => {
    expect(
      findIndexSplit(["hello", "world", "nice", "day"], "hello world nice da"),
    ).toEqual(3)
  })

  test("get index when some word contains spaces", () => {
    expect(
      findIndexSplit(
        ["hello ?", "world", "nice day", "isn't", "it"],
        "hello ? world nice",
      ),
    ).toEqual(2)
  })

  test("get index with empty words", () => {
    expect(
      findIndexSplit(
        ["hello ?", "world", "", "nice day", "isn't", "it"],
        "hello ? world nice",
      ),
    ).toEqual(3)
  })
})
