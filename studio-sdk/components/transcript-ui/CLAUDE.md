# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
bun install          # Installer les dépendances
bun dev              # Lancer le serveur de dev Vite (http://localhost:5173)
bun run build        # Type-check (vue-tsc -b) puis build Vite
bun run preview      # Prévisualiser le build de production
```

Pas de framework de test ni de linter configuré pour l'instant.

## Contexte projet

Éditeur de transcription collaboratif en **Vue 3**, extrait en package standalone depuis une app existante en Vue 2. L'éditeur sera distribué via NPM et intégré dans l'app existante via **Web Component** en attendant la migration complète.

Le projet est en phase initiale : le scaffold Vite + Vue 3 est en place, l'architecture cible est définie, l'implémentation reste à faire.

Licence : AGPL v3.

## Stack

- **Runtime / Package manager** : Bun
- **Bundler** : Vite 7 (pas la v8 beta)
- **Framework** : Vue 3 Composition API (`<script setup>`)
- **TypeScript** : strict (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`)
- **Composants headless** : Reka UI (ex Radix Vue)
- **Styling** : CSS scoped + CSS variables globales (pas de Tailwind)
- **Collab (cible)** : Yjs + y-indexeddb
- **Distribution (cible)** : ESM + Web Component

## Architecture cible

```
@linto/editor-core          # Cœur Vue 3, un document, un mode
@linto/editor-workspace     # Orchestrateur multi-documents
@linto/editor-webcomponent  # Wrapper Web Component
@linto/plugin-yjs           # Collaboration Yjs
@linto/plugin-timestamps    # Sync timestamps backend
@linto/plugin-live          # Flux live transcription
@linto/plugin-export        # Export PDF/DOCX
@linto/plugin-llm           # Génération compte rendu
@linto/plugin-localstorage  # Persistence locale
```

### Principes architecturaux

**Le cœur est agnostique** : pas de fetch/axios dans le core. L'éditeur expose un state, des events, des méthodes. Les plugins s'y branchent.

```javascript
// Le core expose
editor.document
editor.on('change', callback)
editor.applyDelta(delta)

// Les plugins s'abonnent
function MyPlugin(config) {
  return (editor) => {
    editor.on('change', (delta) => sendToMyBackend(delta))
  }
}
```

**Mode vs Capabilities** : Le mode détermine ce qui est affiché (full, transcription, markdown, live, viewer). Les capabilities déterminent ce que l'utilisateur peut faire (permissions). Les deux sont indépendants.

**Yjs** : CRDT pour la collaboration. Ne stocker que les données sources dans Yjs, jamais les données dérivées.

**Timestamps = backend only** : Le recalcul des timestamps après édition est heuristique. C'est le backend qui calcule et broadcast. Les clients affichent, ils ne calculent pas.

## Modes de l'éditeur

| Mode | Description |
|------|-------------|
| `full` | Transcription + compte rendu, édition complète |
| `transcription` | Transcription seule |
| `markdown` | Éditeur markdown seul, pas d'audio |
| `live` | Flux entrant temps réel, texte readonly, speakers éditables |
| `viewer` | Readonly complet |

## Structure d'un document transcription

```javascript
{
  segments: [{
    id: "seg-1",
    speakerId: "spk-1",
    startTime: 0.0,
    endTime: 4.5,
    words: [
      { text: "Bonjour", start: 0.0, end: 0.8 },
      { text: "tout", start: 0.9, end: 1.1 },
    ]
  }],
  speakers: {
    "spk-1": { name: "Marie", color: "#E57373" },
  }
}
```

## API du composant (cible)

```vue
<Editor
  document-id="abc123"
  mode="transcription"
  :capabilities="{ text: 'edit', speakers: 'edit' }"
  :audio="{ src: 'https://...', channels: [...] }"
  :plugins="[YjsPlugin({ url: 'wss://...' })]"
  :initial-document="..."
  theme="light"
  locale="fr"
  @change="onChangeHandler"
/>
```

## Design System (CSS Variables)

Les tokens à utiliser dans les composants scoped :

