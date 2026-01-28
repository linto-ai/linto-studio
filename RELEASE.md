# 1.7.0

_2026_01_27_

- Amazon Transcribe support
  - Add Amazon Transcribe as a new transcriber profile option
- Session KPI export
  - New API endpoint to export session KPI data for analytics
- Security level enforcement on media
  - Media can now have a security level assigned at creation
  - Services (STT, LLM) with a lower security level than the media are automatically filtered out
  - Ensures sensitive media is only processed by services meeting the required security threshold
  - Standardized security level handling across the platform
- Release management script
  - New `release.sh` script to streamline version management
  - Automatic version bumping (--patch, --minor, --major)
  - Generates draft release notes from commits

# 1.6.2

_2026_01_16_

- Security level filtering
  - Add security level selector to transcriber profile editor in backoffice
  - Filter transcriber profiles based on security level on session creation page
  - Filter STT services based on security level on media creation page
  - Filter STT services and transcriber profiles on microphone and visioconference pages
  - Filter LLM services based on security level
- Channel-level streaming metrics for KPI
  - Track channel mount/unmount events with timestamps
  - Per-channel streaming duration and transcriber profile information
  - Aggregate streaming metrics (total channels, total duration, average duration)
- Logger documentation rewritten

# 1.6.1

_2025_12_04_

- Public sessions can now be password protected
- User actions are now logged in the database
- Live updating has been improved, with reconnection and better error handling
- External dependencies have been updated to fix vulnerabilities
- SSO functionality now uses an internal cookie-based system making the API sessionless
- Improve microphone and videoconference recording interface

# 1.6.0

_2025_10_08_

- This version is a major improvement, with redesigned layout/workflow for simplified UI/UX
  - User and organisation settings merged
  - Reworking of media listing with infinite scroll and better media management
  - Media are now sort depending of their transcription status and are updated in real time
  - Mobile interface greatly improved
  - Improvement of many UI components
- Frontend architecture improvements to prepare for future technical stack upgrade (Vue 3/React)
  - Store optimization and enhanced state management
  - Style system refactoring and atomic composition structure
  - Technical debt reduction by isolating unnecessary stack sections
- Tags simplification
  - Tags are not linked to category anymore, and can have a description field instead
- Google and Github single sign on login are now supported (SSO)
- Sessions connections are now tracked and saved in logs
- Handle api key to access rest api without being connected as a user
- A SDK is now available to wrap LinTO Studio api calls

# 1.5.6

_2025_06_24_

- Live Session
  - You can now name any session with an alias
  - Live Transcription is available for mobile devices
  - QRcodes allow easy access to live sessions
  - Audio is now saved at the end of a session
  - Session operators can add a custom watermark during live sessions
  - Operators can add any metadata to a session
  - Operators can now connect the local microphone devices to a live session
  - Quick sessions now support Jitsi and Bigbluebutton video conference subtitles
- Backoffice
  - You can manage transcriber profiles and their scope from backoffice
  - Add an api for session-api metrics (websocket connection and time connection)
- Automatic mail services are improved
- Summaries are now available in markdown format

# 1.5.5

_2025_01_15_

## New features

- Live Session
  - In LinTO Studio, you can now connect external audio streams with live transcription and translation
  - It also supports live transcription of your device microphone
  - Once finished, these live transcriptions are saved to your media library, with support for multiple channels and translation languages
- Backoffice and platform roles
  - Add platform administrator role for managing all organizations and users
  - Other platform roles are also available:
    - Organization initiators who have the right to create new organizations
    - Session operators for managing live sessions
    - System administrators who can manages all organizations
  - Add permissions per organization so you can customize each organization
    - 'Upload media' permission
    - 'Generate summary' permission
    - 'Create session' permission
- SSO
  - New login page with support of external SSO login by OIDC
  - Organizations can specify a matching mail domain to automatically add users to that organization

## Improvements

- Add search in transcription and highlights
- New speaker menu in editor
- Improve docx export
- Add support for interface themes
- The upload page has been improved and renamed "Start menu"
- Users can now import media from an external url

## Fixes

- Fix subtitle editor when deleting the last screen
- Fix default organization permissions upon user creation
- Select first transcription service by default when uploading media
- Multi-language support on media upload
- Fix member rights when uploading a media
- Fix tab name in export page to come from api instead of being hardcoded in interface
- Fix max number of speaker when diarization is set to auto
- Improved and better handling of LLM results

# 1.4.2

- English language support for the transcription

# 1.4.1

- Added metadata

# 1.4.0

- Merge conversation-manager to one repository
- Rename conversation-manager to linto-studio

---

