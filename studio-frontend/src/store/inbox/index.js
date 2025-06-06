import $set from "lodash.set"

export default {
  namespaced: true,
  state: {
    medias: [],
    selectedMedias: [],
    autoselectMedias: false,
  },
  mutations: {
    setAutoselectMedias(state, autoselectMedias) {
      state.autoselectMedias = autoselectMedias;
    },
    setMedias(state, medias) {
      state.medias = medias;
    },
    appendMedias(state, medias) {
      state.medias = [...state.medias, ...medias];
    },
    clearMedias(state) {
      state.medias = [];
    },
    updateMedia(state, { mediaId, media }) {
      const idx = state.medias.findIndex(m => m._id === mediaId)
      if (idx !== -1) {
        state.medias.splice(idx, 1, media)
      }
    },
    setSelectedMedias(state, selectedMedias) {
      state.selectedMedias = selectedMedias;
    },
    addSelectedMedia(state, media) {
      state.selectedMedias.push(media);
    },
    removeSelectedMedia(state, media) {
      state.selectedMedias = state.selectedMedias.filter((m) => m._id !== media._id);
    },
    clearSelectedMedias(state) {
      state.selectedMedias = [];
    },
  },
  actions: {
    updateMedia({ commit }, { mediaId, media }) {
      commit("updateMedia", { mediaId, media });
    },
  },
  getters: {
    getMediaById: (state) => (mediaId) => {
      return state.medias.find((m) => m._id === mediaId);
    },
  },
};

export const fromConversations = (conversations) => {
  return conversations.map((conversation) => {
    return {
      _id: conversation._id,
      name: conversation.name,
      isSelected: false,
      tags: conversation.tags,
      owner: conversation.owner,
    };
  });
};