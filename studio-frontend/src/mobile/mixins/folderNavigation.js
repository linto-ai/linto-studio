import { describeFolderPosition } from "@/mobile/tools/describeFolderPosition.js"
import { buildFolderPath } from "@/mobile/tools/buildFolderPath.js"

// Where the media list stands in the folder tree: the current folder comes
// from the route, its sub-folders and ancestors from the shared folders
// store (loaded here for the current organization).
export const folderNavigationMixin = {
  computed: {
    folderId() {
      return this.$route.params.folderId ?? null
    },
    folders() {
      return this.$store.state.folders.folders ?? []
    },
    position() {
      return describeFolderPosition(this.folders, this.folderId)
    },
    currentFolder() {
      return this.position.current
    },
    subfolders() {
      return this.position.subfolders
    },
    // undefined at the top level (no "up" row), null when the parent is the
    // top level, the parent folder otherwise.
    parentFolder() {
      return this.position.parent
    },
    folderPath() {
      return buildFolderPath(this.folders, this.folderId)
    },
    parentRoute() {
      const parentId = this.currentFolder?.parentId
      if (!this.folderId) return { name: "home" }
      return parentId
        ? { name: "media", params: { folderId: parentId } }
        : { name: "media" }
    },
  },
  created() {
    this.$store.dispatch("folders/fetchFolders")
  },
}
