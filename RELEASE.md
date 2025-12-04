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
