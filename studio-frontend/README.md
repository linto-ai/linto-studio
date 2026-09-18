# LinTO Studio Frontend

Main web interface for LinTO Studio.

## Installation

You need studio-api and studio-websocket running.

### Install dependencies

```bash
  npm install
```

### Setup environnement variables

Copy _.envTemplate_ file as _.env_

```bash
  copy .envTemplate .env
```

- VUE_APP_HOST: The host of your application
- VUE_APP_PUBLIC_MEDIA: Linto Studio API media public path
- VUE_APP_CONVO_API: Linto Studio api url
- VUE_APP_CONVO_AUTH: Linto Studio auth service url
- VUE_APP_DEBUG: Enable or disable debug. "\*" for all debug, "vue" for only front debug, "worker" for worker debug. False otherwise.
- VUE_APP_MULTIFILE: activate support for multifile conversation (not well supported)
- VUE_APP_TURN_PER_PAGE: number max of turn per page
- VUE_APP_MAX_MERGED_TURN_SIZE: number max of characters allowed when merging two turns in the editor

### Run

To serve and render the interface:

#### Development mode

```bash
  npm run serve-dev
```

#### Build for production

To build static files (production mode), run

```bash
  npm run build
```

## Mobile app (`/m/`)

A second, lighter application lives under `src/mobile/` and is served at
`/m/`. It is built by its own Vite config (`vite.mobile.config.js`) into the
same `dist/`, so the classic bundle is unaffected by anything it imports.
nginx serves `mobile.html` for every `/m/*` navigation (`config/nginx/nginx.conf`).

- `npm run dev` serves both apps: open `http://localhost:8080/m/`.
- `npm run build` builds the classic app, then the mobile app.
- `VUE_APP_ENABLE_MOBILE_APP` (default `true`) sends phones (touch screen,
  short side up to 767px) that open the classic app to `/m/`. Set it to
  `false` to keep phones on the classic interface. The "Full Studio version"
  entry of the mobile account sheet sets a `mobile_optout` cookie.
- The service worker (`sw-mobile.js`, Workbox) is scoped to `/m/` and only
  registered by the mobile app, in production builds. To try it locally:
  `npm run build && npx vite preview` then open `/m/`.
- PWA manifest and icons: `public/manifest.webmanifest`, `public/img/pwa/`.
- Mobile strings live in `src/mobile/locales/` and are merged into the shared
  i18n instance at startup.
- Unit tests: `TEST=true npx ava "src/mobile/**/test/*.js"` (also part of
  `npm test`).

The mobile app only imports logic from the classic app (`src/api`,
`src/store`, `src/tools`, `src/mixins`, the editor web component), never its
screens. The editor and the live session open the classic pages.
