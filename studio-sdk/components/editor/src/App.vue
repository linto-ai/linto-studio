<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import EditorLayout from "./components/EditorLayout.vue"
import { mapApiDocument } from "./adapters/apiAdapter"
import { provideI18n, type Locale } from "./i18n"
import { createEditorCore, provideEditorCore } from "./core"
//import { createAudioPlugin } from "./plugins/audio"
import { createLivePlugin } from "./plugins/live"
import { createSubtitlePlugin } from "./plugins/subtitle"
import type { LivePartialEvent, LiveFinalEvent } from "./plugins/live"
import type { ApiDocument } from "./types/api"
import type { Channel, Speaker } from "./types/editor"

const locale = ref<Locale>("fr")
const { t } = provideI18n(locale)

const editor = createEditorCore()
//editor.use(createAudioPlugin())
editor.use(createLivePlugin())
editor.use(createSubtitlePlugin())
provideEditorCore(editor)

const error = ref<string | null>(null)
const loading = ref(true)

// ── Live POC: simulate partials + finals ──────────────────────────────

const SENTENCES = [
  "Bonjour à tous, merci d'être présents pour cette réunion.",
  "On va commencer par le point sur le sprint en cours.",
  "Les développements front avancent bien, on est à 80% du périmètre.",
  "Par contre côté back, on a un blocage sur l'API de transcription.",
  "Il faudrait qu'on priorise la correction du bug de synchronisation.",
  "Est-ce que quelqu'un a des questions avant qu'on passe au point suivant ?",
  "Très bien, on enchaîne avec la démo du nouvel éditeur.",
]

const SPEAKERS = ["spk-live-1", "spk-live-2", "spk-live-3"]

let liveTimer: ReturnType<typeof setTimeout> | undefined
let turnCounter = 0
let currentTime = 0

function startLiveSimulation(channelId: string) {
  if (!editor.live) return
  const live = editor.live

  let sentenceIdx = 0

  function simulateSentence() {
    if (sentenceIdx >= SENTENCES.length) {
      // Loop back
      sentenceIdx = 0
    }

    const fullText = SENTENCES[sentenceIdx]!
    const words = fullText.split(" ")
    const speakerId = SPEAKERS[sentenceIdx % SPEAKERS.length]!
    let wordIdx = 0

    function sendPartial() {
      if (wordIdx >= words.length) {
        // Send final
        turnCounter++
        const turnStart = currentTime
        const turnEnd = currentTime + words.length * 0.4

        const finalEvent: LiveFinalEvent = {
          turnId: `live-turn-${turnCounter}`,
          speakerId,
          text: fullText,
          words: words.map((w, i) => ({
            id: `w-${turnCounter}-${i}`,
            text: w,
            startTime: turnStart + i * 0.4,
            endTime: turnStart + (i + 1) * 0.4,
            confidence: 0.85 + Math.random() * 0.15,
          })),
          startTime: turnStart,
          endTime: turnEnd,
          language: "fr",
        }

        live.onFinal(finalEvent, channelId)
        currentTime = turnEnd + 0.5

        sentenceIdx++
        // Wait before next sentence
        liveTimer = setTimeout(simulateSentence, 1500 + Math.random() * 1000)
        return
      }

      // Build partial text up to current word
      wordIdx++
      const partialText = words.slice(0, wordIdx).join(" ")
      const partial: LivePartialEvent = { text: partialText }
      live.onPartial(partial, channelId)

      // Next word after a short delay
      liveTimer = setTimeout(sendPartial, 200 + Math.random() * 300)
    }

    sendPartial()
  }

  // Start after a short delay
  liveTimer = setTimeout(simulateSentence, 500)
}

// ── Load document then start simulation ───────────────────────────────

onMounted(async () => {
  try {
    const [r1, r2] = await Promise.all([
      fetch("/test.json"),
      fetch("/test2.json"),
    ])
    const [raw1, raw2]: [ApiDocument, ApiDocument] = await Promise.all([
      r1.json(),
      r2.json(),
    ])
    const doc1 = mapApiDocument(raw1)
    const doc2 = mapApiDocument(raw2)

    // Merge speakers from both documents
    const speakers = new Map<string, Speaker>(doc1.speakers)
    for (const [id, speaker] of doc2.speakers) {
      if (!speakers.has(id)) speakers.set(id, speaker)
    }

    // Add live speakers
    speakers.set("spk-live-1", { id: "spk-live-1", name: "Alice (live)", color: "#42A5F5" })
    speakers.set("spk-live-2", { id: "spk-live-2", name: "Bob (live)", color: "#66BB6A" })
    speakers.set("spk-live-3", { id: "spk-live-3", name: "Charlie (live)", color: "#FFA726" })

    const sourceTr1 = doc1.channels[0]!.translations[0]!

    const ch1: Channel = {
      id: "ch-1",
      name: "Canal 1",
      duration: doc1.channels[0]!.duration,
      translations: [
        // { ...sourceTr1, audio: { src: "/chat-gpt-dans-le-texte.mp3" } },
        { ...sourceTr1, isSource: true },
        {
          id: "tr-en",
          languages: ["en"],
          isSource: false,
          turns: sourceTr1.turns,
        },
        {
          id: "tr-de",
          languages: ["de"],
          isSource: false,
          turns: sourceTr1.turns,
        },
      ],
    }

    const sourceTr2 = doc2.channels[0]!.translations[0]!

    const ch2: Channel = {
      id: "ch-2",
      name: "Canal 2",
      duration: doc2.channels[0]!.duration,
      translations: [
        {
          ...sourceTr2,
          //audio: { src: "/Comment peut-on atteindre ses fins.mp3" },
        },
      ],
    }

    editor.setDocument({
      title: doc1.title,
      speakers,
      channels: [ch1, ch2],
    })
    loading.value = false

    // Start live simulation on channel 1
    startLiveSimulation("ch-1")
  } catch (e) {
    error.value = e instanceof Error ? e.message : t("editor.loadError")
    loading.value = false
  }
})

onUnmounted(() => {
  if (liveTimer) clearTimeout(liveTimer)
  editor.destroy()
})
</script>

<template>
  <div v-if="error" class="error-state">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="loading" class="loading-state">
    <p>{{ t("editor.loading") }}</p>
  </div>
  <EditorLayout v-else />
</template>

<style scoped>
.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
}

.error-state {
  color: #e53935;
}
</style>
