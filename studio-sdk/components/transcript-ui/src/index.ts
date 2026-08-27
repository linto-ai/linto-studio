// The batteries-included entry point: core + the UI kit + i18n. Nothing
// plugin-specific lives here — install plugins from their own package
// (@linto-ai/transcript-ui-plugin-*) so consumers only pay for what they use.
export * from '@linto-ai/transcript-ui-core'
export * from '@linto-ai/transcript-ui-ui'
export * from '@linto-ai/transcript-ui-i18n'
