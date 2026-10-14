import { createAudioPlugin } from "@linto-ai/transcript-ui-webcomponent"
import {
  apiGetAudioFileFromConversation,
  apiGetAudioWaveFormFromConversation,
} from "@/api/conversation"

// The audio of a track, fetched through the API: the player plays an object
// URL and draws the waveform peaks.
export function buildAudioPlugin() {
  return createAudioPlugin({
    resolveSrc: resolveAudioSource,
    resolveWaveform: resolveAudioWaveform,
  })
}

// The plugin expects a rejection when there is nothing to play.
async function resolveAudioSource(source) {
  const res = await apiGetAudioFileFromConversation(source.src, false)
  if (res?.status !== "success" || !res.data || res.data.size === 0) {
    throw new Error("Audio unavailable")
  }
  return URL.createObjectURL(res.data)
}

async function resolveAudioWaveform(source) {
  const res = await apiGetAudioWaveFormFromConversation(source.src, false)
  if (res?.status !== "success" || !Array.isArray(res.data?.data)) return null
  return res.data.data
}
