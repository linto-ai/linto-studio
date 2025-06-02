<template>
  <div class="media-explorer-upload">
    <div class="media-explorer-upload__content">
      <div class="media-explorer-upload__icon">
        <span class="icon upload"></span>
      </div>
      <h3>Déposez vos fichiers médias ici</h3>
      <p>Formats acceptés : audio et vidéo</p>
      <div v-if="uploadProgress.length > 0" class="media-explorer-upload__progress">
        <div v-for="(file, index) in uploadProgress" :key="index" class="media-explorer-upload__progress-item">
          <div class="media-explorer-upload__progress-item-name">{{ file.name }}</div>
          <div class="media-explorer-upload__progress-item-bar">
            <div class="media-explorer-upload__progress-item-bar-fill" :style="{ width: file.progress + '%' }"></div>
          </div>
          <div class="media-explorer-upload__progress-item-percentage">{{ file.progress }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaExplorerUpload",
  props: {
    uploadProgress: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
.media-explorer-upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.media-explorer-upload__content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.media-explorer-upload__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.media-explorer-upload__progress {
  margin-top: 2rem;
  width: 100%;
}

.media-explorer-upload__progress-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.media-explorer-upload__progress-item-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.media-explorer-upload__progress-item-bar {
  flex: 2;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 1rem;
}

.media-explorer-upload__progress-item-bar-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.media-explorer-upload__progress-item-percentage {
  width: 40px;
  text-align: right;
}
</style> 