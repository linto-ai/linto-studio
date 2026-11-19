# LinTO Studio Frontend

Main web interface for LinTO Studio.

## Installation

You need studio-api running.

### Install dependencies

```bash
  npm install
```

### Configuration

Copy `.envTemplate` as `.env` and adjust it:

```bash
  cp .envTemplate .env
```

Every value is read through `getEnv()` (`src/tools/getEnv.js`), which looks
in this order and keeps the first one defined:

1. `window.VUE_APP_CONFIG`, loaded from `/config.js`. In the Docker image,
   `docker-entrypoint.sh` writes this file at container start from every
   `VUE_APP_*` variable of the container, so a deployed image is configured
   without rebuilding. Locally, `public/config.js` is an empty placeholder.
2. `import.meta.env`: the `.env` file, read by Vite at dev/build time (only
   variables prefixed with `VUE_APP_` are exposed).
3. The theme's `defaultEnvValues` (`themes/<theme>/index.js`).
4. The hardcoded defaults of `src/const/defaultEnv.js`.

All values are strings: boolean flags are only on when set to exactly
`true`.

#### Backend services

| Variable                       | Default                       | Description                                                                                                       |
| ------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `VUE_APP_CONVO_API`            | `http://127.0.0.1:8001/api`   | studio-api REST URL: **absolute** (`http://` or `https://`) and ending in `/api`. Every other studio-api URL is derived from its root (see below); a path such as `/cm-api/api` is refused and shown as the API being unreachable. |
| `VUE_APP_WEBSOCKET_TRANSPORTS` | `websocket`                   | Comma-separated Socket.IO transports, e.g. `websocket,polling`.                                                   |

From the root of `VUE_APP_CONVO_API` (`https://studio.linto.ai/cm-api/api`
→ `https://studio.linto.ai/cm-api`, `src/const/apiEndpoints.js`): `/auth`,
`/media`, `/features`, `/cloud`, and Socket.IO at the root's origin with the
path `<root path>/socket.io`. A deployment must serve studio-api that way.

#### Branding

| Variable                    | Default        | Description                                                                                                             |
| --------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `VUE_APP_NAME`              | `LinTO Studio` | Application name shown in the interface and on the login pages.                                                        |
| `VUE_APP_LOGO`              | _(none)_       | Logo file name, looked up in `public/img/`.                                                                             |
| `VUE_APP_THEME`             | `LinTO-green`  | Theme key from `themes/index.js`: `LinTO-green`, `elysee` or `european-union`. An unknown key falls back to `LinTO-green`. |
| `VUE_APP_SHOW_LOGIN_FOOTER` | `false`        | Show the footer of the login page.                                                                                      |

#### Features

SaaS mode (billing, plans and entitlements, live credit, organization
switcher), live sessions and speaker identification are not front settings:
the front asks studio-api `GET /features` before showing any page, and the
API answers from its own configuration (`CloudService` component,
`SESSION_API_ENDPOINT` + `BrokerClient` component,
`ENABLE_SPEAKER_IDENTIFICATION`). An API without this route (older than the
front) is shown as unreachable: deploy studio-api first.

