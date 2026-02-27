import type fr from './fr'

const en: Record<keyof typeof fr, string> = {
  'editor.loading': 'Loading\u2026',
  'editor.loadError': 'Loading error',
  'header.export': 'Export',
  'header.settings': 'Settings',
  'header.openSidebar': 'Open panel',
  'header.closeSidebar': 'Close panel',
  'sidebar.channel': 'Channel',
  'sidebar.speakers': 'Speakers',
  'player.play': 'Play',
  'player.pause': 'Pause',
  'player.skipBack': 'Skip back 10 seconds',
  'player.skipForward': 'Skip forward 10 seconds',
  'player.volume': 'Volume',
  'player.mute': 'Mute',
  'player.unmute': 'Unmute',
  'player.speed': 'Playback speed',
  'transcription.resumeScroll': 'Resume follow',
  'header.channelLabel': 'Select a channel',
  'sidebar.language': 'Language',
  'sidebar.languageLabel': 'Transcription language',
  'sidebar.originalLanguage': 'original',
  'language.wildcard': 'Multilingual',
}

export default en
