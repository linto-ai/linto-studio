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
};

export const fromConversations = (conversations) => {
  return conversations.map((conversation) => {
    return {
      _id: conversation._id,
      name: conversation.name,
      isSelected: false,
    };
  });
};