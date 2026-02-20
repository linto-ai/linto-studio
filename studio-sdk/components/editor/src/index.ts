// Core
export { createEditorCore, provideEditorCore, useEditorCore } from './core'
export type { EditorCore, EditorPlugin, EditorEventMap, EditorCoreOptions, EditorCapabilities } from './core'

// Composant principal
export { default as EditorLayout } from './components/EditorLayout.vue'

// Plugins
export { createLivePlugin } from './plugins/live'
export type { LivePluginApi, LivePartialEvent, LiveFinalEvent, LiveTranslationEvent } from './plugins/live'

// Adapter API LinTO
export { mapApiDocument } from './adapters/apiAdapter'

// i18n
export { provideI18n } from './i18n'
export type { Locale } from './i18n'

// Types
export type { EditorDocument, Turn, Speaker, Word, Channel, DocumentMetadata } from './types/editor'
export type { ApiDocument } from './types/api'
