const {
  sanitizeWords,
  mergeDictionaries,
  withHotwords,
  MAX_WORD_LENGTH,
  MAX_WORDS_PER_DICTIONARY,
  MAX_WORDS_PER_TRANSCRIPTION,
} = require(`${process.cwd()}/lib/transcription/hotwords`)

function numbered(count, prefix = "word") {
  return Array.from({ length: count }, (_, index) => `${prefix}${index}`)
}

describe("sanitizeWords", () => {
  it("trims the words, keeps the phrases and drops the empty ones", () => {
    expect(sanitizeWords(["  LinTO ", "Au   revoir", "", "   "])).toEqual([
      "LinTO",
      "Au revoir",
    ])
  })

  it("drops the duplicates whatever the case, keeping the first spelling", () => {
    expect(sanitizeWords(["LinTO", "linto", "LINAGORA"])).toEqual([
      "LinTO",
      "LINAGORA",
    ])
  })

  it("refuses what is not a list of strings", () => {
    expect(sanitizeWords("LinTO")).toBeNull()
    expect(sanitizeWords(undefined)).toBeNull()
    expect(sanitizeWords(["LinTO", 3])).toBeNull()
  })

  it("refuses a word holding a comma", () => {
    expect(sanitizeWords(["LinTO, LINAGORA"])).toBeNull()
  })

  it("refuses a word that is too long", () => {
    expect(sanitizeWords(["a".repeat(MAX_WORD_LENGTH)])).toHaveLength(1)
    expect(sanitizeWords(["a".repeat(MAX_WORD_LENGTH + 1)])).toBeNull()
  })

  it("refuses too many words", () => {
    expect(sanitizeWords(numbered(MAX_WORDS_PER_DICTIONARY))).toHaveLength(
      MAX_WORDS_PER_DICTIONARY,
    )
    expect(sanitizeWords(numbered(MAX_WORDS_PER_DICTIONARY + 1))).toBeNull()
  })

  it("accepts an empty list", () => {
    expect(sanitizeWords([])).toEqual([])
  })
})

describe("mergeDictionaries", () => {
  it("joins the words of the dictionaries in order, without duplicates", () => {
    expect(
      mergeDictionaries([
        { words: ["LinTO", "LINAGORA"] },
        { words: ["linto", "Twake"] },
        {},
      ]),
    ).toEqual(["LinTO", "LINAGORA", "Twake"])
  })

  it("keeps the first words when there are too many", () => {
    const merged = mergeDictionaries([
      { words: numbered(MAX_WORDS_PER_DICTIONARY, "a") },
      { words: numbered(MAX_WORDS_PER_DICTIONARY, "b") },
      { words: numbered(MAX_WORDS_PER_DICTIONARY, "c") },
    ])
    expect(merged).toHaveLength(MAX_WORDS_PER_TRANSCRIPTION)
    expect(merged[0]).toBe("a0")
    expect(merged.at(-1)).toBe(`b${MAX_WORDS_PER_DICTIONARY - 1}`)
  })

  it("returns no word without dictionary", () => {
    expect(mergeDictionaries([])).toEqual([])
  })
})

describe("withHotwords", () => {
  const hotwords = ["LinTO", "LINAGORA"]

  it("sends the words to a model applying hotwords", () => {
    expect(withHotwords({}, { model_type: "whisper" }, hotwords)).toEqual({
      hotwords,
    })
    expect(
      withHotwords({}, { model_type: "qwen3_asr" }, hotwords).hotwords,
    ).toEqual(hotwords)
  })

  it("leaves them out for a model that does not", () => {
    for (const model_type of ["cohere", "kaldi"]) {
      expect(withHotwords({}, { model_type }, hotwords)).toEqual({})
    }
  })

  it("replaces the hotwords written in the client's config", () => {
    const fromClient = { language: "fr", hotwords: "injected" }
    const whisper = { model_type: "whisper" }
    expect(withHotwords(fromClient, whisper, [])).toEqual({ language: "fr" })
    expect(withHotwords(fromClient, whisper, hotwords).hotwords).toEqual(
      hotwords,
    )
    expect(fromClient.hotwords).toBe("injected")
  })
})
