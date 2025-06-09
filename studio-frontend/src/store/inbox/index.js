import $set from "lodash.set"

export default {
  namespaced: true,
  state: {
    medias: [],
    selectedMedias: [],
    autoselectMedias: false,
    uploadQueue: [],
    uploadProgress: {},
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
    addToUploadQueue(state, file) {
      state.uploadQueue.push(file);
    },
    removeFromUploadQueue(state, fileId) {
      state.uploadQueue = state.uploadQueue.filter(f => f.id !== fileId);
    },
    clearUploadQueue(state) {
      state.uploadQueue = [];
    },
    setUploadProgress(state, { fileId, progress }) {
      $set(state.uploadProgress, fileId, progress);
    },
    clearUploadProgress(state, fileId) {
      if (fileId) {
        delete state.uploadProgress[fileId];
      } else {
        state.uploadProgress = {};
      }
    },
    updateUploadFile(state, { fileId, updates }) {
      const file = state.uploadQueue.find(f => f.id === fileId);
      if (file) {
        Object.assign(file, updates);
      }
    },
  },
  actions: {
    updateMedia({ commit }, { mediaId, media }) {
      commit("updateMedia", { mediaId, media });
    },
    async uploadFiles({ commit, dispatch }, { files, service, organizationScope }) {
      const uploadedMedias = [];
      
      try {
        for (const file of files) {
          commit('addToUploadQueue', file);
          commit('setUploadProgress', { fileId: file.id, progress: 0 });
          
          for (let progress = 0; progress <= 100; progress += 10) {
            commit('setUploadProgress', { fileId: file.id, progress });
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const media = {
            _id: `media_${file.id}_${Date.now()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploaded',
            createdAt: new Date().toISOString(),
            service: service,
            organizationScope: organizationScope,
          };
          
          uploadedMedias.push(media);
          commit('removeFromUploadQueue', file.id);
          commit('clearUploadProgress', file.id);
        }
        
        commit('appendMedias', uploadedMedias);
        
        return { success: true, medias: uploadedMedias };
      } catch (error) {
        files.forEach(file => {
          commit('removeFromUploadQueue', file.id);
          commit('clearUploadProgress', file.id);
        });
        
        throw error;
      }
    },
    clearUploadState({ commit }) {
      commit('clearUploadQueue');
      commit('clearUploadProgress');
    },
  },
  getters: {
    getMediaById: (state) => (mediaId) => {
      return state.medias.find((m) => m._id === mediaId);
    },
    getUploadProgress: (state) => (fileId) => {
      return state.uploadProgress[fileId] || 0;
    },
    isUploading: (state) => {
      return state.uploadQueue.length > 0;
    },
    totalUploadProgress: (state) => {
      if (state.uploadQueue.length === 0) return 0;
      
      const totalProgress = Object.values(state.uploadProgress).reduce((sum, progress) => sum + progress, 0);
      return totalProgress / state.uploadQueue.length;
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