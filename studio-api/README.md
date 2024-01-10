# LinTO Studio API
Transcription / summarization / annotation api for recorded audio files 

## Installation

### Install dependencies

```bash
  npm install
```

you need also to install **Audiowavesform**. 

Audiowaveform is a C++ command-line application that generates waveform data from either MP3, WAV, FLAC, Ogg Vorbis, or Opus format audio files.
You need to install it to be able to generate audiowaveforms that be loaded with your audio.

Please read the [documentation](https://github.com/bbc/audiowaveform) to install it.

### Set environment variables

Duplicate *".envdefault"* file to create *".env"* file

```bash
cp .envdefault .env
```

### Run the project

```bash
  npm run start
```

## Migration

MongoMigration is a component that allows to migrate data from one version of the conversation manager to another one.

### Enabling migration

Two environment variables are required to use the component:
- `COMPONENTS` must contain the desired to be loaded  `MongoMigration`.
- `DB_MIGRATION_TARGET` must be set to the desired version (1.0.0)

### Migration process

The migration process is composed of two steps:

### Add migration version

The first step to add a new version is done by the creation of a new folder in `components/MongoMigration/version/`. The name of the folder must be the version number of the migration (it's better if they match *RELEASE.md* format). Then create a new file `collections_name.js` in that contain the needed data:

```javascript
module.exports = {
  up: async (db) => {
    // migration code example
    // db.collection(collections_name).updateMany({}, { $set: migration_update })
  },
  down: async (db) => {
    // rollback code example
    // db.collection(collections_name).updateMany({}, { $unset: migration_update })
  }
}
```

Make sure to create a `version.js` file to update the version on a migration step.
