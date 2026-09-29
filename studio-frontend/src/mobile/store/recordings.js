import * as queue from "@/mobile/services/recording/queue.js"
import { uploadRecording } from "@/mobile/services/recording/uploadRecording.js"
import { sortRecordingsByDate } from "@/mobile/tools/sortRecordingsByDate.js"
import { normalizeLoadedRecordings } from "@/mobile/tools/normalizeLoadedRecordings.js"
import { sumRecordingBytes } from "@/mobile/tools/sumRecordingBytes.js"
import { RECORDING_STATUS } from "@/mobile/const/recordingStatus.js"

// Vuex module `mobileRecordings`: the phone's recordings. IndexedDB is the
// source of truth (queue.js); this state is its in-memory mirror. Every
// recording is sent as soon as the network allows (retryPending runs at
// startup, on "online", on focus); the audio stays on the phone afterwards
// when the recording was kept, so the library links it to the server side.
const state = () => ({
  items: [],
  loaded: false,
  uploadingId: null,
})

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
}

const actions = {
  async load({ commit }) {
    const { keep, remove } = normalizeLoadedRecordings(
      await queue.listRecordings(),
    )
    await Promise.all(remove.map((id) => queue.deleteRecording(id)))
    await Promise.all(
      keep
        .filter((item) => item.status === RECORDING_STATUS.QUEUED)
        .map((item) => queue.updateRecording(item.id, { status: item.status })),
    )
    commit("setItems", keep)
  },
  async create({ commit }, recording) {
    commit("upsert", await queue.createRecording(recording))
  },
  async patch({ commit }, { id, ...patch }) {
    const updated = await queue.updateRecording(id, patch)
    if (updated) commit("upsert", updated)
  },
  async remove({ commit }, id) {
    await queue.deleteRecording(id)
    commit("remove", id)
  },
  // The entry disappears with its audio: the media itself lives on the
  // server, in the media list.
  async discardAudio({ dispatch }, id) {
    await dispatch("remove", id)
  },
  async upload({ state, commit, dispatch }, id) {
    if (state.uploadingId) return
    commit("setUploadingId", id)
    await dispatch("patch", {
      id,
      status: RECORDING_STATUS.UPLOADING,
      progress: 0,
      error: null,
    })
    const result = await uploadRecording(id, (progress) =>
      commit("upsert", {
        ...state.items.find((item) => item.id === id),
        progress,
      }),
    )
    if (result.ok) {
      await dispatch("finishUpload", {
        id,
        conversationId: result.conversationId,
      })
    } else {
      await dispatch("patch", {
        id,
        status: RECORDING_STATUS.ERROR,
        error: result.error,
      })
    }
    commit("setUploadingId", null)
  },
  async finishUpload({ getters, dispatch }, { id, conversationId }) {
    const recording = getters.byId(id)
    if (!recording?.keepAudio) {
      await dispatch("remove", id)
      return
    }
    await dispatch("patch", {
      id,
      status: RECORDING_STATUS.UPLOADED,
      uploadedAt: Date.now(),
      conversationId,
      progress: 100,
    })
  },
  // Network errors retry by themselves; a refusal waits for the user.
  async retryPending({ getters, dispatch }) {
    const retryable = getters.pending.filter(
      (item) =>
        item.status === RECORDING_STATUS.QUEUED || item.error?.retryable,
    )
    for (const item of retryable) {
      await dispatch("upload", item.id)
    }
  },
}

export default { namespaced: true, state, getters, mutations, actions }
