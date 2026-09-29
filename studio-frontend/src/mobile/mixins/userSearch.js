import { searchUsers } from "@/mobile/services/share/conversationShare.js"

const SEARCH_DELAY_MS = 300

// Debounced platform-wide user search of the share sheet. Only the results
// of the latest text are kept; an older request in flight is aborted.
export const userSearchMixin = {
  data() {
    return { searchText: "", results: [], searching: false }
  },
  computed: {
    isSearching() {
      return this.searchText.trim().length > 0
    },
  },
  beforeDestroy() {
    this.resetSearch()
  },
  methods: {
    onSearch(text) {
      this.searchText = text
      clearTimeout(this.searchTimer)
      this.searchController?.abort()
      if (!text.trim()) {
        this.results = []
        this.searching = false
        return
      }
      this.searching = true
      this.searchTimer = setTimeout(
        () => this.runSearch(text.trim()),
        SEARCH_DELAY_MS,
      )
    },
    async runSearch(text) {
      this.searchController = new AbortController()
      const results = await searchUsers(text, this.searchController.signal)
      if (this.searchText.trim() !== text) return
      this.results = results
      this.searching = false
    },
    resetSearch() {
      clearTimeout(this.searchTimer)
      this.searchController?.abort()
      this.searchText = ""
      this.results = []
      this.searching = false
    },
  },
}
