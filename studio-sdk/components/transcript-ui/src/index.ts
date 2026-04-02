// Core
export {
  createCore,
  provideCore,
  useCore,
} from './core'
export type {
  Core,
  CorePlugin,
  CoreEventMap,
  CoreOptions,
  CoreCapabilities,
  TranslationStore,
  ChannelStore,
  SpeakersStore,
  AudioPluginApi,
  TranscriptionEditorPluginApi,
  LivePluginApi,
  SubtitlePluginApi,
} from './core'

// Composant principal
export { default as Layout } from './components/Layout.vue'

// Plugins
export { createAudioPlugin } from './plugins/audio'
export { createTranscriptionEditorPlugin } from './plugins/transcriptionEditor'
export { createLivePlugin } from './plugins/live'
export type { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent } from './plugins/live'
export { createSubtitlePlugin } from './plugins/subtitle'
export type { SubtitlePluginOptions } from './plugins/subtitle'

// Adapter API LinTO
export { mapApiDocument } from './adapters/apiAdapter'

// Adapter WhisperX
export { mapWhisperXDocument } from './adapters/whisperXAdapter'

// i18n
export { provideI18n } from './i18n'
export type { Locale } from './i18n'

// Validation
export { validateEditorDocument, DocumentValidationError } from './utils'

// Types
export type { EditorDocument, Turn, Speaker, Word, Channel, Translation, AudioSource } from './types/editor'
export type { ApiDocument } from './types/api'
export type { WhisperXDocument } from './types/whisperx'
