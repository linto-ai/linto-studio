/** Internal editor types — backend-agnostic */

export interface Word {
  id: string
  text: string
  startTime?: number
  endTime?: number
  confidence?: number
}

export interface Turn {
  id: string
  speakerId: string | null
  text: string | null // non-null when words is empty (live text-only), null otherwise
  words: Word[] // non-empty for word-level detail (ASR), empty when text is the source
  startTime?: number
  endTime?: number
  language: string
}

export interface Speaker {
  id: string
  name: string
  color: string
}

export interface AudioSource {
  src: string
  filename?: string
}

export interface Translation {
  id: string
  languages: string[] // ["fr", "en"] for source, ["es"] for auto-translation
  isSource: boolean
  audio?: AudioSource
  turns: Turn[]
}

export interface Channel {
  id: string
  name: string
  description?: string
  duration: number
  translations: Translation[] // at least 1 (the source)
}

export interface EditorDocument {
  title: string
  description?: string
  speakers: Map<string, Speaker>
  channels: Channel[]
}