| Variable                                | Default                 | Description                                                                                                                                  |
| --------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `VUE_APP_SAAS_LIVE_PRODUCT_URL`         | `https://linto.ai/live` | SaaS deployments only: page opened by the locked "Sessions" menu entry.                                                                           |
| `VUE_APP_ENABLE_SECURITY_LEVEL`         | `false`                 | Enable the security level choice on transcriptions and transcriber profiles.                                                                |
| `VUE_APP_DISABLE_USER_CREATION`         | `false`                 | Hide account creation (sign-up links and page).                                                                                              |
| `VUE_APP_DISABLE_USER_INVITATION`       | `false`                 | Disable invitations by email (organization members, conversation sharing).                                                                  |
| `VUE_APP_ENABLE_MOBILE_APP`             | `true`                  | Send phones to the mobile app under `/m/` (see [Mobile app](#mobile-app-m)).                                                                 |

#### Live sessions

| Variable                      | Default                                                          | Description                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `VUE_APP_DEFAULT_METADATA`    | _(empty)_                                                        | Comma-separated metadata keys pre-filled (with empty values) in the session creation form, e.g. `room,team`.      |
| `VUE_APP_SHOW_PARTIALS`       | `true`                                                           | Show in-progress text by default (users can still toggle it).                                                      |
| `VUE_APP_ENABLE_TTS`          | `false`                                                          | Enable browser text-to-speech of final segments.                                                                   |
| `VUE_APP_ENABLE_WATERMARK`    | `false`                                                          | Enable the watermark settings on sessions.                                                                         |
| `VUE_APP_WATERMARK_CONTENT`   | `Transcription by LinTO.ai $linto Open Source AI by $linagora` | Default watermark text; `$linto` and `$linagora` are replaced by the logos. A session's own settings take precedence. |
| `VUE_APP_WATERMARK_FREQUENCY` | `600`                                                            | Default interval between two watermark displays, in seconds.                                                       |
| `VUE_APP_WATERMARK_DURATION`  | `10`                                                             | Default watermark display duration, in seconds.                                                                    |
| `VUE_APP_ACCEPTED_JITSI_URLS` | _(empty: any URL)_                                               | Comma-separated allowlist for Jitsi meeting URLs (substring match, case-insensitive).                              |
| `VUE_APP_ACCEPTED_BBB_URLS`   | _(empty: any URL)_                                               | Same, for BigBlueButton.                                                                                            |
| `VUE_APP_ACCEPTED_TEAMS_URLS` | _(empty: any URL)_                                               | Same, for Microsoft Teams.                                                                                          |
| `VUE_APP_ACCEPTED_VISIO_URLS` | _(empty: any URL)_                                               | Same, for Visio.                                                                                                    |

#### Debug

| Variable               | Default  | Description                                                                                                    |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `VUE_APP_DEBUG`        | _(none)_ | Namespaces enabled for the [`debug`](https://github.com/debug-js/debug) logger, e.g. `*` for everything.      |
| `VUE_APP_SIMPLIFY_LOG` | `false`  | Print debug logs as plain `console.log` (each argument JSON-serialized) instead of using `debug`.            |

#### Build and container

| Variable               | Default | Description                                                                                    |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `NODE_ENV`             |         | Node environment for the dev tooling, `development` in `.envTemplate`.                         |
| `WEBSERVER_HTTP_PORT`  | `8080`  | Docker image only: port nginx listens on (the image runs rootless, so it must be above 1023).  |

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

## Native Android app (Capacitor) — proof of concept

The mobile front (`src/mobile/`) is also embedded in an Android app with
[Capacitor](https://capacitorjs.com/). The app does not load a website: it
ships the built HTML/JS and calls the API of an instance, by default
`https://studio.linto.ai/cm-api` (`src/mobile/const/defaultInstance.js`).
The deployment's features come from that API (`GET /features`, see
[Features](#features)); the other settings (theme, flags…) come from the frontend `.env` at
build time.

### Instance

The login page of the app shows the instance in use and a "Change
instance" link (`src/mobile/components/instance/`). For a typed address,
the app looks for the API under `<address>/cm-api`, then `<address>`: the
first one whose `GET /auth/list` answers a JSON array wins
(`src/mobile/services/native/switchInstance.js`). From that base:

`VUE_APP_CONVO_API` = base + `/api`, and every other URL is derived from it
as on the web (see [Backend services](#backend-services)).

The instance is saved in `localStorage` and written into
`window.VUE_APP_CONFIG` before any API module loads
(`applySavedInstance.js`, first import of `main.js`). Changing instance
deletes the phone's recording queue (the user confirms when some are not
sent yet), logs out and reloads the app. An API running locally is reached
with "Other instance…" and its address, e.g. `http://192.168.1.10:8001`.

### Dependencies

- Node.js 22 and npm 10 (as for the rest of the frontend). The Capacitor
  packages (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`) and
  the plugins are in `package.json`:
  - `@capacitor/app`: Android back button;
  - `@capgo/capacitor-audio-recorder` (MPL-2.0, used unmodified, source:
    https://github.com/Cap-go/capacitor-audio-recorder): native recording;
  - `@capawesome-team/capacitor-android-foreground-service`: the recording
    service;
  - `@capacitor/filesystem`: the recording files.
- JDK 21 (`java -version`).
- Android SDK with `platform-tools`, `platforms;android-36` and
  `build-tools;36.0.0`. Android Studio is not needed. Gradle is downloaded by
  the wrapper (`android/gradlew`) on the first build.

Installing the SDK from the command line, in your home folder, without
changing any shell profile:

```bash
mkdir -p ~/Android/Sdk/cmdline-tools
# Latest archive and its SHA-256: https://developer.android.com/studio
# ("Command line tools only")
curl -LO https://dl.google.com/android/repository/commandlinetools-linux-15859902_latest.zip
sha256sum commandlinetools-linux-15859902_latest.zip
unzip commandlinetools-linux-15859902_latest.zip
mv cmdline-tools ~/Android/Sdk/cmdline-tools/latest

SDKMANAGER=~/Android/Sdk/cmdline-tools/latest/bin/sdkmanager
$SDKMANAGER --sdk_root=$HOME/Android/Sdk --licenses
$SDKMANAGER --sdk_root=$HOME/Android/Sdk "platform-tools" "platforms;android-36" "build-tools;36.0.0"
```

### Build

Gradle finds the SDK through `ANDROID_HOME` (or `sdk.dir` in
`android/local.properties`, which git ignores):

```bash
env ANDROID_HOME=$HOME/Android/Sdk npm run app:apk
```

Gradle writes the APK to `android/app/build/outputs/apk/debug/app-debug.apk`;
the script copies it to `android/linto-studio-debug.apk`, which is committed.
To install it on a phone connected over USB (developer mode, USB debugging
on):

```bash
adb install -r android/linto-studio-debug.apk
```

Scripts:

- `npm run build:app`: builds the embedded front into `dist-app/`
  (`vite.app.config.js`, mode `app`).
- `npm run app:sync`: `build:app`, then copies it into the Android project
  (`cap sync android`).
- `npm run app:apk`: `app:sync`, then a debug APK (`./gradlew assembleDebug`)
  copied to `android/linto-studio-debug.apk`.

### How the app build differs from the web mobile build

- Served from the app's root (`https://localhost/`) instead of `/m/`: the
  mobile router and full-page navigations use `MOBILE_BASE`
  (`src/mobile/const/appTarget.js`).
- No service worker and no install offer (`IS_NATIVE_APP`); no "Full Studio
  version" link, the classic app is not embedded.
- The Android back button closes an open sheet, goes back from a sub-page and
  sends the app to the background from home or login
  (`src/mobile/services/native/listenForBackButton.js`).
- Recording goes on in the background and with the screen locked (see
  below). The microphone choice is hidden: the phone's default input is
  used.
- `mobile.html` is written as `index.html`, the page Capacitor loads.
- Only the files of `public/` the mobile front refers to are copied (fonts,
  images, `config.js`), not the classic app's assets
  (`config/vite/nativeAppPlugins.js`).

### Recording in the background

The web page cannot record once hidden; the app records through the phone
instead (`src/mobile/services/recording/NativeRecorder.js`, picked by
`createRecorder.js`):

- a foreground service of type `microphone`, with a notification
  ("Recording in progress"), keeps the microphone allowed once the app is
  hidden or the screen locked; it starts when recording starts, from the
  app shown (Android 14 requires it), and stops with the recording;
- the plugin writes one AAC file (ADTS, 16 kHz, 32 kbit/s), readable up to
  its last frame if the app is killed. It writes in the cache
  (`capacitor-audio-recorder/`); the file is moved to the app's files
  (`recordings/`) when the recording stops, Android may clear the cache;
- the recording entry stores the file's URI (`audioFileUri`) instead of
  chunks in IndexedDB. `recordingAudio.js` reads the audio wherever it is
  (send, share, play, delete); the web builds drop the native modules;
- the file size is saved every 10 s. At the next start, a recording cut
  short is recovered: its file moved and queued like on the web, a
  recording still held by the plugin stopped, files no recording points to
  deleted (`recoverNativeRecordings.js`).

Asked on the first recording: the microphone, then the notifications
(Android 13+; refused, the recording works all the same). The plugin
reports no error on Android: a file that has not grown for two size
reports (about 20 s, outside a pause) interrupts the recording. Not
detected: a phone call during the recording (Android records silence, no
gap is reported).

### Files

- `capacitor.config.json`: app id `ai.linto.studio`, name, `webDir`.
- `android/`: the native project, committed. Build outputs, the copied web
  front (`app/src/main/assets/public`) and `local.properties` are ignored.
  The microphone, foreground service and notification permissions, and the
  recording service, are declared in
  `android/app/src/main/AndroidManifest.xml`; the notification icon is
  `android/app/src/main/res/drawable/ic_stat_recording.xml`.
- `dist-app/` is not committed. The only committed APK is
  `android/linto-studio-debug.apk` (`android/.gitignore` ignores the others).

### Proof-of-concept limits

- `capacitor.config.json` allows cleartext HTTP and mixed content
  (`server.cleartext`, `android.allowMixedContent`) so the app, served over
  `https://localhost`, can reach an API on `http://` in the local network.
  Remove both before any release.
- The API must accept the app's origin: in `CORS_API_WHITELIST`
  (studio-api), `localhost` (any scheme) or both
  `https://localhost` (Android) and `capacitor://localhost` (iOS). Entries
  are matched exactly, not as substrings.
- Debug build signed with the debug key: not for distribution.
- SSO login runs in the phone's browser and comes back to the app through
  the link `ai.linto.studio://login/oidc`
  (`src/mobile/services/native/startSsoLogin.js`, `listenForSsoReturn.js`,
  intent filter in `AndroidManifest.xml`, `CFBundleURLTypes` in the iOS
  `Info.plist`). The instance must list that link in
  `MOBILE_SSO_REDIRECT_URIS` (studio-api, its default); on an older instance
  the login ends on the instance's website and does not come back.
- Default Capacitor icon and splash screen.
- The API address and the deployment's features (`GET /features`) follow the
  chosen instance; the other flags (theme, name…) are those of the build.
  "Forgot password" and "Create account" open the
  instance's address in the browser, which is the website only when the
  instance address is the web front's.

## Native iOS app (Capacitor) — proof of concept

Same app as Android (`ios/`, Swift Package Manager, iOS 15+, bundle id
`ai.linto.studio`), with the microphone and background audio declared in
`ios/App/App/Info.plist`, as well as the SSO return link. No Apple developer
account is needed for the simulator.

### Simulator build from GitHub Actions

`.github/workflows/ios-simulator.yml` builds it, unsigned, on each push
touching the front on `next` or `master` (or by hand from the Actions
tab, once the workflow is on the default branch). Its artifact
`linto-studio-ios-simulator.zip` holds `App.app`, for Apple silicon and Intel
Macs. On a Mac with Xcode (App Store, then open it once to install the iOS
simulator):

```bash
unzip linto-studio-ios-simulator.zip
open -a Simulator
xcrun simctl install booted App.app
xcrun simctl launch booted ai.linto.studio
```

### Build on a Mac

Xcode and the Node version of the repository's `.nvmrc`, then from
`studio-frontend/`:

```bash
npm ci
npm run app:sync:ios   # builds the front and copies it into ios/
npx cap run ios        # picks a simulator; or `npx cap open ios` and run from Xcode
```

The API must accept `capacitor://localhost` (or a bare `localhost`) in its
`CORS_API_WHITELIST`. The simulator records with the Mac's microphone;
background recording can only be checked on an iPhone.
