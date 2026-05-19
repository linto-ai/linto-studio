<template>
  <Loading v-if="loading" />
  <ErrorPage v-else-if="error" :error="error" />
  <div v-else-if="sessionList.length > 0" class="flex flex1 col">
    <SessionListLine
      v-for="session in sessionList"
      :key="session.id"
      :session="session"></SessionListLine>
    <Pagination
      v-if="totalPages > 1"
      :pages="totalPages"
      v-model="currentPage" />
  </div>
  <div v-else>
    <h2 class="center-text">
      {{ $t("session.list_page.no_sessions") }}
    </h2>
  </div>
</template>
<script>
import { bus } from "@/main"

import { apiGetSessionsPaginated } from "@/api/session.js"
import { genericSessionList } from "@/mixins/genericSessionList"
import sortSessionByDate from "@/tools/sortSessionByDate"

import Loading from "@/components/atoms/Loading.vue"
import ErrorPage from "@/components/ErrorPage.vue"
import SessionListLine from "@/components/SessionListLine.vue"
import Pagination from "@/components/molecules/Pagination.vue"

export default {
  mixins: [genericSessionList],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 0,
      totalPages: 0,
    }
  },
  watch: {
    currentPage() {
      this.fetchSessions()
    },
  },
  methods: {
    async fetchSessions() {
      this.loading = true
      try {
        const result = await apiGetSessionsPaginated(
          this.currentOrganizationScope,
          this.currentPage,
        )
        this.sessionList = result.list
          .filter((s) => s.name[0] != "@")
          .sort(sortSessionByDate)
        this.totalPages = Math.ceil(result.count / result.pageSize)
      } catch (e) {
        console.error(e)
        this.error = e
      } finally {
        this.loading = false
      }
    },
  },
  components: {
    Loading,
    ErrorPage,
    SessionListLine,
    Pagination,
  },
}
</script>
