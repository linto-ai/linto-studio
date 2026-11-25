import * as queue from "@/api/indexedDB/queue.js"
import { sortRecordingsByDate } from "@/mobile/tools/sortRecordingsByDate.js"
import { normalizeLoadedRecordings } from "@/mobile/tools/normalizeLoadedRecordings.ts"
import { sumRecordingBytes } from "@/mobile/tools/sumRecordingBytes.js"
import { RECORDING_STATUS } from "@/mobile/const/recordingStatus.js"
import {
  deleteRecordingAudio,
  openRecordingAudio,
  readRecordingFile,
} from "@/mobile/store/recordings/recordingAudio.js"
import { recoverNativeFiles } from "@/mobile/store/recordings/recoverNativeFiles.js"
import {
  resolveSettings,
  sendRecording,
} from "@/mobile/store/recordings/sendRecording.js"

// Vuex module `mobileRecordings`: the phone's recordings (LocalRecording,
// see mobile/types/localRecording.ts). IndexedDB is the source of truth
// (queue.js); this state is its in-memory mirror, and this module is the
// only one writing the rows. The Record page creates a row when the
// microphone starts, completes its audio, and hands it over with `send`;
// from there the module sends it by itself, as soon as the network allows
// (retryPending runs at startup, on "online", on focus). The audio stays on
// the phone afterwards when the recording was kept, so the library links
// it to the server side.
const state = () => ({
  items: [],
  loaded: false,
  uploadingId: null,
})

// Aborts the upload in progress (the one of state.uploadingId). Not in the
// state: Vuex would observe it. Set and cleared by `upload` only.
let uploadAbortController = null

// The load in progress: pages and the upload resumption ask for it at the
// same time on startup. One load at a time, the others wait for it: two
// would recover (move) the same native file at once.
let loading = null

const PENDING_STATUSES = [
  RECORDING_STATUS.QUEUED,
  RECORDING_STATUS.ERROR,
  RECORDING_STATUS.UPLOADING,
]

const getters = {
  library: (state) =>
    sortRecordingsByDate(
      state.items.filter(
        (item) =>
          item.status !== RECORDING_STATUS.RECORDING &&
          item.status !== RECORDING_STATUS.NAMING,
      ),
    ),
  pending: (state) =>
    state.items.filter((item) => PENDING_STATUSES.includes(item.status)),
  pendingCount: (state, getters) => getters.pending.length,
  // Everything not on the server yet, the one being recorded included.
  unsentCount: (state) =>
    state.items.filter((item) => item.status !== RECORDING_STATUS.UPLOADED)
      .length,
  localBytes: (state, getters) => sumRecordingBytes(getters.library),
  byId: (state) => (id) => state.items.find((item) => item.id === id),
}

const mutations = {
  setItems(state, items) {
    state.items = items
    state.loaded = true
  },
  upsert(state, recording) {
    const index = state.items.findIndex((item) => item.id === recording.id)
    if (index === -1) state.items.push(recording)
    else state.items.splice(index, 1, recording)
  },
  remove(state, id) {
    state.items = state.items.filter((item) => item.id !== id)
  },
  setUploadingId(state, id) {
    state.uploadingId = id
  },
  // The steps of a sending are not saved; a row removed meanwhile stays
  // removed.
  setSendProgress(state, { id, sendProgress }) {
    const index = state.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      const recording = state.items[index]
      state.items.splice(index, 1, {
        ...recording,
        conversation: { ...recording.conversation, sendProgress },
      })
    }
  },
}

