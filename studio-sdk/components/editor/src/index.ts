// Core
export { createEditorCore, provideEditorCore, useEditorCore } from './core'
export type {
  EditorCore,
  EditorPlugin,
  EditorEventMap,
  EditorCoreOptions,
  EditorCapabilities,
  ChannelHandle,
  TranslationHandle,
  SpeakersHandle,
  AudioPluginApi,
  LivePluginApi,
  SubtitlePluginApi,
} from './core'

// Composant principal
export { default as EditorLayout } from './components/EditorLayout.vue'

// Plugins
export { createAudioPlugin } from './plugins/audio'
export { createLivePlugin } from './plugins/live'
export type { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent } from './plugins/live'
export { createSubtitlePlugin } from './plugins/subtitle'
export type { SubtitlePluginOptions } from './plugins/subtitle'

// Adapter API LinTO
export { mapApiDocument } from './adapters/apiAdapter'

// i18n
export { provideI18n } from './i18n'
export type { Locale } from './i18n'

// Validation
export { validateEditorDocument, DocumentValidationError } from './utils/validateDocument'

// Types
export type { EditorDocument, Turn, Speaker, Word, Channel, Translation, AudioSource } from './types/editor'
export type { ApiDocument } from './types/api'
