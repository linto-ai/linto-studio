<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue"
import {
  TranscriptUI,
  mapApiDocument,
  mapWhisperXDocument,
  type Core,
  type ChatMessage,
  type ChatSession,
  type ApiDocument,
  type Channel,
  type Speaker,
  type WhisperXDocument,
} from "@linto/transcript-ui-core"
import { createAudioPlugin } from "@linto/transcript-ui-plugin-audio"
import { createTranscriptionEditorPlugin } from "@linto/transcript-ui-plugin-transcription-editor"
import { createLLMServicesPlugin } from "@linto/transcript-ui-plugin-llm-services"
import { createChatPlugin } from "@linto/transcript-ui-plugin-chat"
//import { createLivePlugin } from "@linto/transcript-ui-plugin-live"
//import { createSubtitlePlugin } from "@linto/transcript-ui-plugin-subtitle"
import type { LivePartialEvent, LiveFinalEvent } from "@linto/transcript-ui-plugin-live"

// TranscriptUI owns its core (creation, i18n, loading/error overlay,
// destroy-on-unmount) — we just reach into it once mounted to activate
// plugins and load the demo document.
const editorRef = useTemplateRef<InstanceType<typeof TranscriptUI>>("editor")
let core!: Core

// ── Mock chat integration (simulates the host: REST + SSE) ────────────
//
// In production this lives in studio-frontend's chatIntegration service.
// Here we fake an in-memory "DB" and a token-by-token streamed reply so the
// drawer can be exercised end to end.

function setupChatMock(): void {
  if (!core.chat) return
  const chat = core.chat

  interface MockSession {
    session: ChatSession
    messages: ChatMessage[]
  }

  const db: MockSession[] = [
    {
      session: { id: "s1", title: "Résumé de la réunion" },
      messages: [
        {
          id: "m1",
          role: "user",
          content: "Résume les points clés de cette réunion.",
        },
        {
          id: "m2",
          role: "assistant",
          content:
            "Voici les **points clés** :\n\n" +
            "1. Périmètre fonctionnel validé la semaine dernière\n" +
            "2. Design system quasiment finalisé\n" +
            "3. Blocage côté back sur l'API de transcription\n\n" +
            "> Prochaine étape : prioriser le bug de synchronisation.",
        },
      ],
    },
    {
      session: { id: "s2", title: "Questions sur le budget" },
      messages: [],
    },
  ]

  let seq = 0
  const newId = (prefix: string): string => `${prefix}-${++seq}-${Date.now()}`

  const REPLY_MARKDOWN =
    "Bonne question. Voici ce que je retiens de la transcription :\n\n" +
    "- **Charge réseau** au-dessus des prévisions pendant les pics\n" +
    "- Trois pistes envisagées dont le **cache distribué**\n" +
    "- Migration prévue la semaine prochaine\n\n" +
    "```js\n// invalidation à revoir si cache distribué\ncache.invalidate(key)\n```\n\n" +
    "Tu veux que je détaille un point ?"

  function streamReply(): void {
    chat.streamStart()
    const tokens = REPLY_MARKDOWN.match(/\s+|\S+/g) ?? [REPLY_MARKDOWN]
    let i = 0
    const tick = (): void => {
      if (i >= tokens.length) {
        chat.streamEnd(REPLY_MARKDOWN, { tokenCount: tokens.length })
        const active = db.find((d) => d.session.id === chat.activeSessionId.value)
        if (active) {
          active.messages.push({
            id: newId("a"),
            role: "assistant",
            content: REPLY_MARKDOWN,
          })
        }
        return
      }
      chat.streamAppend(tokens[i]!)
      i++
      setTimeout(tick, 25)
    }
    setTimeout(tick, 300)
  }

  core.on("chat:loadSessions", () => {
    chat.setSessions(db.map((d) => d.session))
  })

  core.on("chat:loadSession", ({ sessionId }) => {
    chat.setActiveSession(sessionId)
    chat.setLoadingSession(true)
    // Simulate the history fetch latency so the spinner is visible.
    setTimeout(() => {
      const entry = db.find((d) => d.session.id === sessionId)
      chat.setMessages(entry ? [...entry.messages] : [])
      chat.setLoadingSession(false)
    }, 600)
  })

  core.on("chat:createSession", () => {
    const entry: MockSession = {
      session: { id: newId("s"), title: "Nouvelle conversation" },
      messages: [],
    }
    db.unshift(entry)
    chat.setSessions(db.map((d) => d.session))
    chat.setActiveSession(entry.session.id)
    chat.setMessages([])
  })

  core.on("chat:renameSession", ({ sessionId, title }) => {
    const entry = db.find((d) => d.session.id === sessionId)
    if (entry) entry.session.title = title
    chat.updateSessionTitle(sessionId, title)
  })

  core.on("chat:deleteSession", ({ sessionId }) => {
    const idx = db.findIndex((d) => d.session.id === sessionId)
    if (idx !== -1) db.splice(idx, 1)
    chat.setSessions(db.map((d) => d.session))
    if (chat.activeSessionId.value === sessionId) {
      chat.setActiveSession(null)
      chat.setMessages([])
    }
  })

  core.on("chat:send", ({ content }) => {
    // Create a session on first send if none is active.
    let entry = db.find((d) => d.session.id === chat.activeSessionId.value)
    if (!entry) {
      entry = {
        session: { id: newId("s"), title: content.slice(0, 30) },
        messages: [],
      }
      db.unshift(entry)
      chat.setSessions(db.map((d) => d.session))
      chat.setActiveSession(entry.session.id)
      chat.setMessages([])
    } else if (entry.messages.length === 0) {
      // Auto-name the session from the first user message.
      entry.session.title = content.slice(0, 30)
      chat.updateSessionTitle(entry.session.id, entry.session.title)
    }

    const userMessage: ChatMessage = {
      id: newId("u"),
      role: "user",
      content,
    }
    entry.messages.push(userMessage)
    chat.addMessage(userMessage)
    streamReply()
  })
}

