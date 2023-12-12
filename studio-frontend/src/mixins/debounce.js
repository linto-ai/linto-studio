export const debounceMixin = {
  methods: {
    async debouncedSearch(query, queryParams, propertyLoading = "loading") {
      return new Promise((resolve, reject) => {
        this[propertyLoading] = true

        if (this.searchDebounce) {
          clearTimeout(this.searchDebounce)
        }

        setTimeout(() => {
          this.searchDebounce = setTimeout(async () => {
            try {
              const result = await this.queriedSearch(
                query,
                queryParams,
                propertyLoading
              )
              resolve(result)
            } catch (error) {
              reject(error)
            }
          }, 300)
        })
      })
    },
    async queriedSearch(query, queryParams, propertyLoading) {
      this[propertyLoading] = true
      // abort old search request
      if (this.searchController) {
        this.searchController.abort()
      }

      this.searchController = new AbortController()
      const signal = this.searchController.signal
      const request = await query(queryParams, signal)
      if (request) {
        this[propertyLoading] = false
      }

      return request
    },
  },
}
