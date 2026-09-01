// Core
export {
  createCore,
  provideCore,
  useCore,
  CROSS_TRANSLATION_ID,
} from './core'
export type {
  Core,
  CorePlugin,
  CoreEventMap,
  CoreOptions,
  CoreCapabilities,
  UISlot,
  TurnEventKey,
  ReadableTranslation,
  TranslationInfo,
  TurnStore,
  TranslationStore,
  ChannelStore,
  SpeakersStore,
  AudioPluginApi,
  TranscriptionEditorPluginApi,
  TurnLock,
  TurnUpdate,
  WireTurn,
  TurnSplit,
  TurnsMerged,
  TurnDeleted,
  TurnSpeakerUpdated,
  SpeakerRenamed,
  SpeakerReplaced,
  SpeakerRestored,
  LivePluginApi,
  LivePartialEventData,
  LiveFinalEventData,
  LiveTranslationEventData,
  SubtitlePluginApi,
  WatermarkPluginApi,
  WatermarkToken,
  LLMService,
  LLMServiceInit,
  LLMServiceStatus,
  LLMServiceVersion,
  LLMServiceGeneration,
  LLMServiceGenerationStatus,
  LLMServicesPluginApi,
  ChatRole,
  ChatMessage,
  ChatSession,
  ChatPluginApi,
} from './core'

// Composant "clé en main" — crée son propre core, fournit l'i18n, gère
// loading/error, rend Layout. C'est lui qu'on branche dans un hôte (Web
// Component ou app Vue directe) sans réimplémenter cette plomberie.
export { default as TranscriptUI } from './components/TranscriptUI.vue'

// Composant principal (rendu par TranscriptUI ; utile seul pour qui gère
// déjà son propre core/i18n/loading)
export { default as Layout } from './components/Layout.vue'

// Composants utilisés par le wrapper Web Component pour l'injection de
// styles dans le Shadow DOM
export { default as SpeakerLabel } from './components/SpeakerLabel.vue'
export { default as SpeakerPopover } from './components/molecules/SpeakerPopover.vue'
export { useEditorReady } from './composables/useEditorReady'

// Adapter API LinTO
export { mapApiDocument } from './adapters/apiAdapter'
export { mapApiTurns } from './adapters/mapApiTurns'

// Adapter WhisperX
export { mapWhisperXDocument } from './adapters/whisperXAdapter'

// Validation
export { validateEditorDocument, DocumentValidationError } from './utils'

// Low-level helpers plugins may need (time/lang formatting, waveform, word timing…)
export * as utils from './utils'

// Pure store-mutation helpers (speaker/turn ops) shared by core UI and the
// transcriptionEditor plugin
export * as helpers from './core/helpers'

// Types
export type { EditorDocument, Turn, Speaker, Word, Channel, Translation, AudioSource } from './types/editor'
export type { ApiDocument } from './types/api'
export type { WhisperXDocument } from './types/whisperx'