// ── Mock LLM services demo ────────────────────────────────────────────

const SUMMARY_MARKDOWN =
  "Here is the structured response in French, following your instructions:\n---\n## Thèmes discutés\n- **Détérioration psychologique ou émotionnelle**\n- **Routine et expérience quotidienne négative**\n## Mots-clés\n- Descente progressive\n- Souffrance\n- Perdition\n- État (négatif)\n- Jour (quotidien)\n## Plan détaillé\n### **Détérioration psychologique ou émotionnelle**\n- Descente progressive\n- Souffrance\n- Perdition\n- État (négatif)\n### **Routine et expérience quotidienne négative**\n- Jour (quotidien)\n---\n## Rapport\n### **Détérioration psychologique ou émotionnelle**\n- **Descente progressive** : Les échanges décrivent une dégradation continue de l’état mental ou émotionnel, évoquant une spirale négative qui s’aggrave avec le temps.\n- **Souffrance** : Ce thème central reflète une expérience douloureuse, qu’elle soit physique, psychologique ou existentielle, vécue de manière répétée ou chronique.\n- **Perdition** : Le terme suggère une perte de repères, une dérive ou un sentiment d’aliénation, comme si la personne ou le groupe concerné était en train de se \"perdre\".\n- **État (négatif)** : L’accent est mis sur un état général de détresse, de désespoir ou d’épuisement, sans perspective d’amélioration immédiate.\n### **Routine et expérience quotidienne négative**\n- **Jour (quotidien)** : La répétition des jours est présentée comme un facteur aggravant, où chaque journée contribue à renforcer un sentiment de fatalité ou de stagnation dans la souffrance.\n---\n## Plan d’action\n1. **Évaluation et soutien psychologique**\n   - Identifier les causes sous-jacentes de cette \"descente progressive\" (stress professionnel, isolement, etc.) via des entretiens individuels ou des enquêtes anonymes.\n   - Mettre en place un système de soutien psychologique (cellule d’écoute, partenariats avec des professionnels) pour les personnes concernées.\n2. **Briser la routine négative**\n   - Organiser des ateliers ou des activités collectives pour rompre la monotonie et redonner un sens positif au quotidien (ex. : projets collaboratifs, pauses bien-être).\n   - Encourager des pratiques de gratitude ou de mindfulness pour rééquilibrer la perception des journées.\n3. **Prévention et sensibilisation**\n   - Former les managers et les équipes à repérer les signes de souffrance ou de perdition chez leurs collègues (ex. : changements de comportement, absentéisme).\n   - Diffuser des ressources internes (guides, webinaires) sur la gestion du stress et la résilience.\n4. **Suivi et amélioration continue**\n   - Créer un groupe de travail dédié pour évaluer l’efficacité des mesures mises en place et ajuster les actions en fonction des retours.\n   - Instaurer des points réguliers avec les équipes pour mesurer l’évolution du climat émotionnel et adapter les solutions.\n---\n*Note : Ce plan d’action est générique et doit être adapté au contexte spécifique de l’organisation (taille, secteur, culture d’entreprise, etc.).*"

