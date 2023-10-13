const debug = require('debug')('linto:tests:linstt:normalize-number')

const cp = require('utils-copy')
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

describe('normalize conversation segment from a reduced linstt transcription for the number rules', () => {
  let mock_transcription
  let conversation
  const LANG = 'fr-FR'
  const DEFAULT_FILTER = { segmentCharSize: '2000' }

  beforeAll(async () => {
    mock_transcription = require(`${process.cwd()}/tests/data/transcription/reduce/normalize-number.json`)
    conversation = require(`${process.cwd()}/tests/data/conversation/normalize/reduce/conversation-number.json`)
  })

  afterAll(async () => {
  })

  it('segment with no filter and rules of number', () => {
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


