/** Types mirroring the backend API JSON format */

export interface ApiWord {
  wid: string
  stime: number
  etime: number
  word: string
  confidence: number
}

export interface ApiTurn {
  speaker_id: string
  turn_id: string
  segment: string
  raw_segment: string
  words: ApiWord[]
  language: string
}

export interface ApiSpeaker {
  speaker_id: string
  speaker_name: string
  stime: number
  etime: number
}

export interface ApiAudioMetadata {
  filename: string
  duration: number
  mimetype: string
  filepath: string
}

export interface ApiMetadata {
  transcription: {
    lang: string
    confidence: number
  }
  audio: ApiAudioMetadata
}

export interface ApiDocument {
  name: string
  description: string
  speakers: ApiSpeaker[]
  text: ApiTurn[]
  metadata: ApiMetadata
}
