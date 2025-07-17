export const exploreNavigationMixin = {
  methods: {
    generateUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8
          return v.toString(16)
        },
      )
    },

    updatePageUrl(page) {
      const url = new URL(window.location)
      if (page > 0) {
        url.searchParams.set("page", page)
      } else {
        url.searchParams.delete("page")
      }

      // Keep tags in URL if present
      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      } else {
        url.searchParams.delete("tags")
      }

      window.history.replaceState({}, "", url)
    },

    updateSearchUrl(search) {
      const url = new URL(window.location)
      if (search && search.trim().length > 0) {
        url.searchParams.set("search", search.trim())
      } else {
        url.searchParams.delete("search")
      }

      // Keep tags in URL if present
      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      } else {
        url.searchParams.delete("tags")
      }

      // Reset page when searching
      url.searchParams.delete("page")
      window.history.replaceState({}, "", url)
    },

    async initPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get("page")
      const searchParam = urlParams.get("search")
      const tagsParam = urlParams.get("tags")

      // Handle tags parameter
      if (tagsParam && tagsParam.trim().length > 0) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim())
        this.$store.dispatch(
          "tags/setExploreSelectedTags",
          tagIds
            .map((id) => {
              return this.availableTags.find((t) => t._id === id)
            })
            .filter((tag) => tag),
        )
      } else {
        // Clear selected tags if no tags parameter in URL
        this.$store.dispatch("tags/setExploreSelectedTags", [])
      }

      // Handle search parameter
      if (searchParam && searchParam.trim().length > 0) {
        this.search = searchParam.trim()
        this.mode = "search"
        this.filters = [
          {
            title: "Title filter",
            value: this.search,
            _id: this.generateUuid(),
            key: "titleConversation",
          },
        ]
      }

      if (pageParam && !isNaN(parseInt(pageParam))) {
        const targetPage = parseInt(pageParam)
        this.initialPage = targetPage
        this.page = targetPage

        if (targetPage > 0) {
          this.showPreviousButton = true
          await this.loadDataForMode(targetPage, false)
        } else {
          await this.loadDataForMode(0, false)
        }
      } else {
        await this.loadDataForMode(0, false)
      }

      this.isInitialLoad = false
    },

    async loadDataForMode(page, append) {
      if (this.mode === "search") {
        await this.apiSearchConversations(page, this.filters, append)
      } else {
        await this.fetchConversations(page, append)
      }
    },

    loadPreviousItems() {
      this.showPreviousButton = false
      this.initialPage = 0
      this.page = 0
      this.mode = "default"
      this.search = ""
      this.filters = []

      const url = new URL(window.location)
      url.searchParams.delete("page")
      url.searchParams.delete("search")

      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      }

      window.history.replaceState({}, "", url)

      this.resetSearch()
      this.clearSelectedMedias()
    },
  }
} 