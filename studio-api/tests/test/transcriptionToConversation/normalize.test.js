const debug = require('debug')('linto:tests:linstt:normalize-double-apostrophe-reduce')

const cp = require('utils-copy')
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