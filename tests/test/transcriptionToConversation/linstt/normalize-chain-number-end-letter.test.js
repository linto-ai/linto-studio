const debug = require('debug')('linto:tests:linstt:normalize-chain-number-en-letter')

const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

describe('normalize conversation segment from a linstt transcription for a chained number with a letter at the end', () => {
  let mock_transcription
  let conversation
  const LANG = 'fr-FR'
  const DEFAULT_FILTER = { segmentCharSize: '2000' }

  beforeAll(async () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-chain-number-end-letter.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-chain-number-end-letter.json`)
  })

  afterAll(async () => {
  })

  it('segment with no filter and rules of a chain number and a letter at the end', () => {
    const normalizeTranscription = segmentNormalizeText(mock_transcription, LANG)

    normalizeTranscription.segments.map((segment, index_seg) => {
      expect(segment.segment).toEqual(conversation.text[index_seg].segment)
      expect(segment.words.length).toEqual(conversation.text[index_seg].words.length)
      
      segment.words.map((words, index_word) => {
        expect(words.word).toEqual(conversation.text[index_seg].words[index_word].word)
      })
    })
    })
  })


