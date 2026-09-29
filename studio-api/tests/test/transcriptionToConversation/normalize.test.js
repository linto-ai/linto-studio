const debug = require('debug')('linto:tests:test:transcriptionToConversation:normalize.test')

const cp = structuredClone
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

describe('normalize conversation segment from a reduced linstt transcription', () => {
  let mock_transcription
  let conversation
  const LANG = 'fr-FR'
  const DEFAULT_FILTER = { segmentCharSize: '2000' }

  beforeAll(async () => { })

  afterAll(async () => { })

  it('segment with no filter and rules of apostrophe (normalize-apostrophe-reduce)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-apostrophe-reduce.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-apostrophe-reduce.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })


  it('segment with no filter and rules of apostrophe (normalize-apostrophe)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-apostrophe.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-apostrophe.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of a chain number and a letter at the end (normalize-chain-number-end-letter)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-chain-number-end-letter.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-chain-number-end-letter.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of a chain number (normalize-chain-number)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-chain-number.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-chain-number.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of double punctuation (normalize-double-punctuation-reduce)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-double-punctuation-reduce.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-double-punctuation-reduce.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of double punctuation (normalize-double-punctuation)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-double-punctuation.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-double-punctuation.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with multiple-fail-rules (normalize-multiple-apostrophe)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-multiple-apostrophe.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-multiple-apostrophe.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of number (normalize-number-reduce)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-number-reduce.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-number-reduce.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of number (normalize-number)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-number.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-number.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of simple punctuation (normalize-simple-punctuation-reduce)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-simple-punctuation-reduce.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-simple-punctuation-reduce.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of simple punctuation (normalize-simple-punctuation)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-simple-punctuation.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-simple-punctuation.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with a special character "…"', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-special-character.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-special-character.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment where number have an number error on normlize', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-number-skip.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-number-skip.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it("segment with no filter and special character (normalize-special-dash)", () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-special-dash.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-special-dash.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of apostrophe (normalize-double-punctuation-first)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-double-punctuation-first.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-double-punctuation-first`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with no filter and rules of apostrophe (normalize-special-underscore)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-special-underscore.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-special-underscore`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with a weird apostrophe in is segment (normalize-space-after-word)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-apostrophe-space.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-apostrophe-space`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with punctuation-only tokens without timed word (normalize-orphan-punctuation)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-orphan-punctuation.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-orphan-punctuation.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment with punctuation-only tokens and non-breaking spaces, language auto (normalize-orphan-punctuation-ruleless)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-orphan-punctuation-ruleless.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-orphan-punctuation-ruleless.json`)

    const normalizeTranscription = segmentNormalizeText(mock_transcription, "*")
    normalizeTranscription.segments.map((segment, index_seg) => {
      testNormalize(conversation, segment, index_seg)
    })
    testTimeStamp(normalizeTranscription)
  })

  it('segment resize when the punctuation look-ahead reaches the last word (normalize-simple-punctuation, segmentCharSize)', () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-simple-punctuation.json`)
    const total_words = mock_transcription.segments.reduce((count, segment) => count + segment.words.length, 0)

    const filter_error = jest.spyOn(console, 'error').mockImplementation(() => { })
    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG, { ...DEFAULT_FILTER })
    expect(filter_error).not.toHaveBeenCalled()
    filter_error.mockRestore()

    const kept_words = normalizeTranscription.segments.reduce((count, segment) => count + segment.words.length, 0)
    expect(kept_words).toEqual(total_words)
    normalizeTranscription.segments.map((segment) => {
      expect(segment.segment).toEqual(segment.words.map((word) => word.word).join(" "))
    })
    testTimeStamp(normalizeTranscription)
  })
})

function testNormalize(conversation, segment, index_seg) {
  expect(segment.segment).toEqual(conversation.text[index_seg].segment)
  expect(segment.words.length).toEqual(conversation.text[index_seg].words.length)

  segment.words.map((words, index_word) => {
    expect(words.word).toEqual(conversation.text[index_seg].words[index_word].word)
  })
}

function testTimeStamp(normalize) {
  normalize.segments.map(segment => {
    for (let i = 0; i < segment.words.length - 1; i++) {
      expect(segment.words[i].end).toBeLessThanOrEqual(segment.words[i + 1].start)
    }
  })
}
// Builds a one-segment transcription: text as returned by the STT, timed words as [word, start, end]
function transcriptionOf(text, timed_words, start = timed_words[0]?.[1] ?? 0) {
  const words = timed_words.map(([word, word_start, word_end]) => ({ word, start: word_start, end: word_end, conf: 1 }))
  return {
    segments: [{
      start,
      end: words.at(-1)?.end ?? start,
      segment: text,
      raw_segment: words.map((word) => word.word).join(' '),
      words,
    }],
  }
}

function wordChars(text) {
  return text.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
}

function expectTextKept(input_text, normalized) {
  const output_text = normalized.segments.map((segment) => segment.words.map((word) => word.word).join(' ')).join(' ')
  expect(wordChars(output_text)).toEqual(wordChars(input_text))
}

function wordsOf(normalized) {
  return normalized.segments[0].words.map(({ word, start, end }) => [word, start, end])
}

describe.each(['fr-FR', '*'])('normalize text and timed words that do not split the same way (lang %s)', (lang) => {
  it('glued apostrophe spanning fewer timed words than apostrophes (c\' c\'est)', () => {
    const text = 'alors c\' c\'est bien'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['alors', 0, 0.4], ['c\'', 0.5, 0.6], ['c\'est', 0.7, 1], ['bien', 1.1, 1.4]]), lang)
    expect(wordsOf(normalized)).toEqual([['alors', 0, 0.4], ['c\'c\'est', 0.5, 1], ['bien', 1.1, 1.4]])
    expectTextKept(text, normalized)
    testTimeStamp(normalized)
  })

  it('glued apostrophe with digits and a following word (5\'-3\' pour, ST\' 501)', () => {
    const text = 'le brin 5\'-3\' pour Sous-titrage ST\' 501 merci'
    const normalized = segmentNormalizeText(transcriptionOf(text, [
      ['le', 0, 0.2], ['brin', 0.2, 0.5], ['5\'-3\'', 0.6, 1.2], ['pour', 1.3, 1.5],
      ['Sous-titrage', 2, 2.6], ['ST\'', 2.6, 2.8], ['501', 2.8, 3.2], ['merci', 3.5, 3.9],
    ]), lang)
    expect(wordsOf(normalized)).toEqual([
      ['le', 0, 0.2], ['brin', 0.2, 0.5], ['5\'-3\'pour', 0.6, 1.5],
      ['Sous-titrage', 2, 2.6], ['ST\'501', 2.6, 3.2], ['merci', 3.5, 3.9],
    ])
    expectTextKept(text, normalized)
  })

  it('long stutter glued into a single token', () => {
    const stutter = Array.from({ length: 12 }, (_, index) => ['qu\'', index * 0.1, index * 0.1 + 0.1])
    const text = `${stutter.map(([word]) => word).join(' ')} qu'on part demain`
    const normalized = segmentNormalizeText(transcriptionOf(text, [...stutter, ['qu\'on', 1.2, 1.4], ['part', 1.5, 1.8], ['demain', 1.9, 2.3]]), lang)
    expect(wordsOf(normalized)).toEqual([[`${'qu\''.repeat(12)}qu'on`, 0, 1.4], ['part', 1.5, 1.8], ['demain', 1.9, 2.3]])
    expectTextKept(text, normalized)
  })

  it('timed word already holding the apostrophe, token with trailing punctuation (s\'abstient?...)', () => {
    const text = 'qui s\'abstient?... C\'est bon'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['qui', 0, 0.2], ['s\'abstient', 0.3, 0.9], ['C\'est', 1.5, 1.7], ['bon', 1.7, 1.9]]), lang)
    expect(wordsOf(normalized)).toEqual([['qui', 0, 0.2], ['s\'abstient?...', 0.3, 0.9], ['C\'est', 1.5, 1.7], ['bon', 1.7, 1.9]])
    testTimeStamp(normalized)
  })

  it('question mark glued to a word keeps the word timing', () => {
    const text = 'tu t\'en vas? Tu reviens'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['tu', 0, 0.1], ['t\'en', 0.1, 0.3], ['vas', 0.3, 0.6], ['Tu', 1.2, 1.3], ['reviens', 1.3, 1.8]]), lang)
    expect(wordsOf(normalized)).toEqual([['tu', 0, 0.1], ['t\'en', 0.1, 0.3], ['vas?', 0.3, 0.6], ['Tu', 1.2, 1.3], ['reviens', 1.3, 1.8]])
  })

  it('punctuation glued to a timed symbol (25 %?)', () => {
    const text = 'ça coûte 25 %? Et après'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['ça', 0, 0.2], ['coûte', 0.2, 0.5], ['25', 0.6, 0.9], ['%', 0.9, 1.1], ['Et', 1.5, 1.6], ['après', 1.6, 2]]), lang)
    expect(wordsOf(normalized).map(([word]) => word)).toEqual(['ça', 'coûte', '25', '%?', 'Et', 'après'])
    expectTextKept(text, normalized)
  })

  it('tokens with no timed word that are not plain punctuation (② ③)', () => {
    const text = 'un deux. ② ③ Fertig! on continue'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['un', 0, 0.2], ['deux', 0.2, 0.5], ['Fertig', 1, 1.4], ['on', 1.5, 1.6], ['continue', 1.6, 2]]), lang)
    expect(wordsOf(normalized)).toEqual([['un', 0, 0.2], ['deux.', 0.2, 0.5], ['②', 0.5, 0.5], ['③', 0.5, 0.5], ['Fertig!', 1, 1.4], ['on', 1.5, 1.6], ['continue', 1.6, 2]])
    expectTextKept(text, normalized)
    testTimeStamp(normalized)
  })

  it('segment holding only punctuation is placed at the segment start, not at 0', () => {
    const normalized = segmentNormalizeText(transcriptionOf('...', [], 125.4), lang)
    expect(wordsOf(normalized)).toEqual([['...', 125.4, 125.4]])
  })
})

