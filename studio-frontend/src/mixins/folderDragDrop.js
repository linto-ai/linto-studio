export const folderDragDropMixin = {
  data() {
    return {
      isDragOver: false,
    }
  },
  methods: {
    parseDragData(e) {
      const folderId = e.dataTransfer.getData("folderId") || null
      const raw = e.dataTransfer.getData("conversationIds")
      const conversationIds = raw ? JSON.parse(raw) : null
      return { folderId, conversationIds }
    },
    onDragOver() {
      this.isDragOver = true
    },
    onDragLeave() {
      this.isDragOver = false
    },
  },
}
