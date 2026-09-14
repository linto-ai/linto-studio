import { listChildFolders } from "@/mobile/tools/listChildFolders.js"
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
    currentFolder() {
      return this.$store.getters["folders/getFolderById"](this.folderId) ?? null
    },
    subfolders() {
      return listChildFolders(this.folders, this.folderId)
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
