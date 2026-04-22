# Architecture de l'éditeur

Éditeur de transcription collaboratif en Vue 3, distribué en package NPM et en Web Component. Le coeur est agnostique : pas de fetch, pas de WebSocket. Toute communication externe passe par les plugins.

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│  App hôte (Vue 2.7 ou Vue 3)                                   │
│                                                                 │
│   <linto-editor>   ou   <EditorLayout />                        │
│         │                      │                                │
│         ▼                      ▼                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  EditorCore                                             │    │
│  │                                                         │    │
│  │  State (Refs)          Events (bus)       Plugins       │    │
│  │  ├─ document           ├─ turn:add        ├─ audio      │    │
│  │  ├─ activeChannelId    ├─ turn:update      ├─ live       │    │
│  │  └─ capabilities       ├─ turn:remove      └─ subtitle   │    │
│  │                        ├─ speaker:*                      │    │
│  │  Handles               ├─ channel:change                │    │
│  │  ├─ activeChannel      ├─ translation:*                  │    │
│  │  └─ speakers           └─ destroy                        │    │
│  │                                                         │    │
│  │  Mutations (fonctions pures, sans effet de bord)        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Couches

Le code est organisé en 5 couches, du plus bas niveau au plus haut :

```
Composants Vue  ← UI, scoped CSS, template
     ↑
Composables     ← Logique réactive liée au DOM (scroll, audio, mobile)
     ↑
Plugins         ← Features optionnelles (audio, live, subtitles)
     ↑
Handles         ← Accesseurs réactifs sur le state (channel, translation, speakers)
     ↑
Core            ← State (Refs), Event Bus, Mutations (pures)
```

**Règle** : chaque couche ne dépend que de celles en dessous. Les composants ne connaissent pas les mutations directement — ils passent par les handles.

## Modèle de données

```
EditorDocument
├── title: string
├── description?: string
├── speakers: Map<string, Speaker>
│   └── Speaker { id, name, color }
└── channels: Channel[]
    └── Channel { id, name, description?, duration }
        └── translations: Translation[]
            └── Translation { id, languages[], isSource, audio? }
                └── turns: Turn[]
                    └── Turn { id, speakerId, text, words[], startTime?, endTime?, language }
                        └── Word { id, text, startTime?, endTime?, confidence? }
```

### Convention text / words

Un turn a **soit** du texte brut, **soit** des mots timestampés, jamais les deux :

| Cas | `text` | `words` |
|-----|--------|---------|
| Transcription avec timestamps | `null` | `Word[]` (non vide) |
| Texte brut (traduction, résumé) | `"string"` | `[]` (vide) |

Si `words` est non vide, le texte affiché est reconstruit par `words.map(w => w.text).join(" ")`.

Les timestamps du turn (`startTime`, `endTime`) sont dérivés du premier et dernier mot quand les mots ont des timestamps.

## Core

### Création

```typescript
const editor = createEditorCore({
  document?: EditorDocument,    // document initial (optionnel)
  activeChannelId?: string,     // canal actif (défaut : premier)
  capabilities?: { text: "edit" | "view", speakers: "edit" | "view" }
})
```

Le core expose :

| Propriété | Type | Description |
|-----------|------|-------------|
| `document` | `Ref<EditorDocument>` | Le document complet |
| `activeChannelId` | `Ref<string>` | ID du canal actif |
| `capabilities` | `Ref<EditorCapabilities>` | Permissions |
| `activeChannel` | `ChannelHandle` | Accès au canal actif |
| `speakers` | `SpeakersHandle` | Gestion des locuteurs |
| `audio?` | `AudioPluginApi` | Slot plugin audio |
| `live?` | `LivePluginApi` | Slot plugin live |
| `subtitle?` | `SubtitlePluginApi` | Slot plugin sous-titres |

### Event bus

Bus synchrone in-memory. Les handlers sont appelés dans l'ordre d'inscription.

