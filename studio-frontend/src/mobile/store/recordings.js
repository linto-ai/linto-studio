import * as queue from "@/mobile/services/recording/queue.js"
import { uploadRecording } from "@/mobile/services/recording/uploadRecording.js"
import { sortRecordingsByDate } from "@/mobile/tools/sortRecordingsByDate.js"
import { RECORDING_STATUS } from "@/mobile/const/recordingStatus.js"

const RECENT_UPLOADS_LIMIT = 5

// Vuex module `mobileRecordings`: the queue of local recordings. IndexedDB
// is the source of truth (queue.js); this state is its in-memory mirror.
// One upload at a time; retryPending() is called on "online" and on focus.
const state = () => ({
  items: [],
  loaded: false,
  uploadingId: null,
})

const getters = {
  pending: (state) =>
    sortRecordingsByDate(
      state.items.filter((item) =>
        [
          RECORDING_STATUS.READY,
          RECORDING_STATUS.ERROR,
          RECORDING_STATUS.UPLOADING,
        ].includes(item.status),
      ),
    ),
  recent: (state) =>
    sortRecordingsByDate(
      state.items.filter((item) => item.status === RECORDING_STATUS.UPLOADED),
    ).slice(0, RECENT_UPLOADS_LIMIT),
  pendingCount: (state, getters) => getters.pending.length,
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
    commit("setItems", await queue.listRecordings())
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
      await queue.deleteRecording(id)
      commit("upsert", {
        ...state.items.find((item) => item.id === id),
        status: RECORDING_STATUS.UPLOADED,
        uploadedAt: Date.now(),
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
  async retryPending({ getters, dispatch }) {
    const retryable = getters.pending.filter(
      (item) => item.status === RECORDING_STATUS.READY || item.error?.retryable,
    )
    for (const item of retryable) {
      await dispatch("upload", item.id)
    }
  },
}

export default { namespaced: true, state, getters, mutations, actions }