# Historical releases (pre-merge)

The following release notes are from before the components were merged into a single repository.

## 1.4.3 _(2024-04-22)_

- `[frontend]` Improve lock during turn edition
- `[frontend]` Improve publish interface (PDF preview, LLM service for summary)
- `[frontend]` Quality of Life (better media listing, design, dark theme)
- `[frontend]` Added frontend tests
- `[websocket]` Add lock during turn edition

## 1.4.2 _(2024-02-26)_

- `[frontend]` Multiple fixes and QoL improvements
- `[frontend]` New font: Luciole
- `[frontend]` Implement new NLP service generation (selection menu)

## 1.4.0 _(2023-12-12)_

- `[frontend]` Update wavesurfer to v7
- `[frontend]` Add a new editor for the subtitles
- `[frontend]` Add dark theme
- `[frontend]` Improve algorithm that computes timestamps
- `[websocket]` Add subtitle collaborative edition

## 1.3.0 _(2023-10-26)_

- `[api]` Subtitle API with SRT, VTT, and Studio formats
- `[api]` DOCX conversion export functionality
- `[api]` Improved user notification handling via email
- `[frontend]` Improve user settings and email notifications
- `[frontend]` Description is now editable in conversation listing
- `[websocket]` Remove collaborative edition for name and description fields

## 1.2.0 _(2023-10-09)_

- `[api]` Manage multiple auth and refresh token
- `[frontend]` Add bulk import
- `[frontend]` Simplify breadcrumb and left menu
- `[frontend]` Improve media loading page with transcription steps
- `[frontend]` Add tag management on favorite and shared conversations
- `[websocket]` Refactoring code for jobs
- `[websocket]` Add steps to transcription job

## 1.1.3 _(2023-08-30)_

- `[api]` Refactoring API paths for new roles
- `[api]` Added highlight API and batch support
- `[frontend]` Add bulk share and bulk delete
- `[frontend]` New 'publish' page for exporting transcription
- `[frontend]` Add NLP feature to generate keywords
- `[websocket]` Support for NLP keywords

## 1.1.2 _(2023-06-05)_

- `[api]` Added pagination on conversation listing
- `[api]` Add new role: uploader
- `[frontend]` Add pagination on inbox, explore and "shared with" page
- `[frontend]` Support whisper model

## 1.1.1 _(2023-05-05)_

- `[api]` Added tags feature
- `[api]` Updated Swagger documentation
- `[api]` Added docx download feature
- `[frontend]` Add tag management to sort conversations
- `[frontend]` Implement favorites
- `[frontend]` Redesign navigation and conversation listing
- `[websocket]` Update to meet 1.1.1 API endpoints

## 1.1.0

- `[api]` Mongo model update
- `[api]` Refactoring of mailing library

## 1.0.4 _(2023-02-01)_

- `[frontend]` Fix file type check for all video and audio formats
- `[frontend]` Add 404 page and user right checks
- `[frontend]` Add EN syllabic support

## 1.0.3 _(2023-01-17)_

- `[api]` Implementation of migration system
- `[api]` Added import endpoint
- `[api]` Email sending for share, reset password, create user
- `[frontend]` Implement sendmail for sharing
- `[frontend]` Add bug report link

## 1.0.2 _(2022-12-19)_

- `[api]` Swagger documentation and UI
- `[api]` Magic-link authentication
- `[api]` Split conversation turn and multi-file support
- `[frontend]` Merge button under each turns
- `[frontend]` Magic link authentication
- `[frontend]` Pagination on conversation transcription view
- `[websocket]` Check user right before allowing client to connect

## 1.0.1 _(2022-11-24)_

- `[api]` API updates for turn handling and file deletion
- `[api]` WorkerWatcher component
- `[frontend]` Fix collaborative edition synchronisation
- `[frontend]` Implement audio filtered by speaker
- `[websocket]` Improve timebox algorithm
- `[dashboard]` Catch server error and send "500" http status code

## 1.0.0 _(2022-10-20)_

- `[api]` Handle sharedBy user information
- `[api]` Better management of private user / orga
- `[frontend]` Implement collaborative edition
- `[frontend]` Remove lock on conversation
- `[websocket]` First version of websocket server
- `[websocket]` Synchronize conversations for collaborative edition
- `[dashboard]` List and filter conversation-manager users
- `[dashboard]` Display stats (total audio, conversations, shared)

## 0.2.0

- `[api]` Split backend and frontend
- `[api]` Audio transformation with ffmpeg
- `[api]` Cron backup system
- `[frontend]` Split backend and frontend

## 0.1.0

- `[api]` First version of Conversation-Manager