const KEYPOINTS_MARKDOWN = `# Points clés

- **Charge réseau** au-dessus des prévisions pendant les pics
- **Cache distribué** : 3 pistes envisagées, dont la mise en cache distribuée
- **Migration** prévue la semaine prochaine — backend prêt
- **Risque** : revoir le schéma d'invalidation si on choisit le cache distribué (~2 semaines)
`

function setupLLMMock(): void {
  if (!core.llmServices) return

  // Register with EMPTY content first — content arrives later via setContent.
  // This mirrors the host's flow (gateway fetch after mount) and may
  // reproduce the list-toggle ghost bug.
  core.llmServices.register({
    id: "compte-rendu",
    label: "Compte rendu",
    content: "",
    status: "complete",
    lastUpdate: Date.now() - 2 * 60 * 1000,
  })
  core.llmServices.register({
    id: "points-cles",
    label: "Points clés",
    content: "",
    status: "complete",
    lastUpdate: Date.now() - 12 * 60 * 1000,
  })

  // Push content async to simulate the gateway fetch lag.
  setTimeout(() => {
    core.llmServices?.setContent("compte-rendu", SUMMARY_MARKDOWN, Date.now())
    core.llmServices?.setContent("points-cles", KEYPOINTS_MARKDOWN, Date.now())
  }, 300)

  core.on("llmService:regenerate", ({ id }) => {
    if (!core.llmServices) return
    console.log("[demo] regenerate", id)
    core.llmServices.setStatus(id, "processing")
    let progress = 0
    const interval = setInterval(() => {
      progress += 15
      if (progress >= 100) {
        clearInterval(interval)
        core.llmServices?.setContent(
          id,
          `${id === "compte-rendu" ? SUMMARY_MARKDOWN : KEYPOINTS_MARKDOWN}\n\n*Régénéré ${new Date().toLocaleTimeString()}*`,
        )
        core.llmServices?.setStatus(id, "complete")
      } else {
        core.llmServices?.setProgress(id, progress, "analyzing")
      }
    }, 400)
  })

  core.on("llmService:export", ({ id }) => {
    console.log("[demo] export", id)
  })
}

// ── History simulation ───────────────────────────────────────────────

const HISTORY_SENTENCES = [
  "On a validé le périmètre fonctionnel la semaine dernière.",
  "Le design system est quasiment finalisé.",
  "Il reste quelques ajustements sur les couleurs.",
  "L'intégration avec l'API de recherche est en cours.",
  "On devrait pouvoir livrer la première version d'ici vendredi.",
]

let historyPageCount = 0
const MAX_HISTORY_PAGES = 3
let historyTime = 0 // will be set after document load
let historyTurnCounter = 0
let unsubScrollTop: (() => void) | undefined

