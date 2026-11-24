// The native app's folders holding audio files (see NativeFile in
// mobile/types/localRecording.ts).
export const NATIVE_AUDIO_FOLDERS = {
  // Where finished recordings wait to be sent, and stay when kept: the
  // system may clear the cache and the temporary folder.
  recordings: { directory: "DATA", path: "recordings" },
  // Where the recorder plugin writes while recording, per platform: its
  // own choice, not an option. Read in @capgo/capacitor-audio-recorder
  // 8.4.1 (pinned in package.json): getCacheDir() on Android,
  // temporaryDirectory on iOS. A plugin update may move it: the recorder
  // checks, at each stop, that the file is found where expected.
  recorder: {
    android: { directory: "CACHE", path: "capacitor-audio-recorder" },
    ios: { directory: "TEMPORARY", path: "CapacitorAudioRecorder" },
  },
}