```css
/* Colors */
--color-background, --color-surface, --color-text-primary,
--color-text-secondary, --color-text-muted, --color-primary,
--color-primary-hover, --color-border

/* Typography */
--font-family ('Inter'), --font-family-mono ('JetBrains Mono'),
--font-size-xs/sm/base/lg/xl, --line-height

/* Spacing */
--spacing-xs/sm/md/lg/xl

/* Radius */
--radius-sm/md/lg

/* Glass effect */
--glass-background, --glass-blur, --glass-border
```

## UX

### Transcription desktop

┌─────────────────────────────────────────────────────────────────────────┐
│  Header                                                                 │
│  Réunion projet X · [Canal 1 ▼] · [FR ▼]      [● Live] [Exporter] [⚙️]  │
├─────────────────────────────────────────────────────────┬───────────────┤
│                                                         │               │
│  Zone Transcription (scrollable)                        │  Sidebar      │
│                                                         │               │
│  ┌─────────────────────────────────────────────────┐    │ Speakers      │
│  │ [Avatar] Marie · 00:12                          │    │ ┌─────────┐   │
│  │ Bonjour à tous, on commence la réunion...       │    │ │ ● Marie │   │
│  └─────────────────────────────────────────────────┘    │ │ ○ Thomas│   │
│                                                         │ │ ○ Julie │   │
│  ┌─────────────────────────────────────────────────┐    │ └─────────┘   │
│  │ [Avatar] Thomas · 00:24                         │    │               │
│  │ Merci Marie, j'ai préparé quelques points...    │    │ [Renommer]    │
│  └─────────────────────────────────────────────────┘    │               │
│                                                         │               │
│  ┌─────────────────────────────────────────────────┐    │               │
│  │ [Avatar] Julie · 00:38              ← active    │    │               │
│  │ J'ai aussi des retours du client...             │    │               │
│  └─────────────────────────────────────────────────┘    │               │
│                                                         │               │
├─────────────────────────────────────────────────────────┴───────────────┤
│  Player (sticky bottom)                                                 │
│  [◀◀] [▶] [▶▶]  ━━━━━━●━━━━━━━━━━━━━━━  02:34 / 15:42   [🔊] [1x]       │
└─────────────────────────────────────────────────────────────────────────┘


Desktop — Popover :
┌─────────────────────────────────────────────────────┐
│ [M] Marie · 00:12     ← clic sur "Marie"            │
│ Bonjour à tous...                                   │
└───────┬─────────────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────┐
    │ Marie               │
    │ ────────────────    │
    │ Renommer            │
    │ Changer couleur     │
    │ Voir interventions  │
    └─────────────────────┘

### Transcription mobile

┌─────────────────────────┐
│  Réunion.. [👥][📄][⚙️]  │
├─────────────────────────┤
│                         │
│  Zone Transcription     │
│  (full width)           │
│                         │
│  ┌─────────────────┐    │
│  │ Marie · 00:12   │    │
│  │ Bonjour à tous  │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Thomas · 00:24  │    │
│  │ Merci Marie...  │    │
│  └─────────────────┘    │
│                         │
├─────────────────────────┤
│  [▶] ━━●━━━━ 02:34      │
│  [Canal 1 ▼]  [FR ▼]    │
└─────────────────────────┘

## Conventions

- Composition API uniquement, pas Options API
- `<script setup>` pour tous les composants
- TypeScript strict, pas de `any`
- CSS scoped dans chaque composant, variables CSS globales pour le design system
- PascalCase pour les composants, camelCase pour fonctions/variables
- Éléments HTML sémantiques en priorité (`<dialog>`, `<details>`, `<time>`, `<progress>`, etc.)
- APIs natives pour le formatage (`Intl.DateTimeFormat`, `Intl.NumberFormat`, etc.)
- Reka UI pour les composants headless (accessibilité intégrée, ne pas casser)

## Interdit dans le core

- Appels HTTP directs (fetch/axios)
- WebSocket direct (job des plugins)
- Logique métier spécifique à l'app
- Connaissance du concept d'organisation/tenant
- Tailwind

## Points d'attention

- **Offline-first** : supporter le offline (readonly pour la v1)
- **Multi-canal** : gérer plusieurs pistes audio dès le départ
- **Web Component** : encapsulation CSS (variables passées depuis l'extérieur)
- **Performance** : documents longs (1h+ de transcription)
- **Accessibilité** : WCAG AA, navigation clavier, `prefers-reduced-motion`