function startHistorySimulation() {
  if (!core.live) return

  // Set initial historyTime before the first turn of the document
  const channel = core.activeChannel.value
  if (!channel) return
  const sourceTr = channel.activeTranslation.value
  const firstTurn = sourceTr.turns.value[0]
  historyTime = firstTurn?.startTime ?? 0

  channel.hasMoreHistory.value = true

  unsubScrollTop = core.on("scroll:top", () => {
    if (historyPageCount >= MAX_HISTORY_PAGES) return

    channel.isLoadingHistory.value = true

    setTimeout(() => {
      const events: LiveFinalEvent[] = []
      const pageSize = HISTORY_SENTENCES.length

      for (let i = pageSize - 1; i >= 0; i--) {
        historyTurnCounter++
        const text = HISTORY_SENTENCES[i]!
        const words = text.split(" ")
        const duration = words.length * 0.4
        const turnEnd = historyTime - 0.5
        const turnStart = turnEnd - duration

        events.unshift({
          turnId: `history-turn-${historyTurnCounter}`,
          speakerId: SPEAKERS[i % SPEAKERS.length]!,
          text,
          words: words.map((w, j) => ({
            id: `hw-${historyTurnCounter}-${j}`,
            text: w,
            startTime: turnStart + j * 0.4,
            endTime: turnStart + (j + 1) * 0.4,
            confidence: 0.9,
          })),
          startTime: turnStart,
          endTime: turnEnd,
          language: "fr",
        })

        historyTime = turnStart
      }

      core.live!.prependFinalBatch(events, "ch-1")
      historyPageCount++

      channel.isLoadingHistory.value = false
      if (historyPageCount >= MAX_HISTORY_PAGES) {
        channel.hasMoreHistory.value = false
      }
    }, 800)
  })
}

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
  if (!core.live) return
  const live = core.live

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
      const partial: LivePartialEvent = { text: partialText, language: "fr" }
      live.onPartial(partial, channelId)

      // Next word after a short delay
      liveTimer = setTimeout(sendPartial, 200 + Math.random() * 300)
    }

    sendPartial()
  }

  // Start after a short delay
  liveTimer = setTimeout(simulateSentence, 500)
}

// ── Activate plugins, then load the demo document ─────────────────────

onMounted(async () => {
  core = editorRef.value!.core

  core.use(createAudioPlugin())
  core.use(createTranscriptionEditorPlugin())
  core.use(createLLMServicesPlugin())
  core.use(createChatPlugin())
  //core.use(createLivePlugin())
  //core.use(createSubtitlePlugin())

  setupChatMock()
  setupLLMMock()
  core.on("verbatim:export", ({ format }) => {
    console.log("[demo] verbatim export", format)
  })

  try {
    const [r1, r2] = await Promise.all([
      fetch("/projet-libre-openstreetmap.json"),
      fetch("/projet-libre-openstreetmap_whisperx.json"),
    ])
    const [raw1, raw2]: [ApiDocument, WhisperXDocument] = await Promise.all([
      r1.json(),
      r2.json(),
    ])
    const doc1 = mapApiDocument(raw1)
    const doc2 = mapWhisperXDocument(raw2)

    // Merge speakers from both documents
    const speakers = new Map<string, Speaker>(doc1.speakers)
    for (const [id, speaker] of doc2.speakers) {
      if (!speakers.has(id)) speakers.set(id, speaker)
    }

    // Add live speakers
    speakers.set("spk-live-1", {
      id: "spk-live-1",
      name: "Alice (live)",
      color: "#42A5F5",
    })
    speakers.set("spk-live-2", {
      id: "spk-live-2",
      name: "Bob (live)",
      color: "#66BB6A",
    })
    speakers.set("spk-live-3", {
      id: "spk-live-3",
      name: "Charlie (live)",
      color: "#FFA726",
    })

    const sourceTr1 = doc1.channels[0]!.translations[0]!

    const ch1: Channel = {
      id: "ch-1",
      name: "Canal 1",
      duration: doc1.channels[0]!.duration,
      translations: [
        {
          ...sourceTr1,
          audio: { src: "/projet-libre-openstreetmap.mp3" },
          isSource: true,
        },
        //{ ...sourceTr1, isSource: true },
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

    core.setDocument({
      title: doc1.title,
      date: doc1.date ?? "2026-04-24",
      speakers,
      channels: [ch1, ch2],
    })

    // Start live simulation on channel 1
    startLiveSimulation("ch-1")
    startHistorySimulation()
  } catch (e) {
    // TranscriptUI doesn't yet expose a way to report a load failure into
    // its own error overlay (Core has no "report error" entry point) — this
    // is a dev fixture, so console is enough for now.
    console.error("[playground] failed to load the demo document", e)
  }
})

onBeforeUnmount(() => {
  if (liveTimer) clearTimeout(liveTimer)
  unsubScrollTop?.()
  // core.destroy() is TranscriptUI's own responsibility, not ours.
})
</script>

<template>
  <TranscriptUI ref="editor" locale="fr" />
</template>
