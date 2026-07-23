const {
  alignWords,
} = require(`${process.cwd()}/components/EditorHandler2/utils/align`)
const {
  tokenize,
} = require(`${process.cwd()}/components/EditorHandler2/utils/tokenize`)

function words(spec) {
  return spec.map(([word, stime, etime], i) => ({
    word,
    stime,
    etime,
    wid: `w${i}`,
    confidence: 0.9,
  }))
}

describe("alignWords", () => {
  test("identical sequences: every token carries its word", () => {
    const tokens = tokenize("bonjour tout le monde")
    const old = words([
      ["bonjour", 0, 0.8],
      ["tout", 0.9, 1.1],
      ["le", 1.1, 1.2],
      ["monde", 1.2, 1.7],
    ])
    expect(alignWords(tokens, old)).toEqual([
      {
        text: "bonjour",
        charStart: 0,
        charEnd: 7,
        stime: 0,
        etime: 0.8,
        wid: "w0",
        confidence: 0.9,
      },
      {
        text: "tout",
        charStart: 8,
        charEnd: 12,
        stime: 0.9,
        etime: 1.1,
        wid: "w1",
        confidence: 0.9,
      },
      {
        text: "le",
        charStart: 13,
        charEnd: 15,
        stime: 1.1,
        etime: 1.2,
        wid: "w2",
        confidence: 0.9,
      },
      {
        text: "monde",
        charStart: 16,
        charEnd: 21,
        stime: 1.2,
        etime: 1.7,
        wid: "w3",
        confidence: 0.9,
      },
    ])
  })

  test("edited token gets no entry, neighbours still matched", () => {
    const tokens = tokenize("bonjour toutt le monde")
    const old = words([
      ["bonjour", 0, 0.8],
      ["tout", 0.9, 1.1],
      ["le", 1.1, 1.2],
      ["monde", 1.2, 1.7],
    ])
    const carried = alignWords(tokens, old)
    expect(carried.map((e) => e.text)).toEqual(["bonjour", "le", "monde"])
    expect(carried.map((e) => e.wid)).toEqual(["w0", "w2", "w3"])
    // Offsets come from the CURRENT tokens, not the old layout.
    expect(carried[1]).toMatchObject({ charStart: 14, charEnd: 16 })
  })

  test("LCS handles repeated tokens", () => {
    const tokens = tokenize("a b a b")
    const old = words([
      ["b", 0, 1],
      ["a", 1, 2],
      ["b", 2, 3],
    ])
    const carried = alignWords(tokens, old)
    // LCS length 3: tokens 1,2,3 match old words 0,1,2 in order.
    expect(carried).toEqual([
      { text: "b", charStart: 2, charEnd: 3, stime: 0, etime: 1, wid: "w0", confidence: 0.9 },
      { text: "a", charStart: 4, charEnd: 5, stime: 1, etime: 2, wid: "w1", confidence: 0.9 },
      { text: "b", charStart: 6, charEnd: 7, stime: 2, etime: 3, wid: "w2", confidence: 0.9 },
    ])
  })

  test("empty inputs yield no entries", () => {
    expect(alignWords([], words([["a", 0, 1]]))).toEqual([])
    expect(alignWords(tokenize("a"), [])).toEqual([])
  })

  test("huge inputs fall back to prefix/suffix anchors", () => {
    // 2100 x 2100 > the LCS cell budget: only the common prefix and common
    // suffix are matched, the differing middle is left for interpolation.
    const N = 2100
    const texts = []
    for (let i = 0; i < N; i++) texts.push(`w${i}`)
    const tokens = tokenize(texts.join(" "))
    const old = texts.map((t, i) =>
      i >= 1000 && i < 1100
        ? { word: `x${i}`, stime: i, etime: i + 1, wid: `w${i}` }
        : { word: t, stime: i, etime: i + 1, wid: `w${i}` },
    )

    const carried = alignWords(tokens, old)
    expect(carried).toHaveLength(N - 100)
    // Prefix matched in place.
    expect(carried[999].text).toBe("w999")
    expect(carried[999].stime).toBe(999)
    // Middle unmatched: next entry is the suffix.
    expect(carried[1000].text).toBe("w1100")
    expect(carried[1000].stime).toBe(1100)
    expect(carried[carried.length - 1].text).toBe(`w${N - 1}`)
  })
})