```typescript
// S'abonner (retourne une fonction de désinscription)
const unsub = editor.on("turn:add", ({ turn, translationId }) => { ... })

// Émettre
editor.emit("turn:add", { turn, translationId: "tr-1" })

// Se désinscrire
unsub()
```

**Événements disponibles :**

| Événement | Payload | Déclenché par |
|-----------|---------|---------------|
| `channel:change` | `{ channelId }` | `setActiveChannel()` |
| `translation:change` | `{ translationId \| null }` | `setActiveTranslation()` |
| `turn:add` | `{ turn, translationId }` | `addTurn()` |
| `turn:update` | `{ turn, translationId }` | `updateTurn()`, `updateWords()` |
| `turn:remove` | `{ turnId, translationId }` | `removeTurn()` |
| `speaker:add` | `{ speaker }` | `speakers.ensure()` |
| `speaker:update` | `{ speaker }` | `speakers.update()` |
| `translation:sync` | `{ translationId }` | `setTurns()` |
| `channel:sync` | `{ channelId }` | `setChannel()` |
| `destroy` | `void` | `destroy()` |

## Handles

Les handles sont des accesseurs réactifs qui encapsulent la navigation dans le document et les mutations sur les turns/speakers.

### ChannelHandle

Accède au canal actif et à sa traduction active.

```typescript
editor.activeChannel.data                    // ComputedRef<Channel>
editor.activeChannel.activeTranslation       // ActiveTranslationHandle
editor.activeChannel.setActiveTranslation(id | null)
```

**Convention** : `setActiveTranslation(null)` sélectionne la traduction source (celle avec `isSource: true`). L'ID de la source n'est jamais stocké — `null` signifie toujours "source".

### ActiveTranslationHandle

Étend `TranslationHandle` avec un `on()` scopé : les événements sont filtrés par `translationId`, donc seuls les événements concernant la traduction active sont reçus.

```typescript
const handle = editor.activeChannel.activeTranslation

handle.data          // ComputedRef<Translation>
handle.turns         // ComputedRef<Turn[]>
handle.addTurn(turn)
handle.updateTurn(turnId, patch)
handle.removeTurn(turnId)
handle.updateWords(turnId, words)
handle.setTurns(turns)        // remplacement complet (sync)

// Écoute scopée — ne reçoit que les événements de CETTE traduction
handle.on("turn:add", ({ turn }) => { ... })
```

### SpeakersHandle

```typescript
editor.speakers.all                    // ComputedRef<Map<string, Speaker>>
editor.speakers.ensure(speakerId)      // crée si absent, ignore si existe
editor.speakers.update(speakerId, { name: "Marie" })
```

Les couleurs sont auto-assignées depuis une palette de 10 couleurs (Tableau) à la création. L'index est `speakers.size % 10`.

### withTranslation()

