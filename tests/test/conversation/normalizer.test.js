const cp = require('utils-copy')
const Normalizer = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalize`)

describe('initialzation conversation', () => {
  let MOCK_TRANSCRIPTION_NO_PUNC, MOCK_TRANSCRIPTION_PUNC

  beforeAll(async () => {
    MOCK_TRANSCRIPTION_NO_PUNC = require('../../data/transcription/mock-trans-no-punc.json')
    MOCK_TRANSCRIPTION_PUNC = require('../../data/transcription/mock-trans-punc.json')
  })

  afterAll(async () => {
  })

  it('should not alter an transcription without punctuation', () => {
    let transcription = cp(MOCK_TRANSCRIPTION_NO_PUNC)
    transcription = Normalizer.normalizeTranscription(transcription)

    expect(transcription).not.toBe(MOCK_TRANSCRIPTION_NO_PUNC)
    expect(transcription.segments[0].words).toEqual(transcription.segments[0].raw_words)
  })

  it('should alter an transcription without punctuation', () => {
    let transcription = cp(MOCK_TRANSCRIPTION_PUNC)

    transcription = Normalizer.normalizeTranscription(transcription)
    expect(transcription).not.toBe(MOCK_TRANSCRIPTION_PUNC)
    expect(transcription.segments[0].words).not.toBe(transcription.segments[0].raw_words)
    expect(transcription.segments[0].words[4].word.includes(',')).toEqual(true)
  })
})


