# TODO — Éditeur collaboratif Linto (Yjs + Tiptap)

Ce document est à la fois l'audit du plugin éditeur côté client **et** le plan d'intégration serveur.
Il doit être suffisamment détaillé pour qu'une session Claude Code ultérieure reprenne le travail sans accès à l'historique de conversation.

Branche : `vue3-collab-edition` dans `studio-sdk/components/transcript-ui`.

---

## 1. Contexte et objectif

On développe un **éditeur de transcription collaboratif** en Vue 3 (`studio-sdk/components/transcript-ui`), distribué en web component et intégré dans `studio-frontend` (Vue 2.7) en attendant la migration complète. Collab basée sur Yjs + Tiptap.

Le **but immédiat** est de tester la feature d'édition en conditions réelles dans `studio-frontend`. Pour ça il faut :
1. Fixer les bugs client bloquants (section 5)
2. Écrire un backend collab qui sync les Y.Doc et persiste dans MongoDB (sections 2 à 4)
3. Brancher le client sur ce backend et valider le round-trip (section 5.5)

---

## 2. Architecture décidée

### 2.1 Le cœur de la décision

Le backend collab **est intégré dans `studio-api`** (monorepo `studio/studio-api`), pas dans un service séparé.

**Raisons :**
1. **Auth propre et gratuite** : `studio-api` a déjà un middleware Passport (`components/WebServer/config/passport/middleware.js`) qui vérifie le JWT au connect socket. Le socket est authentifié **avant** qu'aucun event ne puisse être émis. Le token n'est jamais relu depuis le payload d'un event → pas de risque d'impersonation (un user ne peut pas se faire passer pour un autre en forgeant un event avec le token de quelqu'un d'autre).
2. **Accès direct à Mongo** via `lib/mongodb/models` — pas de HTTP round-trip pour les flushes, pas de sérialisation inutile, permet des opérations atomiques (positional `$`) impossibles depuis l'extérieur.
3. **Redis adapter socket.io déjà en place** (`components/IoHandler/index.js:267-326`) — l'infra Redis est là, on peut la réutiliser.
4. **Audit facile** : `LogManager.logSocketEvent` et accès direct à Mongo pour logger les edits (reporté pour l'instant).
5. **Le bug de lost-update dans `model.conversations.updateTurn` doit être fixé de toute façon** — voir section 3.1. Si on doit toucher `studio-api` dans tous les cas, autant y mettre aussi le collab.
6. **Pas de second déploiement à maintenir** — un seul Dockerfile, une seule image.

### 2.2 Ce qui a été écarté et pourquoi

**Option A — Rewrite de `studio-websocket`**
`studio-websocket` existe déjà (Node.js + socket.io + Yjs custom) et sert Vue 2.7 avec un schéma Y.Array/Y.Map incompatible avec le nouveau schéma Tiptap Y.XmlFragment. Rewrite envisagé et écarté parce que :
- Pas d'accès direct à Mongo → doit passer par HTTP sur studio-api, avec le même bug de lost-update et sans possibilité d'ops atomiques
- Doit réimplémenter l'auth (appels HTTP vers studio-api pour vérifier le token)
- Le problème d'impersonation de token reste entier (le service reçoit le token via payload et doit le transmettre)
- Doit réimplémenter le multi-replica from scratch
- Duplique du code pour rien

**Option B — Hocuspocus en service standalone**
Même problèmes que A plus : duplication du JWT verification logic, cross-service call pour chaque auth.

**Option C — Custom socket.io namespace dans studio-api**
Dérive plus courte que Hocuspocus mais :
- Faut réimplémenter le protocole y-protocols/sync (step 1/2) — ~200 lignes délicates
- Faut réimplémenter awareness
- Faut réimplémenter le multi-replica CRDT convergence — ~300-500 lignes (c'est exactement `@hocuspocus/extension-redis`)
- Faut réimplémenter la lifecycle (debounce onStoreDocument, eviction des Y.Doc idle, etc.)
- Total : ~500-1000 lignes de code réseau/distribué à écrire, tester, et maintenir seul. Effort : 1-2 semaines + bugs subtils qui reviendront hanter.

**Décision finale** : Hocuspocus dans studio-api. ~150 lignes de wiring. Quelques heures d'effort. Battle-tested, Redis extension prête à l'emploi.

### 2.3 Schéma runtime

```
┌──────────────────────┐           ┌──────────────────────────────┐
│  studio-frontend     │           │        studio-api            │
│  (Vue 2.7 host)      │           │  (N replicas, express+socket)│
│                      │           │                              │
│  <linto-editor>      │           │  ┌────────────────────────┐  │
│    ↓ WC              │           │  │ WebServer component    │  │
│  transcript-ui       │           │  │   httpServer :443      │  │
│  (Vue 3 inside WC)   │──WS──────▶│  │    ├── /socket.io/     │  │
│                      │           │  │    └── /ws/editor/:id  │  │
│  @hocuspocus/        │           │  └───────┬────────────────┘  │
│   provider           │           │          │                   │
│                      │           │   ┌──────▼─────┐  ┌────────┐ │
│  Yjs Doc (Tiptap)    │           │   │ IoHandler  │  │Editor  │ │
│                      │           │   │(socket.io) │  │Handler │ │
└──────────────────────┘           │   │+redis-adpt │  │(Hocus- │ │
                                   │   └────────────┘  │pocus)  │ │
                                   │                   └───┬────┘ │
                                   │                       │      │
                                   │          model.conversations │
                                   │                       │      │
                                   └───────────────────────┼──────┘
                                                           │
                                         ┌─────────────────┼──────┐
                                         │     Redis       │      │
                                         │ (socket.io +    │      │
                                         │  hocuspocus ext)│      │
                                         └─────────────────┼──────┘
                                                           │
                                                    ┌──────▼─────┐
                                                    │  MongoDB   │
                                                    │(conversa-  │
                                                    │ tions)     │
                                                    └────────────┘
```

**Points clés :**
- `Hocuspocus` et `socket.io` cohabitent dans le **même process Node** sur le **même httpServer**, sur des paths distincts (`/ws/editor/:conversationId` vs `/socket.io/`).
- `@hocuspocus/extension-redis` assure la convergence CRDT entre replicas quand `SOCKETIO_REDIS_HOST` est défini (réutilise le même Redis que socket.io, clés préfixées différemment).
- Si `SOCKETIO_REDIS_HOST` est absent au boot : mode single-instance, pas d'extension Redis. Documenté en section 6.3.
- Le client utilise `@hocuspocus/provider` qui implémente le protocole Yjs standard — compatible avec `@tiptap/extension-collaboration` déjà en place.

### 2.4 Flux de données

**Connexion + seed initial**
```
1. Client transcript-ui monte l'éditeur
2. Client crée un HocuspocusProvider({ url: 'wss://api/ws/editor/:conversationId', token, document })
3. Le provider ouvre un WS, envoie le token dans le handshake Hocuspocus
4. Serveur EditorHandler.onAuthenticate({ token, documentName }) :
   - verifyJwtStandalone(token) → userData ou null
   - checkConversationWriteAccess(userData.userId, documentName) → canWrite
   - return { userId, canWrite } → attaché à la connection.context
5. Serveur EditorHandler.onLoadDocument({ documentName, context }) :
   - model.conversations.getById(documentName) → conversation avec .text (array de turns)
   - seedYDoc(document, conversation.text) via turnsToDoc() + prosemirrorJSONToYXmlFragment()
   - return document (le Y.Doc seedé)
6. Hocuspocus envoie sync step 1 au client → client calcule le diff → reçoit sync step 2 → son Y.Doc est à jour
7. Client crée l'éditeur Tiptap par-dessus le Y.Doc synced
```

**Édition + broadcast**
```
1. User A tape dans le client A → Tiptap transaction → ySyncPlugin écrit dans Y.Doc
2. HocuspocusProvider envoie l'update au serveur via WS
3. Serveur EditorHandler :
   - Applique l'update au Y.Doc en mémoire (onChange hook)
   - Broadcast aux autres clients connectés (automatique via Hocuspocus)
   - Si @hocuspocus/extension-redis est actif : publie sur Redis → autres replicas appliquent
4. Client B reçoit l'update via son provider → ySyncPlugin met à jour le Y.Doc → Tiptap re-render
5. onStoreDocument est debouncé (10s) → onStoreDocument({ document }) appelé
6. Serveur :
   - docToTurns(document) → nouveau turns[]
   - Diff vs le "dernier état flushé" en mémoire
   - Pour chaque turn modifié : model.conversations.updateTurnAtomic(convId, turnId, newTurn)
   - Pour chaque turn ajouté/supprimé : ops atomiques correspondantes
7. Si un flush échoue : log + retry au prochain onStoreDocument (pas de blocage)
```

**Déconnexion + cleanup**
```
1. Dernier client se déconnecte
2. Hocuspocus attend X minutes de grâce (config unloadImmediately: false + unloadTimeout)
3. Timer expire sans reconnection → onStoreDocument final → Y.Doc unload de la mémoire
4. Nouvelle connexion plus tard → nouveau onLoadDocument depuis Mongo
```

---

## 3. Découvertes critiques (contexte pour le futur Claude)

### 3.1 Bug lost-update dans `model.conversations.updateTurn`

**Fichiers :**
- `studio-api/components/WebServer/routecontrollers/conversation/turn.js:80-112`
- `studio-api/lib/mongodb/models/conversations.js:359-376`

**Le bug :**
```js
// routecontrollers/conversation/turn.js:80
async function updateTurn(req, res, next) {
  let conversation = await model.conversations.getById(conversationId)  // lit TOUT
  let updatedTurn = []
  for (let turn of conversation[0].text) {
    if (turn.turn_id === req.params.turnId) turn = req.body
    updatedTurn.push(turn)
  }
  await model.conversations.updateTurn(conversationId, updatedTurn)  // réécrit TOUT
}

// lib/mongodb/models/conversations.js:359
async updateTurn(_id, text) {
  return await this.mongoUpdateOne(query, "$set", { text: [...text], last_update })
}
```

**Chaque PATCH /turns/:id lit le document entier, modifie un turn en JS, et réécrit tout le `text` array.** Pas de `$` positionnel, pas de transaction, pas d'optimistic locking.

**Conséquence :** deux PATCHes concurrents de deux turns **différents** → le second écrase les modifs du premier sur **tous les autres turns**. Lost update garanti.

**Impact sur notre archi collab :**
- On ne peut PAS faire de PATCH parallèles via HTTP depuis un service externe
- On doit faire des opérations Mongo **atomiques** (positional `$`) depuis l'intérieur de studio-api
- C'est un argument décisif pour l'intégration dans studio-api

**Fix à faire (phase 1) :**
Ajouter un nouveau helper `updateTurnAtomic` dans `lib/mongodb/models/conversations.js` sans toucher au comportement existant. Les controllers HTTP existants restent inchangés pour l'instant. Ils seront câblés plus tard sur la méthode atomique.

```js
// À ajouter dans lib/mongodb/models/conversations.js
async updateTurnAtomic(conversationId, turnId, newTurn) {
  const query = {
    _id: this.getObjectId(conversationId),
    "text.turn_id": turnId,
  }
  const dateTime = moment().format()
  const operator = "$set"
  const mutableElements = {
    "text.$": { ...newTurn, turn_id: turnId },
    last_update: dateTime,
  }
  return await this.mongoUpdateOne(query, operator, mutableElements)
}

async addTurnAtomic(conversationId, newTurn) {
  // Insertion en fin de text array. L'ordre arbitraire est géré par startTime.
  const query = { _id: this.getObjectId(conversationId) }
  const operator = "$push"
  const mutableElements = {
    text: newTurn,
  }
  // Note : last_update devra être mis à jour via un second call ou via $currentDate
  return await this.mongoUpdateOne(query, operator, mutableElements)
}

async removeTurnAtomic(conversationId, turnId) {
  const query = { _id: this.getObjectId(conversationId) }
  const operator = "$pull"
  const mutableElements = {
    text: { turn_id: turnId },
  }
  return await this.mongoUpdateOne(query, operator, mutableElements)
}
```

⚠️ **Attention** : la méthode existante `updateTurn(_id, text)` reste inchangée — le controller HTTP existant l'utilise encore. Le câblage HTTP sur `updateTurnAtomic` est reporté (décision actée : "Oui on ajoute une methode et on cablera l'api dessus plus tard").

### 3.2 `studio-api` : stack et patterns

- **CommonJS** (`require`), pas ESM. Attention : le code à dupliquer depuis `transcript-ui` (TypeScript ESM) devra être transpilé/réécrit en CommonJS.
- **Express 4 + socket.io 4.7** sur le même httpServer (`components/WebServer/index.js:101-108`)
- **Redis adapter** avec fallback in-memory (`components/IoHandler/index.js:267-326`)
- **Passport + JWT** pour l'auth. `socket.handshake.auth.token` vérifié dans `middleware.js:165` (`isAuthenticateSocket`)
- **Components loadés via env `COMPONENTS=...`** dans `.envdefault` et l'init dans `app.js:12-34`
- **Pattern component** : `components/COMPONENT_NAME/index.js` exporte `(app) => new ComponentClass(app)`. Le component hérite de `components/component.js`, déclare son ID, s'initialise dans le constructor, retourne `this.init()`.
- **Accès à d'autres components** : `this.app.components["WebServer"].httpServer` (dépendance déclarée via `super(app, "WebServer")`)

### 3.3 `studio-websocket` : statut

- Node.js ESM, socket.io, Yjs 13.5
- Schéma Y.Array/Y.Map custom **incompatible** avec le nouveau Y.XmlFragment Tiptap
- Reste utilisé par Vue 2.7 pendant la transition
- Destiné à être supprimé quand Vue 2.7 sera éteint
- **Ne pas toucher** pendant cette intégration, sauf si nécessaire pour la coexistence

### 3.4 Risque de double-édition pendant la transition Vue 2 / Vue 3

Tant que Vue 2.7 et Vue 3 coexistent, une conversation peut théoriquement être ouverte en simultané par les deux types de clients :
- Client Vue 2.7 → studio-websocket (ancien schéma Y.Array)
- Client Vue 3 → studio-api EditorHandler (nouveau schéma Y.XmlFragment)

Les deux schémas sont **incompatibles** → les modifs des deux côtés sont invisibles l'une pour l'autre et on aura une divergence finale entre les états Yjs.

**Mitigation v1** : interdire l'ouverture simultanée via un flag côté conversation (`editor_version: 1` ou `2`). Si un user ouvre une conversation marquée v2 dans le client Vue 2, afficher un message "migrer d'abord". Pas de support multi-version.

**Décision** : on trancheera sur le flag au moment d'intégrer côté studio-frontend. Pour la phase dev, on testera sur des conversations de test dédiées.

---

## 4. Plan d'intégration (phases)

### Phase 1 — Préalables indépendants (parallélisables)

#### 1.1 Ajouter `@tiptap/y-tiptap` dans `transcript-ui/package.json`
**Fichier** : `studio-sdk/components/transcript-ui/package.json`
**Problème** : `@tiptap/y-tiptap` est importé directement dans :
- `src/plugins/transcriptionEditor/index.ts:6`
- `src/plugins/transcriptionEditor/extensions/collaborationCursor.ts:2`

Mais il n'est pas dans `dependencies`. Il arrive en transitive via `@tiptap/extension-collaboration`. Toute bump tiptap peut casser silencieusement.

**Fix** : ajouter `"@tiptap/y-tiptap": "^3.0.2"` (ou version compatible) dans `dependencies`. Vérifier avec `bun install` que tout compile.

**Effort** : 2 min.

#### 1.2 Ajouter `updateTurnAtomic` (et helpers) dans `studio-api`
**Fichier** : `studio-api/lib/mongodb/models/conversations.js`
**Action** : ajouter les méthodes `updateTurnAtomic`, `addTurnAtomic`, `removeTurnAtomic` telles que décrites section 3.1.

**Test manuel** : écrire un petit script Node dans `studio-api/tests/` (ou utiliser la REPL avec l'env chargé) qui :
1. Trouve une conversation de test
2. Appelle `updateTurnAtomic` avec un turn modifié
3. Vérifie que seul ce turn a changé dans Mongo

**Ne pas toucher** aux controllers HTTP existants (`routecontrollers/conversation/turn.js`).

**Effort** : 1h (dont test).

#### 1.3 Extraire la vérification JWT en fonction standalone
**Fichier** : `studio-api/components/WebServer/config/passport/middleware.js` (actuellement ligne 165-199 pour `isAuthenticateSocket`)

**Problème** : Hocuspocus `onAuthenticate` reçoit un `{ token, documentName, requestHeaders }` — pas un socket.io socket. Il ne peut pas appeler `isAuthenticateSocket` tel quel.

**Action** : créer `studio-api/components/WebServer/config/passport/jwt.js` avec une fonction pure :

```js
// components/WebServer/config/passport/jwt.js
const jwtDecode = require("jwt-decode").default || require("jwt-decode")
const verifyJwt = require("jsonwebtoken")
const { generateSecretFromHeaders } = require("./secrets")  // adapter selon l'existant
const algorithm = process.env.JWT_ALGORITHM || "HS256"

async function verifyJwtStandalone(token) {
  if (!token) return null
  try {
    const tokenData = jwtDecode(token + "")
    if (tokenData?.data?.fromPublic && tokenData?.data?.fromSession) {
      // Handle public tokens — à adapter selon la logique existante
      return null  // pour l'instant, refuse les public tokens sur /ws/editor
    }
    if (!tokenData?.data?.userId || !tokenData?.data?.tokenId) return null
    
    const secret = await generateSecretFromHeaders(undefined, { payload: tokenData })
    
    return new Promise((resolve) => {
      verifyJwt.verify(token, secret, { algorithms: [algorithm] }, (err, decoded) => {
        if (err) resolve(null)
        else resolve(decoded.data)  // { userId, tokenId, ... }
      })
    })
  } catch (err) {
    return null
  }
}

module.exports = { verifyJwtStandalone }
```

Puis **refactor `isAuthenticateSocket`** dans `middleware.js` pour utiliser `verifyJwtStandalone` en interne (no behavior change côté socket.io).

**Test** : `isAuthenticateSocket` doit continuer à fonctionner exactement pareil. Les tests existants doivent passer.

**Effort** : 1-2h.

---

### Phase 2 — Scaffold du component EditorHandler

Créer la structure minimale qui prouve que Hocuspocus cohabite avec socket.io.

#### 2.1 Créer le dossier et les fichiers de base
```
studio-api/components/EditorHandler/
├── index.js              # Bootstrap Hocuspocus
├── hooks/
│   ├── onAuthenticate.js
│   └── onLoadDocument.js  # bouchonné
├── config.js             # centralise les env vars
└── README.md             # documentation brève
```

#### 2.2 Installer les dépendances dans `studio-api`
```bash
cd studio-api
npm install @hocuspocus/server @hocuspocus/extension-redis yjs @tiptap/pm
```

Attention : studio-api est CommonJS. Vérifier que `@hocuspocus/server` exporte bien en CJS (regarder le champ `main` dans leur package.json). Si ESM-only, il faudra un `await import()` dynamique ou reconsidérer.

#### 2.3 Implémenter `EditorHandler/index.js` (squelette)

```js
// components/EditorHandler/index.js
const debug = require("debug")("linto:components:EditorHandler")
const Component = require(`../component.js`)
const { Server: Hocuspocus } = require("@hocuspocus/server")
const { verifyJwtStandalone } = require(
  `${process.cwd()}/components/WebServer/config/passport/jwt`,
)

class EditorHandler extends Component {
  constructor(app) {
    super(app, "WebServer") // dépend de WebServer pour httpServer
    this.id = this.constructor.name
    this.app = app

    const httpServer = this.app.components["WebServer"].httpServer
    if (!httpServer) {
      throw new Error("EditorHandler requires WebServer.httpServer")
    }

    const extensions = this.buildExtensions()

    this.hocuspocus = Hocuspocus.configure({
      name: "linto-editor",
      extensions,

      async onAuthenticate({ token, documentName }) {
        debug(`onAuthenticate: doc=${documentName}`)
        const userData = await verifyJwtStandalone(token)
        if (!userData) {
          throw new Error("Unauthorized")
        }

        // TODO phase 4 : vérifier l'accès en écriture à la conversation
        // const canWrite = await checkConversationWriteAccess(userData.userId, documentName)
        // if (!canWrite) throw new Error("Forbidden")

        return {
          userId: userData.userId,
          canWrite: true, // bouchonné pour scaffold
        }
      },

      async onLoadDocument({ document, documentName, context }) {
        debug(`onLoadDocument: doc=${documentName} user=${context.userId}`)
        // Phase 2 : renvoie un Y.Doc vide, juste pour valider le routing
        // Phase 4 : seed depuis model.conversations
        return document
      },

      async onDisconnect({ documentName, context }) {
        debug(`onDisconnect: doc=${documentName} user=${context.userId}`)
      },
    })

    // Attache Hocuspocus au httpServer existant, sur le path /ws/editor/*
    httpServer.on("upgrade", (request, socket, head) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      if (url.pathname.startsWith("/ws/editor/")) {
        // Extraire documentName du path : /ws/editor/:conversationId
        // Hocuspocus utilise le path comme documentName par défaut via le client
        this.hocuspocus.handleConnection(request, socket, head)
      }
      // Sinon, socket.io gère via son propre handler déjà attaché
    })

    debug("EditorHandler ready on /ws/editor/*")
    return this.init()
  }

  buildExtensions() {
    const extensions = []
    const redisHost = process.env.SOCKETIO_REDIS_HOST
    if (redisHost) {
      const { Redis } = require("@hocuspocus/extension-redis")
      extensions.push(
        new Redis({
          host: redisHost,
          port: Number(process.env.SOCKETIO_REDIS_PORT || 6379),
          password: process.env.SOCKETIO_REDIS_PASSWORD || undefined,
          // Préfixe pour ne pas collider avec socket.io-redis-adapter
          prefix: "hocuspocus:",
        }),
      )
      debug(`Redis extension enabled at ${redisHost}`)
    } else {
      debug("Redis extension disabled (SOCKETIO_REDIS_HOST not set) — single-instance mode")
    }
    return extensions
  }
}

module.exports = (app) => new EditorHandler(app)
```

⚠️ **Vérifications à faire avant de valider ce scaffold :**
1. Est-ce que `@hocuspocus/server` exporte un API CJS ? Si ESM-only, utiliser `await import()` (mais alors le constructor ne peut pas être sync → refactor du pattern component).
2. `handleConnection` est-il bien la bonne méthode Hocuspocus pour un upgrade brut ? Voir la doc Hocuspocus actuelle.
3. Le path parsing : `documentName` extrait automatiquement par Hocuspocus depuis le path, ou à parser manuellement ?
4. Est-ce que `httpServer.on("upgrade", ...)` a déjà un handler attaché par socket.io qui va intercepter notre path ? Tester avec un `console.log` pour vérifier l'ordre d'attachement et qu'aucun handler n'empêche l'autre.

#### 2.4 Ajouter `EditorHandler` dans `.envdefault` / `.env`
**Fichier** : `studio-api/.envdefault` (ou `.env` selon convention locale)

Ajouter `EditorHandler` à la liste `COMPONENTS=...`. Exemple :
```
COMPONENTS=WebServer,MongoMigration,IoHandler,BrokerClient,EditorHandler
```

#### 2.5 Test manuel du scaffold

1. Lancer studio-api local en dev (`npm run dev`)
2. Vérifier dans les logs le message `EditorHandler ready on /ws/editor/*`
3. Avec `wscat` ou un petit script Node :
   ```bash
   wscat -c ws://localhost:PORT/ws/editor/fake-doc-id
   ```
4. Sans token → doit être refusé (onAuthenticate renvoie Unauthorized)
5. Avec un token valide (récupéré depuis un login existant) → doit accepter
6. Vérifier que les connexions socket.io normales continuent de fonctionner (login frontend Vue 2 ou Vue 3)

**Critère de validation Phase 2** : on peut ouvrir une connexion Hocuspocus authentifiée et elle reçoit un Y.Doc vide sans planter. Les autres features socket.io continuent de fonctionner.

**Effort** : 1 journée.

---

### Phase 3 — Schéma partagé (dupliqué en CJS dans studio-api)

Le serveur a besoin de lire/écrire les Y.Doc avec le même schéma que le client Tiptap, sinon les updates CRDT produites par le serveur ne seront pas comprises par le client (et vice-versa).

#### 3.1 Créer les fichiers schéma dans studio-api

```
studio-api/components/EditorHandler/schema/
├── turnNode.js               # version headless (sans VueNodeViewRenderer)
├── transcriptionDocument.js
├── turnsToDoc.js
└── docToTurns.js
```

**Source à dupliquer** :
- `studio-sdk/components/transcript-ui/src/plugins/transcriptionEditor/extensions/turnNode.ts` → `turnNode.js` (retirer `addNodeView`, garder `addAttributes` et le reste)
- `studio-sdk/components/transcript-ui/src/plugins/transcriptionEditor/extensions/transcriptionDocument.ts` → `transcriptionDocument.js`
- `studio-sdk/components/transcript-ui/src/plugins/transcriptionEditor/utils/turnsToDoc.ts` → `turnsToDoc.js`
- `studio-sdk/components/transcript-ui/src/plugins/transcriptionEditor/utils/docToTurns.ts` → `docToTurns.js`

**Transformation TS → JS CJS** :
- Retirer les types
- `import` → `require`
- `export` → `module.exports`
- Retirer les dépendances Vue (seulement dans `turnNode.ts`)

**Exemple `turnNode.js`** :
```js
// components/EditorHandler/schema/turnNode.js
const { Node } = require("@tiptap/core")

const TurnNode = Node.create({
  name: "turn",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      id: { default: null },
      speakerId: { default: null },
      startTime: { default: undefined },
      endTime: { default: undefined },
      language: { default: "" },
    }
  },

  parseHTML() {
    return [{ tag: 'section[data-type="turn"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { mergeAttributes } = require("@tiptap/core")
    return ["section", mergeAttributes(HTMLAttributes, { "data-type": "turn" }), 0]
  },
  // Pas de addNodeView — headless
})

module.exports = { TurnNode }
```

#### 3.2 Écrire le helper `seedYDoc` côté serveur

```js
// components/EditorHandler/schema/seedYDoc.js
const { getSchema } = require("@tiptap/core")
const { prosemirrorJSONToYXmlFragment } = require("@tiptap/y-tiptap")
const { TurnNode } = require("./turnNode")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { Text } = require("@tiptap/extension-text")
const { turnsToDoc } = require("./turnsToDoc")

const extensions = [TranscriptionDocument, TurnNode, Text]
const schema = getSchema(extensions)

function seedYDoc(ydoc, turns, field = "default") {
  const fragment = ydoc.getXmlFragment(field)
  if (fragment.length > 0) return  // déjà seedé

  const content = turnsToDoc(turns)  // format { type: "doc", content: [...] }
  prosemirrorJSONToYXmlFragment(schema, content, fragment)
}

module.exports = { seedYDoc, schema }
```

⚠️ **Attention** : `@tiptap/y-tiptap` doit être installé dans studio-api. Ajouter dans `npm install` phase 2.2.

#### 3.3 Tests de round-trip

Écrire dans `studio-api/tests/editor-schema.test.js` (ou équivalent selon le runner configuré — studio-api utilise jest d'après le package.json) :

```js
const Y = require("yjs")
const { seedYDoc } = require("../components/EditorHandler/schema/seedYDoc")
const { docToTurns } = require("../components/EditorHandler/schema/docToTurns")

// Adapter docToTurns pour accepter un Y.Doc (ou ProseMirror doc depuis un Y.Doc)
// Voir l'implémentation actuelle dans transcript-ui qui prend un ProseMirror node

describe("Editor schema round-trip", () => {
  test("turns[] → Y.Doc → turns[] conserve les données essentielles", () => {
    const originalTurns = [
      {
        turn_id: "t1",
        speaker_id: "spk1",
        segment: "Bonjour tout le monde",
        words: [
          { word: "Bonjour", start: 0, end: 0.8 },
          { word: "tout", start: 0.9, end: 1.0 },
          { word: "le", start: 1.1, end: 1.2 },
          { word: "monde", start: 1.3, end: 1.8 },
        ],
        startTime: 0,
        endTime: 1.8,
        language: "fr",
      },
      // ... plusieurs turns pour tester l'ordre
    ]

    const ydoc = new Y.Doc()
    seedYDoc(ydoc, originalTurns)

    // Convertir le Y.XmlFragment en ProseMirror doc puis en turns[]
    // Voir @tiptap/y-tiptap pour yXmlFragmentToProsemirrorJSON
    const roundTripped = docToTurns(/* ... */)

    expect(roundTripped.length).toBe(originalTurns.length)
    // Vérifier que les textes et les turn_ids sont préservés
    // Les timestamps de mots sont perdus dans le round-trip (CRDT ne stocke que le texte)
    // — documenter ça comme limitation attendue
  })
})
```

⚠️ **Limitation fondamentale à documenter** : Y.Doc Tiptap ne stocke **que le texte** (pas les objets words avec timestamps). Les timestamps reviennent via le fetch Mongo initial et sont préservés tant que le texte n'est pas modifié. Si le texte change, les words sont perdus (cf. todo client-side point 4).

**Convention backend** :
- À la lecture (`onLoadDocument`) : on lit les turns de Mongo complets (avec words), on seed le Y.Doc avec juste le texte
- À l'écriture (`onStoreDocument`) : on extrait les turns du Y.Doc (texte seulement), on compare avec les turns en mémoire (qui ont encore les words), et pour chaque turn dont le texte a changé, on écrit sans les words (ou avec les words précédents selon la décision phase 4)

**Effort** : 1 journée (duplication + tests + debug du round-trip).

---

### Phase 4 — Hooks réels

#### 4.1 `onLoadDocument` : seed depuis Mongo

```js
async onLoadDocument({ document, documentName, context }) {
  const model = require(`${process.cwd()}/lib/mongodb/models`)
  const { seedYDoc } = require("./schema/seedYDoc")

  const conversation = await model.conversations.getById(documentName)
  if (!conversation || conversation.length !== 1) {
    throw new Error(`Conversation ${documentName} not found`)
  }

  const turns = conversation[0].text || []

  // Stocker les turns complets (avec words) en mémoire pour le diff du onStoreDocument
  // Utiliser document.serverContext ou un Map externe
  this.lastFlushedTurns.set(documentName, turns)

  seedYDoc(document, turns)
  return document
}
```

⚠️ **Format des turns** : bien vérifier la shape exacte retournée par `model.conversations.getById`. D'après `turn.js:80`, c'est un array d'objets avec `turn_id`, `segment`, `words`, etc. Confirmer le naming et adapter `turnsToDoc` si besoin (le client utilise `id`, `startTime`, `endTime`, `words` — mapping à faire).

#### 4.2 `onStoreDocument` : diff + flushes atomiques

```js
async onStoreDocument({ document, documentName, context }) {
  const model = require(`${process.cwd()}/lib/mongodb/models`)
  const { docToTurns } = require("./schema/docToTurns")
  const { computeDiff } = require("./flush/diff")

  const newTurns = docToTurns(document)
  const oldTurns = this.lastFlushedTurns.get(documentName) || []

  const diff = computeDiff(oldTurns, newTurns)
  // diff = { updates: [...], additions: [...], deletions: [...] }

  try {
    for (const turn of diff.updates) {
      await model.conversations.updateTurnAtomic(documentName, turn.turn_id, turn)
    }
    for (const turn of diff.additions) {
      await model.conversations.addTurnAtomic(documentName, turn)
    }
    for (const turnId of diff.deletions) {
      await model.conversations.removeTurnAtomic(documentName, turnId)
    }

    this.lastFlushedTurns.set(documentName, newTurns)
    debug(`Flushed doc=${documentName}: ${diff.updates.length} updates, ${diff.additions.length} adds, ${diff.deletions.length} dels`)
  } catch (err) {
    console.error(`Flush failed for doc=${documentName}:`, err)
    // Ne pas update lastFlushedTurns — on retryera au prochain flush
  }
}
```

#### 4.3 Config du debounce

Hocuspocus a un debounce natif pour `onStoreDocument` :
```js
Hocuspocus.configure({
  debounce: 10000,       // 10 secondes après le dernier change
  maxDebounce: 30000,    // force-flush au bout de 30s même si ça continue à changer
  unloadImmediately: false,
  timeout: 5 * 60 * 1000, // 5 min : unload le Y.Doc après 5 min sans clients
  // ...
})
```

#### 4.4 `computeDiff`

```js
// components/EditorHandler/flush/diff.js
function computeDiff(oldTurns, newTurns) {
  const oldById = new Map(oldTurns.map((t) => [t.turn_id, t]))
  const newById = new Map(newTurns.map((t) => [t.turn_id, t]))

  const updates = []
  const additions = []
  const deletions = []

  for (const newTurn of newTurns) {
    const oldTurn = oldById.get(newTurn.turn_id)
    if (!oldTurn) {
      additions.push(newTurn)
    } else if (hasTurnChanged(oldTurn, newTurn)) {
      updates.push(newTurn)
    }
  }

  for (const oldTurn of oldTurns) {
    if (!newById.has(oldTurn.turn_id)) {
      deletions.push(oldTurn.turn_id)
    }
  }

  return { updates, additions, deletions }
}

function hasTurnChanged(a, b) {
  return a.segment !== b.segment || a.speaker_id !== b.speaker_id
  // Ne pas comparer words ni timestamps — ils ne sont pas dans le Y.Doc
}

module.exports = { computeDiff }
```

#### 4.5 Vérification d'accès en écriture

Dans `onAuthenticate`, appeler une fonction qui vérifie que l'user a le droit d'écrire dans la conversation. Regarder comment `requireConversationWriteAccess` middleware HTTP est implémenté dans studio-api (fichier `components/WebServer/middlewares/`) et extraire la logique en fonction standalone, comme fait pour le JWT.

**Effort phase 4 complète** : 2-3 jours (avec test end-to-end).

---

### Phase 5 — Intégration client

#### 5.1 Corriger `@tiptap/y-tiptap` manquant (cf. Phase 1.1)

#### 5.2 Exposer `core` depuis le webcomponent
**Fichier** : `studio-sdk/components/transcript-ui/src/webcomponent.ts`

**Problème actuel** (`webcomponent.ts:26-27`) : seul `createAudioPlugin` est installé. Pas de plugin éditeur, pas de Yjs.

**Fix** : exposer le `core` via `expose({ core })` pour que le consommateur puisse installer le plugin éditeur avec les options runtime (Y.Doc, awareness, user).

```ts
// webcomponent.ts
const LintoEditor = defineCustomElement({
  props: { /* ... */ },
  setup(props, { expose }) {
    // ...
    const core = createCore()
    core.use(createAudioPlugin())
    provideCore(core)

    expose({ core })  // ← le consommateur appelle el.core.use(...)

    return () => { /* ... */ }
  },
})
```

**Côté consommateur (studio-frontend)** :
```js
// dans le composant qui instancie <linto-editor>
import { createTranscriptionEditorPlugin } from '@linto/transcript-ui'
import { HocuspocusProvider } from '@hocuspocus/provider'

const editorEl = document.querySelector('linto-editor')
await customElements.whenDefined('linto-editor')

// Attention : accès à .core via l'élément, pas via props
const core = editorEl.core

const provider = new HocuspocusProvider({
  url: `wss://api.linto.tld/ws/editor`,
  name: conversationId,   // = documentName côté serveur
  token: userJwtToken,
  document: new Y.Doc(),
  onSynced: () => {
    console.log("Yjs doc synced from server")
  },
})

core.use(createTranscriptionEditorPlugin({
  document: provider.document,
  awareness: provider.awareness,
  user: { name: currentUser.name, color: currentUser.color },
  isConnected: /* ref branché sur provider.status */,
}))
```

#### 5.3 Attendre `synced` avant de créer l'éditeur Tiptap

**Fichier** : `studio-sdk/components/transcript-ui/src/plugins/transcriptionEditor/index.ts:148-159`

**Problème actuel** : le code seed le fragment si `fragment.length === 0`, puis crée l'éditeur. Race condition classique si le provider n'a pas fini de sync.

**Fix** : attendre que le provider ait terminé la synchro initiale. Deux options :
1. Le plugin reçoit un `ref<boolean>` `isSynced` en option et n'init l'éditeur que quand il passe à `true`
2. Le consommateur init le plugin seulement après l'event `onSynced` du provider

Option 1 est plus propre :
```ts
export interface TranscriptionEditorOptions {
  document?: Doc
  awareness?: Awareness
  field?: string
  user?: { name: string; color: string; [key: string]: unknown }
  isConnected?: Ref<boolean>
  /** Nouveau : ref qui passe à true quand le provider a fini la synchro initiale */
  isSynced?: Ref<boolean>
}
```

Dans `install()` :
```ts
const shouldInit = computed(() => {
  // Si pas d'externalDoc, on est en mode local : pas besoin d'attendre sync
  if (!externalDoc) return core.activeChannel.value != null
  // Mode collab : attendre sync + activeChannel
  return isSynced?.value === true && core.activeChannel.value != null
})

watch(shouldInit, (ready) => {
  if (!ready) return
  stopWaiting()
  initEditor(...)
}, { immediate: true })
```

**Supprimer complètement la logique de seed local** (`index.ts:148-155`) quand on est en mode collab : le serveur est seul responsable du seed. Le seed local ne sert que pour le mode offline/local-only (si jamais on veut le garder).

**Effort phase 5** : 1-2 jours.

---

### Phase 6 — Test end-to-end en local

Valider la boucle complète sur des données réelles avant tout déploiement.

**Setup** :
1. studio-api local avec `COMPONENTS=...,EditorHandler` et Mongo local
2. transcript-ui en dev (`bun dev`) — ou déjà intégré dans studio-frontend en dev
3. Deux navigateurs / deux onglets connectés au même conversation ID

**Cas de test** :
- [ ] Connexion → seed → rendu éditeur (temps < 2s)
- [ ] Édition solo → flush Mongo visible après 10s (vérifier dans Mongo client)
- [ ] Deux clients → édition simultanée → convergence visible chez les deux
- [ ] Déconnexion d'un client → pas de perte pour l'autre
- [ ] Reconnexion après coupure réseau → récupération propre, pas de duplication
- [ ] Fermeture d'onglet pendant flush en cours → pas de perte de données
- [ ] Client refresh la page → retrouve l'état à jour (même les edits pas encore flushés seraient perdus au refresh, mais au moins ce qui a été flushé est là)
- [ ] Crash studio-api pendant une session → reconnect client → reseed depuis Mongo (perte max = dernier flush)
- [ ] Split d'un turn (Enter dans un turn existant) → nouveau turn_id assigné, pas de duplicate, les deux turns persistent en base
- [ ] Cursors awareness visibles entre les deux clients

**Critère de validation Phase 6** : tous les cas ci-dessus passent sans perte de données ni duplication.

---

### Phase 7 — Extension Redis multi-replica

#### 7.1 Activer l'extension quand l'env var est set

Déjà fait dans le scaffold (Phase 2.3 `buildExtensions()`). Vérifier que le flag fonctionne :
- Sans `SOCKETIO_REDIS_HOST` → logs "Redis extension disabled, single-instance mode"
- Avec `SOCKETIO_REDIS_HOST` → logs "Redis extension enabled at ..."

#### 7.2 Tester en local avec 2 instances

**Setup** :
1. Démarrer un Redis local (`docker run -p 6379:6379 redis`)
2. Démarrer studio-api sur le port A avec `SOCKETIO_REDIS_HOST=localhost PORT=3001`
3. Démarrer studio-api sur le port B avec `SOCKETIO_REDIS_HOST=localhost PORT=3002`
4. Un proxy simple en round-robin (nginx local, ou lancer directement les deux clients sur chaque port)
5. Client A connecte sur port 3001, client B sur port 3002, même conversationId

**Vérifier** :
- Les deux clients voient les mêmes updates malgré les différentes replicas
- Le flush Mongo est fait une seule fois (pas deux — vérifier les logs des deux instances)
- Si une instance crash, l'autre continue à servir

⚠️ **Point à clarifier** : quelle instance fait le flush `onStoreDocument` quand plusieurs replicas ont le doc en mémoire ? Hocuspocus Redis extension gère ça via un lock implicite (à vérifier dans la doc), sinon deux instances peuvent flusher en même temps → concurrent writes sur Mongo.

**Effort phase 7** : 1 journée (dont debug du comportement multi-replica).

---

### Phase 8 — Hardening

Revenir aux bugs client du présent document (section 5) et les traiter dans l'ordre de priorité.

Selon les retours du test Phase 6, certains bugs se seront peut-être manifestés et d'autres non. Re-prioriser en fonction de l'expérience réelle.

---

## 5. Audit client-side (bugs du plugin éditeur)

Liste des problèmes trouvés lors de l'audit du plugin `transcript-ui/src/plugins/transcriptionEditor/`.
Certains sont résolus par l'architecture backend (notés ✅ par l'archi), d'autres restent à fixer côté client.

### Schéma client

```
BACKEND (source de vérité timestamps/mots, via Mongo + Hocuspocus)
   ↓
HocuspocusProvider (WS) ↔ Y.Doc ↔ @tiptap/extension-collaboration
   ↓
ProseMirror doc (Tiptap)
   ↓
TurnNode → VueNodeViewRenderer(TurnNodeView.vue) ← rendu
   ↓
StoreSync → TranslationStore.turns (état applicatif pour affichage + audio)
```

**Flux édition locale** : user tape → Tiptap tr → ySyncPlugin → Y.Doc → HocuspocusProvider WS → serveur.
**Flux édition distante** : serveur WS → HocuspocusProvider → Y.Doc → ySyncPlugin → ProseMirror → re-render.
**Flux surbrillance audio** : `audio.currentTime` → `activeWordId` → `WordHighlight.view` → `Decoration.inline` via `text.indexOf`.

### Bugs bloquants avant test réel

#### [ ] Client-1. `@tiptap/y-tiptap` absent du `package.json`
**Cf. Phase 1.1**. Fix trivial.

#### [ ] Client-2. Webcomponent n'installe pas le plugin éditeur
**Cf. Phase 5.2**. Exposer `core` via `expose({ core })`.

#### [~] Client-3. Race condition bootstrap (attente `synced`)
**Cf. Phase 5.3**. Fix : attendre `isSynced` avant d'init l'éditeur. **Partiellement résolu par l'archi** (le serveur est désormais seul responsable du seed, donc le seul risque est le timing côté client).

#### [ ] Client-4. `syncDocToStore` écrase les `words` dès qu'on touche au texte
**Fichier** : `src/plugins/transcriptionEditor/extensions/storeSync.ts:83-88`
```ts
if (newTurn.text === oldText) return { ...newTurn, words: old.words }
return newTurn // words: []
```
**Problème** : une frappe = tous les timestamps de mots de ce turn effacés côté store local. `WordHighlight` arrête de fonctionner, follow-playback perd la précision word-level.

**Décision produit à prendre** :
- Option A : accepter la dégradation (cohérent avec "timestamps = backend only" du CLAUDE.md)
- Option B : conserver un mapping best-effort (words préservés tant que leur texte n'a pas été modifié individuellement)

**Note** : tant qu'il n'y a pas de recompute backend automatique après édition, les words post-édition seront forcément stales. L'option A est plus honnête.

**Effort** : décision d'abord, puis 1-3h.

#### [ ] Client-5. Changement de traduction non supporté en collab
**Fichiers** : `src/plugins/transcriptionEditor/index.ts:173-183` et `:188-194`
**Problème** : `reloadContent` appelle `editor.commands.setContent` → pousse le contenu dans le Y.Doc partagé → corruption pour tous les clients.
**Fix temporaire pour v1** : désactiver le sélecteur de translation en mode collab (option `disabled` sur `SidebarSelect`).
**Fix design futur** : un `Y.XmlFragment` par translation (`field = translationId`), Hocuspocus `documentName = conversationId:translationId`. À reprendre en v2.
**Effort** : 15 min fix temporaire.

### Bugs majeurs — pendant/après le test

#### [ ] Client-6. Speakers non synchronisés collaborativement
**Fichiers** : `src/core/stores/speakersStore.ts`, `src/core/helpers/ensureSpeaker.ts`
**Problème** : `speakers.ensure()` auto-génère nom/couleur aléatoires pour tout ID inconnu. En collab, **chaque client auto-crée un speaker local avec nom/couleur différents** pour le même ID → rendu incohérent.
**Fix minimal** : fallback déterministe. Couleur = hash stable de l'ID (via `hsl(hash(id) * 137.5, 70%, 50%)` ou similaire), nom = `Speaker <short-id>`. Ainsi tous les clients voient la même chose sans sync.
**Fix complet (futur)** : Y.Map pour les speakers (`ydoc.getMap('speakers')`) + édition collaborative des noms/couleurs.
**Effort** : fallback 30 min.

#### [ ] Client-7. `suppressSync` est un flag module-level
**Fichier** : `src/plugins/transcriptionEditor/extensions/storeSync.ts:18`
**Problème** : `let suppressSync = false` global → deux instances d'éditeur simultanées s'écrasent.
**Fix** : encapsuler dans `Plugin.state` ou `Extension.storage`.
**Effort** : 30 min.

#### [ ] Client-8. `WordHighlight.indexOf` fragile face à la ponctuation
**Fichier** : `src/plugins/transcriptionEditor/extensions/wordHighlight.ts:39-52`
**Problème** : si un word contient ponctuation collée (`"Bonjour,"` vs textContent `"Bonjour"`), `indexOf` retourne -1 et `break` → plus aucun highlight sur le reste du turn.
**Fix** : normaliser ou matcher par offsets cumulés.
**Effort** : 1h.

#### [ ] Client-9. Perf `WordHighlight` sur documents longs
**Fichier** : `src/plugins/transcriptionEditor/extensions/wordHighlight.ts:30-54`
**Problème** : scan complet à chaque tick audio. 1h de transcription = jank probable.
**Fix** : index `turnId → position` maintenu sur `docChanged`, ou recherche incrémentale depuis le dernier mot actif.
**Effort** : 2-3h.

#### [ ] Client-10. `reloadContent` incompatible avec Yjs
**Fichier** : `src/plugins/transcriptionEditor/index.ts:188-194`
**Problème** : `setContent` pousse dans le CRDT partagé.
**Fix** : supprimer ou encadrer (lié au point Client-5).

#### [ ] Client-11. `fixDuplicateTurnIds` ne recalcule pas les timestamps
**Fichier** : `src/plugins/transcriptionEditor/extensions/storeSync.ts:116-139`
**Problème** : après split, les deux turns héritent des mêmes `startTime`/`endTime` → flicker de `activeTurnId`.
**Fix** : couper proportionnellement à la position du split, ou laisser `undefined` en attendant un recompute backend.
**Effort** : 1-2h.

#### [ ] Client-12. `id: null` possible sur turn créé via ProseMirror
**Fichiers** : `src/plugins/transcriptionEditor/extensions/turnNode.ts:20`, `utils/docToTurns.ts:17`
**Problème** : `addAttributes.id.default = null`. Turn créé via insertion ProseMirror sans passer par `fixDuplicateTurnIds` → id null dans le store.
**Fix** : `appendTransaction` qui assigne `crypto.randomUUID()` aux turns sans id, avant `fixDuplicateTurnIds`. **Ne pas** utiliser `default: () => crypto.randomUUID()` — Tiptap rappelle les defaults à chaque parse.
**Effort** : 30 min.

#### [ ] Client-13. `speaker:update` peut ne pas re-render les TurnNodeView
**Fichier** : `src/plugins/transcriptionEditor/components/TurnNodeView.vue:11-14`
**Problème** : `computed` dépend de `props.node.attrs.speakerId`, pas du `Map`. La réactivité de `shallowReactive(Map)` dans un sous-arbre Vue Tiptap peut être capricieuse.
**Action** : à tester en conditions réelles. Fix éventuel : passer par un `watch` sur `core.speakers.all` et forcer l'update.
**Effort** : test + fix éventuel 1h.

### Bugs mineurs

#### [ ] Client-14. `turnsToDoc` joint les words avec `" "`
**Fichier** : `src/plugins/transcriptionEditor/utils/turnsToDoc.ts:13-14`
**Problème** : round-trip fragile si les words contiennent déjà de la ponctuation collée.
**Action** : documenter le contrat côté `mapApiDocument` et `mapWhisperXDocument`.

#### [ ] Client-15. `isConnected` reste `false` si non fourni
**Fichier** : `src/plugins/transcriptionEditor/index.ts:53`
**Action** : brancher sur le `provider.status` côté consommateur (phase 5.2) + UI indicateur de sync.

#### [ ] Client-16. `updateUser` mute l'objet `user` partagé
**Fichier** : `src/plugins/transcriptionEditor/index.ts:74`
**Fix** : passer par une ref ou cloner.

#### [ ] Client-17. `TranscriptionPanel` bascule EditorContent vs `turns[]`
**Fichier** : `src/components/TranscriptionPanel.vue:158-166`
**Action** : à clarifier quand les modes seront définitifs. En v1 pas de live + édition simultanés (décision actée), donc pas bloquant.

#### [ ] Client-18. `onMounted` scrollRef init avant éditeur rendu
**Fichier** : `src/components/TranscriptionPanel.vue:69-73`
**Action** : mineur, à revoir si le scroll-to-bottom dysfonctionne.

---

## 6. Points d'attention et risques

### 6.1 Compatibilité CJS/ESM

`studio-api` est CommonJS. `@hocuspocus/server` et `@tiptap/*` sont a priori ESM-first (à vérifier). Si des imports dynamiques `await import()` sont nécessaires, ça force à rendre le constructor du component `EditorHandler` async, ce qui peut ne pas matcher le pattern existant.

**À vérifier dès la phase 2.2** : `node -e "const h = require('@hocuspocus/server'); console.log(h)"` après install. Si ça throw, revoir la stratégie (transpile via `esbuild` au moment du require, ou wrapper le component dans un init async).

### 6.2 Blast radius

Un bug Yjs dans studio-api (OOM sur gros doc, `Y.applyUpdate` sur update corrompu qui throw, boucle CRDT) peut crasher une replica API entière → impacte tous les endpoints, pas juste l'éditeur.

**Mitigations à implémenter pendant la phase 4** :
- `try/catch` systématique autour de tous les hooks Hocuspocus
- Limite de taille max de Y.Doc (`maxBytes` en config Hocuspocus si disponible, sinon check manuel dans `onChange`)
- Éviction des Y.Doc idle après X minutes (`timeout` en config Hocuspocus)
- Kubernetes memory limits sur les pods API (déjà en place probablement — à vérifier)
- Monitoring de la taille cumulée des Y.Doc en mémoire → alerte si > seuil

### 6.3 Comportement sans Redis

Si `SOCKETIO_REDIS_HOST` n'est pas défini au boot, pas d'extension Redis → mode single-instance :
- **Studio-api en une seule replica** : tout fonctionne normalement
- **Studio-api en plusieurs replicas sans Redis** : chaque replica a son propre Y.Doc en mémoire, aucune sync → deux users sur deux replicas différentes ne se voient pas. Données perdues au flush (chacune flush son état, la dernière gagne).

**Décision** : ne pas déployer en multi-replica sans Redis. Documenter. Éventuellement fail-fast au boot si `REPLICAS > 1 && !SOCKETIO_REDIS_HOST` — mais on ne connaît pas notre propre nombre de replicas, donc juste un warning clair dans les logs et dans la doc ops.

### 6.4 Conflit d'écriture Mongo inter-replicas

Si deux replicas flushent le même doc en même temps (scénario multi-replica avec extension Redis) → deux `updateTurnAtomic` concurrents sur le même turn → le second gagne via `$set` positional, mais si les deux contiennent des modifications différentes, la première est perdue.

**Mitigation** : Hocuspocus Redis extension a un mécanisme de lock qui assure qu'un seul worker exécute `onStoreDocument` pour un doc donné. **À vérifier** dans la doc actuelle de l'extension. Si ce n'est pas le cas, implémenter un lock via Redis (`SET NX EX`) dans notre `onStoreDocument`.

### 6.5 Eviction des Y.Doc et `lastFlushedTurns`

Le Map `lastFlushedTurns` utilisé pour le diff doit être nettoyé quand un Y.Doc est unloaded, sinon fuite mémoire.

**Fix** : ajouter un hook `onLoadDocument` / `onDestroyDocument` (ou équivalent) pour synchroniser le Map avec les Y.Doc actifs.

### 6.6 Transition Vue 2 / Vue 3

Voir section 3.4. À trancher au moment d'intégrer dans studio-frontend : flag `editor_version` sur les conversations, avec refus d'ouvrir une conv "v2" dans un client Vue 2.

---

## 7. Ordre d'exécution recommandé

```
Phase 1 (parallélisable, préalables indépendants)
  ├── 1.1 @tiptap/y-tiptap dans package.json          [2 min]
  ├── 1.2 updateTurnAtomic dans model                  [1h]
  └── 1.3 verifyJwtStandalone refactor                 [1-2h]

Phase 2 (après 1.3)
  └── 2.* Scaffold EditorHandler + test routing       [1 jour]

Phase 3 (après 2, parallélisable avec début phase 4)
  └── 3.* Schéma dupliqué + tests round-trip          [1 jour]

Phase 4 (après 2 et 3)
  └── 4.* Hooks réels onLoadDocument / onStoreDocument [2-3 jours]

Phase 5 (après 1.1, parallélisable avec phases 2-4)
  └── 5.* Intégration client (webcomponent + provider) [1-2 jours]

Phase 6 (après 4 et 5)
  └── 6.* Test end-to-end en local                     [1-2 jours]

Phase 7 (après 6)
  └── 7.* Activer extension Redis + test multi-replica [1 jour]

Phase 8 (après 7)
  └── 8.* Hardening : bugs client-side restants       [variable]
```

**Chemin critique** : 1.3 → 2 → 3 → 4 → 6. Estimé 6-9 jours de dev effectif.

Les phases 5 peuvent commencer en parallèle de 2-4 tant qu'un bouchon serveur existe.

---

## 8. Questions ouvertes (à trancher en cours de route)

1. **Format des turns côté Mongo vs côté client** : studio-api/Mongo utilise `turn_id`, `speaker_id`, `segment`, etc. Le client Vue 3 utilise `id`, `speakerId`, `text`, etc. Où faire le mapping ? Ma suggestion : côté serveur dans `seedYDoc` et `docToTurns`, au moment de la traduction vers/depuis le format Yjs. Le Y.Doc stocke le format client (camelCase), et `onLoadDocument`/`onStoreDocument` convertissent. Mais à confirmer en regardant concrètement les modèles des deux côtés.

2. **`checkConversationWriteAccess` standalone** : le middleware HTTP `requireConversationWriteAccess` existe. Il doit être extrait en fonction pure utilisable depuis `onAuthenticate`. Même pattern que `verifyJwtStandalone` mais pour l'autorisation.

3. **Quelle stratégie de lock Hocuspocus Redis ?** Vérifier la doc actuelle de `@hocuspocus/extension-redis` pour voir si le lock onStoreDocument est géré nativement. Sinon ajouter un lock manuel.

4. **Mapping user awareness** : le `context.userId` de `onAuthenticate` est fiable. Il faudra que l'awareness Yjs des cursors contienne aussi ce `userId` pour que la traçabilité des auteurs soit possible (même si l'audit log est reporté).

5. **Schéma partagé : duplication ou package ?** Pour v1, duplication dans studio-api (pragmatique, ~5 fichiers). À long terme, extraire `@linto/editor-schema` dans studio-sdk. Pas prioritaire.

6. **Tests automatisés** : pour le moment aucun test e2e n'est prévu pour la collab. Ajouter des tests Jest au moins sur le round-trip schéma (phase 3.3) et sur `computeDiff` (phase 4.4).

---

## 9. Commandes utiles

```bash
# Dev studio-api
cd studio-api
npm install
npm run dev         # debug mode avec nodemon

# Dev transcript-ui
cd studio-sdk/components/transcript-ui
bun install
bun dev             # vite dev server
bun run build:wc    # build webcomponent pour studio-frontend

# Dev studio-frontend (ancien Vue 2.7)
cd studio-frontend
# voir son package.json pour les commandes

# Redis local pour tester multi-replica
docker run --rm -p 6379:6379 redis:7
```