describe('normalize never loses text nor breaks timestamps', () => {
  it('digits in the text against words from the STT (Kaldi convert_numbers)', () => {
    const text = 'il a 25 ans, voilà'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['il', 0, 0.2], ['a', 0.2, 0.3], ['vingt', 0.4, 0.7], ['cinq', 0.7, 1], ['ans', 1, 1.3], ['voilà', 1.5, 1.9]]), 'fr-FR')
    expect(wordsOf(normalized)).toEqual([['il', 0, 0.2], ['a', 0.2, 0.3], ['25', 0.4, 1], ['ans,', 1, 1.3], ['voilà', 1.5, 1.9]])
  })

  it('one timed word split into two tokens shares its time', () => {
    const normalized = segmentNormalizeText(transcriptionOf('ma grand mère', [['ma', 0, 0.2], ['grand-mère', 0.2, 1.1]]), 'fr-FR')
    expect(wordsOf(normalized)).toEqual([['ma', 0, 0.2], ['grand', 0.2, 0.7], ['mère', 0.7, 1.1]])
  })

  it('overlapping and unordered STT timings come out monotonic', () => {
    const normalized = segmentNormalizeText(transcriptionOf('un deux trois quatre', [['un', 1, 2], ['deux', 1.5, 1.8], ['trois', 1.2, 1.1], ['quatre', 3, 4]]), 'fr-FR')
    expect(normalized.segments[0].words.map((word) => word.word)).toEqual(['un', 'deux', 'trois', 'quatre'])
    testTimeStamp(normalized)
  })

  it('missing STT timings do not produce NaN', () => {
    const normalized = segmentNormalizeText(transcriptionOf('un deux', [['un', undefined, undefined], ['deux', 1, 1.5]], 0.5), 'fr-FR')
    normalized.segments[0].words.forEach((word) => {
      expect(Number.isFinite(word.start)).toBe(true)
      expect(Number.isFinite(word.end)).toBe(true)
    })
    testTimeStamp(normalized)
  })

  it('segment text without any timed word is kept at the segment start', () => {
    const normalized = segmentNormalizeText(transcriptionOf('bonjour à tous', [], 42), '*')
    expect(wordsOf(normalized)).toEqual([['bonjour', 42, 42], ['à', 42, 42], ['tous', 42, 42]])
  })

  it('timed words with an empty text are kept', () => {
    const normalized = segmentNormalizeText(transcriptionOf('', [['bonjour', 0, 0.5]]), '*')
    expect(wordsOf(normalized)).toEqual([['bonjour', 0, 0.5]])
  })

  it('segment without raw_segment still gets one', () => {
    const transcription = transcriptionOf('bonjour', [['bonjour', 0, 0.5]])
    delete transcription.segments[0].raw_segment
    const normalized = segmentNormalizeText(transcription, '*')
    expect(normalized.segments[0].raw_segment).toEqual('bonjour')
  })

  it('word and char resize together keep every word and every raw word', () => {
    const timed = Array.from({ length: 50 }, (_, index) => [`mot${index}`, index, index + 0.5])
    const text = timed.map(([word], index) => (index % 7 === 6 ? `${word}.` : word)).join(' ')
    const normalized = segmentNormalizeText(transcriptionOf(text, timed), 'fr-FR', { segmentWordSize: 12, segmentCharSize: 20 })
    expect(normalized.segments.length).toBeGreaterThan(4)
    expectTextKept(text, normalized)
    expect(normalized.segments.map((segment) => segment.raw_segment).join(' ')).toEqual(timed.map(([word]) => word).join(' '))
    normalized.segments.forEach((segment) => {
      expect(segment.segment).toEqual(segment.words.map((word) => word.word).join(' '))
      expect(segment.raw_words).toBeUndefined()
    })
  })

  it('invalid resize sizes leave the segments whole', () => {
    const text = 'un deux trois'
    const normalized = segmentNormalizeText(transcriptionOf(text, [['un', 0, 1], ['deux', 1, 2], ['trois', 2, 3]]), 'fr-FR', { segmentWordSize: '0', segmentCharSize: 'abc' })
    expect(normalized.segments.length).toEqual(1)
    expectTextKept(text, normalized)
  })

  it('empty segments survive the resize', () => {
    const transcription = transcriptionOf('', [], 3)
    transcription.segments.push(transcriptionOf('bonjour à tous', [['bonjour', 4, 4.5], ['à', 4.5, 4.6], ['tous', 4.6, 5]]).segments[0])
    const normalized = segmentNormalizeText(transcription, 'fr-FR', { segmentCharSize: 5 })
    expect(normalized.segments.flatMap((segment) => segment.words.map((word) => word.word))).toEqual(['bonjour', 'à', 'tous'])
  })

  it('random text/word mismatches never lose a token nor break the timeline', () => {
    let seed = 12345
    const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)
    const pick = (list) => list[Math.floor(random() * list.length)]
    const vocabulary = ['qu\'', 'il', 'c\'est', 'aujourd\'hui', '25', '%', 'été', 'ST\'', '501', 'Œuvre', 'ça', 'l\'homme', '②', 'déjà-vu', 'OK']
    const punctuation = ['', '', '', ',', '.', '?', '...', ' ?', ' «', ' »', ' —']

    for (let run = 0; run < 300; run++) {
      let time = random() * 100
      const timed = []
      const tokens = []
      for (let index = 0; index < 1 + Math.floor(random() * 60); index++) {
        const word = pick(vocabulary)
        const start = time
        time += random() * 0.8
        if (random() > 0.05) timed.push([random() > 0.9 ? word.toUpperCase() : word, start, random() > 0.97 ? start - 1 : time])
        tokens.push(word + pick(punctuation))
      }
      if (random() > 0.8) tokens.splice(Math.floor(random() * tokens.length), 0, 'inventé')
      const text = tokens.join(random() > 0.7 ? ' ' : '  ')
      const expected = cleanedTokens(text)

      const normalized = segmentNormalizeText(transcriptionOf(text, timed, timed[0]?.[1] ?? 0), pick(['fr-FR', 'en-US', '*']), random() > 0.5 ? { segmentCharSize: 10 + Math.floor(random() * 40) } : {})
      const words = normalized.segments.flatMap((segment) => segment.words)
      expect(words.map((word) => word.word)).toEqual(expected)
      let previous_end = -Infinity
      words.forEach((word) => {
        expect(Number.isFinite(word.start) && Number.isFinite(word.end)).toBe(true)
        expect(word.start).toBeGreaterThanOrEqual(previous_end)
        expect(word.end).toBeGreaterThanOrEqual(word.start)
        previous_end = word.end
      })
    }
  })
})

// Tokens as the import sees them, after the LinSTT apostrophe cleanup
function cleanedTokens(text) {
  return text.replace(' \', ', '\'').replace(/' /g, '\'').split(/\s+/).filter(Boolean)
}