Pour accéder à une traduction spécifique (pas forcément l'active) :

```typescript
// Traduction active du canal actif
const handle = editor.withTranslation()

// Traduction spécifique d'un canal spécifique
const handle = editor.withTranslation({ channelId: "ch-2", translationId: "tr-fr" })
```

Retourne `null` si la cible n'existe pas. Le handle retourné est un `TranslationHandle` (sans `on()` scopé).

## Mutations

Fonctions pures dans `src/core/mutations/`. Elles prennent un état, retournent un nouvel état. Aucun effet de bord.

```typescript
// Turns
insertTurn(turns, turn)                    // → [...turns, turn]
patchTurn(turns, turnId, patch)            // → { turns, updated } | null
removeTurn(turns, turnId)                  // → turns | null
updateTurnWords(turns, turnId, words)      // → { turns, updated } | null

// Speakers
addSpeaker(speakers, id, name)             // → Speaker (mute la Map)
ensureSpeaker(speakers, id, name?)         // → Speaker | null
updateSpeaker(speakers, id, patch)         // → Speaker | null

// Lookup
findChannel(channels, id)                  // → Channel (fallback: premier)
findSourceTranslation(channel)             // → Translation (isSource ou premier)
findActiveTranslation(channel, id | null)  // → Translation
resolveTranslation(doc, channel, target?)  // → Translation (cross-canal)
```

`updateTurnWords` recalcule automatiquement `startTime`/`endTime` du turn à partir des timestamps du premier et dernier mot, et met `text` à `null`.

## Plugins

Un plugin est un objet `{ name, install(core) }`. `install` retourne optionnellement une fonction de cleanup.

```typescript
const plugin: EditorPlugin = {
  name: "mon-plugin",
  install(core) {
    const unsub = core.on("turn:add", ({ turn }) => { ... })
    return () => unsub()  // cleanup
  }
}

editor.use(plugin)
```

### Audio (`createAudioPlugin`)

Fournit l'interface entre le core et le player audio (WaveSurfer).

```
core.audio.currentTime    // Ref<number> — temps courant en secondes
core.audio.isPlaying      // Ref<boolean>
core.audio.src            // ComputedRef<string | null> — URL audio de la traduction active
core.audio.seekTo(time)   // saute à un temps donné
core.audio.setSeekHandler(fn)  // le player enregistre son callback ici
```

### Live (`createLivePlugin`)

Réception des événements de transcription temps réel.

```
core.live.partial         // ShallowRef<string | null> — texte interim
core.live.hasLiveUpdate   // Ref<boolean>
core.live.onPartial(event, channelId)   // met à jour le partial
core.live.onFinal(event, channelId)     // crée/met à jour un turn finalisé
core.live.onTranslation(event)          // placeholder (non implémenté)
```

**Flux live :**

```
Backend  ──partial──▶  onPartial()  ──▶  partial.value = "Bonjour à t..."
         ──partial──▶  onPartial()  ──▶  partial.value = "Bonjour à tous"
         ──final────▶  onFinal()    ──▶  addTurn({ words, timing })
                                         partial.value = null
```

Le partial est effacé après un `onFinal` ou après un changement de canal/traduction. Sur les événements de sync (`translation:sync`, `channel:sync`), l'effacement est différé de 150ms pour éviter un flash visuel.

### Subtitle (`createSubtitlePlugin`)

Contrôle l'affichage des sous-titres (canvas).

```
core.subtitle.fontSize      // Ref<number> (défaut 40)
core.subtitle.isVisible     // Ref<boolean>
core.subtitle.isFullscreen  // Ref<boolean>
core.subtitle.enterFullscreen()
core.subtitle.exitFullscreen()
```

Le rendu est assuré par `SubtitleScroller` (classe canvas), piloté par le composable `useSubtitleScroller` qui connecte les événements live au scroller.

## Composables

| Composable | Rôle | Dépendances |
|------------|------|-------------|
| `useAudioPlayer` | Wrapper WaveSurfer : waveform, régions speakers, contrôles | WaveSurfer.js |
| `useAutoScroll` | Scroll automatique vers le turn/mot actif | MutationObserver, throttle |
| `useSubtitleScroller` | Connecte SubtitleScroller aux événements live | SubtitleScroller, EditorCore |
| `useIsMobile` | Détecte le breakpoint mobile (767px) | MediaQueryList |

### useAutoScroll — marqueurs DOM

Le scroll automatique repose sur des attributs `data-*` posés par les composants :

| Attribut | Posé par | Rôle |
|----------|----------|------|
| `data-word-active` | `TranscriptionTurn.vue` | Mot actuellement joué (prioritaire) |
| `data-turn-active` | `TranscriptionTurn.vue` | Turn actif (fallback si pas de mot) |
| `data-reka-scroll-area-viewport` | Reka UI ScrollArea | Viewport de scroll (cible du listener) |

Le composable observe les changements de ces attributs via `MutationObserver` et scrolle vers l'élément actif (centré verticalement, smooth ou instant selon `prefers-reduced-motion`).

Le suivi est désactivé si l'utilisateur scrolle à plus de 150px du bas du viewport. Un bouton "Reprendre le suivi" appelle `resumeFollow()`.

## Arbre des composants

```
EditorLayout
├── EditorHeader                  # Titre, badges langue/durée, actions
├── TranscriptionPanel            # Zone scrollable
│   ├── TranscriptionTurn[]       # Un turn = speaker + texte/mots
│   │   └── SpeakerLabel          # Avatar, nom, timestamp, langue
│   └── TranscriptionTurn         # Turn partiel (live, texte interim)
├── SpeakerSidebar (desktop)      # Sidebar droite
│   ├── ChannelSelector           # Sélecteur de canal (si > 1)
│   ├── SidebarSelect             # Sélecteur de traduction (si > 1)
│   ├── Liste des speakers        # Nom + indicateur couleur
│   └── Sous-titres               # Toggle + slider taille police
├── SidebarDrawer (mobile)        # Dialog pour la sidebar
├── AudioPlayer                   # Waveform + contrôles (sticky bottom)
│   └── AudioPlayerControls       # Play, skip, volume, vitesse
├── SubtitleBanner                # Canvas sous-titres (bandeau)
└── SubtitleFullscreen            # Canvas sous-titres (plein écran)
```

## Adapter API

`mapApiDocument(raw: ApiDocument) → EditorDocument`

Transforme le format JSON du backend LinTO en `EditorDocument` :

```
ApiDocument                         EditorDocument
├── name                    →       ├── title
├── speakers[]              →       ├── speakers: Map (couleur vide, remplie par ensure())
├── text[] (turns)          →       └── channels: [{ id: "default", ... }]
│   ├── turn_id             →           └── translations: [{ isSource: true, ... }]
│   ├── speaker_id          →               └── turns[]
│   └── words[]             →                   └── words[]
│       ├── wid → id                                ├── id
│       ├── word → text                             ├── text
│       ├── stime → startTime                       ├── startTime
│       └── etime → endTime                         └── endTime
└── metadata
    ├── transcription.lang  →       language
    └── audio.filename      →       audio.src
```

Un seul canal "default" est créé. La langue est prise de `metadata.transcription.lang`, du premier turn, ou `"fr"` par défaut.

## Points d'entrée

### Package NPM (`src/index.ts`)

```typescript
import {
  createEditorCore,
  provideEditorCore, useEditorCore,
  EditorLayout,
  createAudioPlugin, createLivePlugin, createSubtitlePlugin,
  mapApiDocument,
  provideI18n,
  validateEditorDocument,
} from "@linto/studio-editor"
```

### Web Component (`src/webcomponent.ts`)

```typescript
import { register } from "@linto/studio-editor/webcomponent"

register("linto-editor")  // <linto-editor locale="fr" />
```

Le web component :
- Crée son propre `EditorCore` + plugins
- Expose `el.editor` pour accès externe au core
- Encapsule le CSS (Shadow DOM)
- Props : `locale` (`"fr"` | `"en"`), `no-header` (boolean)

## Injection Vue

Le core et l'i18n sont injectés via `provide`/`inject` :

```typescript
// Dans le composant racine
provideEditorCore(editor)
provideI18n(ref<Locale>("fr"))

// Dans n'importe quel descendant
const editor = useEditorCore()
const { t, locale } = useI18n()
```

## Design system

Tous les composants utilisent du CSS scoped avec des variables globales :

```css
/* Couleurs */
--color-background, --color-surface, --color-text-primary,
--color-text-secondary, --color-text-muted, --color-primary,
--color-primary-hover, --color-border

/* Typographie */
--font-family, --font-family-mono, --font-size-xs/sm/base/lg/xl

/* Espacement */
--spacing-xs/sm/md/lg/xl

/* Arrondis */
--radius-sm/md/lg

/* Effet verre */
--glass-background, --glass-blur, --glass-border

/* Layout */
--sidebar-width, --header-height
```

Pas de Tailwind. Les variables sont surchargeable depuis l'extérieur (Web Component : via CSS custom properties sur le host).
