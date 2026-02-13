/** Internal editor types — backend-agnostic */

export interface Word {
  id: string
  text: string
  startTime: number
  endTime: number
  confidence: number
}

export interface Turn {
  id: string
  speakerId: string
  text: string
  rawText: string
  words: Word[]
  startTime: number
  endTime: number
  language: string
}

export interface Speaker {
  id: string
  name: string
  color: string
}

export interface DocumentMetadata {
  title: string
  description: string
  duration: number
  audioFilename: string
  language: string
}

export interface EditorDocument {
  metadata: DocumentMetadata
  speakers: Map<string, Speaker>
  turns: Turn[]
}