const actions = {
  load(context) {
    loading ??= loadRecordings(context).finally(() => {
      loading = null
    })
    return loading
  },

  // -- While recording (RecordingStage) --

  // A row built by buildLocalRecording, once the microphone started.
  async create({ commit }, recording) {
    commit("upsert", await queue.createRecording(recording))
  },
  // Part of the audio known along the way (size saved, gaps).
  async patchAudio(context, { id, audio }) {
    await saveRecordingPatch(context, id, { audio })
  },
  // The microphone stopped: the audio is complete and waits for its name.
  // The settings are those of the screen, kept only where the row has none
  // yet (the page was still loading them when it started).
  async finishRecording(context, { id, audio, settings }) {
    const known = context.getters.byId(id)?.conversation
    await saveRecordingPatch(context, id, {
      status: RECORDING_STATUS.NAMING,
      audio,
      conversation: {
        transcription: known?.transcription ?? settings?.transcription ?? null,
        sharing: known?.sharing ?? settings?.sharing ?? null,
      },
    })
  },

  // -- From the user --

  // The stop sheet is done with (sent or dismissed): the recording is
  // queued with its name and sent in the background. Only a recording
  // waiting for its name: a second call does nothing.
  async send(context, { id, name, keepAudio }) {
    if (context.getters.byId(id)?.status !== RECORDING_STATUS.NAMING) return
    await saveRecordingPatch(context, id, {
      name,
      keepAudio,
      status: RECORDING_STATUS.QUEUED,
    })
    context.dispatch("upload", id)
  },
  async rename(context, { id, name }) {
    await saveRecordingPatch(context, id, { name })
  },
  // A refusal waits for the user: sent again on demand.
  async retry(context, id) {
    await saveRecordingPatch(context, id, {
      status: RECORDING_STATUS.QUEUED,
      conversation: { sendError: null },
    })
    context.dispatch("upload", id)
  },
  // Removing the recording being sent cancels the request too, so the
  // server does not create its media. The media itself, once created,
  // lives on the server, in the media list.
  async remove({ state, getters, commit }, id) {
    if (state.uploadingId === id) uploadAbortController?.abort()
    await deleteStoredRecording(getters.byId(id) ?? { id })
    commit("remove", id)
  },
  async removeAll({ state, dispatch }) {
    const ids = state.items.map((item) => item.id)
    await Promise.all(ids.map((id) => dispatch("remove", id)))
  },
  // The audio as one File, to share it. null when nothing is stored.
  async readAudioFile({ getters }, id) {
    const recording = getters.byId(id)
    return recording ? readRecordingFile(recording) : null
  },
  // A URL to play the audio from, and how to free it ({ url, release }).
  // null when nothing is stored.
  async openAudio({ getters }, id) {
    const recording = getters.byId(id)
    return recording ? openRecordingAudio(recording) : null
  },

  // -- Sending --

  // One at a time: the others wait for the next retryPending. Removing
  // the recording meanwhile cancels it (uploadAbortController).
  async upload(context, id) {
    if (context.state.uploadingId) return
    context.commit("setUploadingId", id)
    uploadAbortController = new AbortController()
    const recording = await saveRecordingPatch(context, id, {
      status: RECORDING_STATUS.UPLOADING,
      conversation: { sendProgress: 0, sendError: null },
    })
    if (recording) {
      await sendAndSaveResult(context, recording, uploadAbortController.signal)
    }
    uploadAbortController = null
    context.commit("setUploadingId", null)
  },
  // Network errors retry by themselves; a refusal waits for the user.
  async retryPending({ getters, dispatch }) {
    const retryable = getters.pending.filter(
      (item) =>
        item.status === RECORDING_STATUS.QUEUED ||
        item.conversation.sendError?.retryable,
    )
    for (const item of retryable) {
      await dispatch("upload", item.id)
    }
  },
}

// The only way a row changes: written in IndexedDB first, then mirrored.
// Answers the row as saved, null when it no longer exists.
async function saveRecordingPatch({ commit }, id, patch) {
  const updated = await queue.updateRecording(id, patch)
  if (updated) commit("upsert", updated)
  return updated
}

async function loadRecordings({ state, commit }) {
  const loadStartedAt = Date.now()
  const stored = await recoverNativeFiles(
    await queue.listRecordings(),
    loadStartedAt,
  )
  const { keep, remove, patches } = normalizeLoadedRecordings(
    stored,
    state.uploadingId,
  )
  await Promise.all(
    remove.map((id) =>
      deleteStoredRecording(stored.find((item) => item.id === id)),
    ),
  )
  await Promise.all(
    patches.map(({ id, patch }) => queue.updateRecording(id, patch)),
  )
  commit("setItems", keep)
}

async function sendAndSaveResult(context, recording, signal) {
  const settings = await settingsToSend(context, recording)
  const result = signal.aborted
    ? { ok: false, canceled: true }
    : await sendRecording(
        recording,
        settings,
        (sendProgress) =>
          context.commit("setSendProgress", { id: recording.id, sendProgress }),
        signal,
      )
  await saveSendResult(context, recording.id, result)
}

// What the row was frozen with; what it misses is resolved from the
// remembered choices and saved, so the next try sends the same.
async function settingsToSend(context, recording) {
  const { transcription, sharing } = recording.conversation
  switch (true) {
    case Boolean(transcription && sharing):
      return { transcription, sharing }
    default:
      return resolveMissingSettings(context, recording)
  }
}

async function resolveMissingSettings(context, recording) {
  const resolved = await resolveSettings(recording)
  const settings = {
    transcription:
      recording.conversation.transcription ?? resolved.transcription,
    sharing: recording.conversation.sharing ?? resolved.sharing,
  }
  await saveRecordingPatch(context, recording.id, { conversation: settings })
  return settings
}

// A canceled sending was removed by the user: nothing left to update.
async function saveSendResult(context, id, result) {
  switch (true) {
    case result.ok:
      await finishSending(context, id, result.conversationId)
      break
    case Boolean(result.canceled):
      break
    default:
      await saveRecordingPatch(context, id, {
        status: RECORDING_STATUS.ERROR,
        conversation: { sendError: result.error },
      })
  }
}

// Without its audio kept, the row has nothing left to show: removed.
async function finishSending(context, id, conversationId) {
  switch (true) {
    case !context.getters.byId(id)?.keepAudio:
      await context.dispatch("remove", id)
      break
    default:
      await saveRecordingPatch(context, id, {
        status: RECORDING_STATUS.UPLOADED,
        conversation: {
          id: conversationId,
          sentAt: Date.now(),
          sendProgress: 100,
        },
      })
  }
}

// The row and its audio, wherever the audio is stored.
async function deleteStoredRecording(recording) {
  await queue.deleteRecording(recording.id)
  await deleteRecordingAudio(recording)
}

export default { namespaced: true, state, getters, mutations, actions }
