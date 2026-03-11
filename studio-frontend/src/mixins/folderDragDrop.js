export const folderDragDropMixin = {
  data() {
    return {
      isDragOver: false,
    }
  },
  methods: {
    parseDragData(e) {
      const raw = e.dataTransfer.getData("conversationIds")
      const conversationIds = raw ? JSON.parse(raw) : null
      return { conversationIds }
    },
    onDragOver() {
      this.isDragOver = true
    },
    onDragLeave() {
      this.isDragOver = false
    },
  },
}
