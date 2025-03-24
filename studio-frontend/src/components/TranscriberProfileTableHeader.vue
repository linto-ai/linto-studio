<template>
  <thead>
    <tr>
      <th class="no-size"></th>
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="name"
        :label="$t('session.profile_selector.labels.name')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="description"
        :label="$t('session.profile_selector.labels.description')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="languages"
        :label="$t('session.profile_selector.labels.languages')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="languages"
        :label="$t('session.profile_selector.labels.languages')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <th class="no-size"></th>
    </tr>
  </thead>
</template>
<script>
import { bus } from "@/main.js"
import ArrayHeader from "@/components/ArrayHeader.vue"

export default {
  props: {},
  data() {
    return {
      sortListKey: "name",
      sortListDirection: "asc",
    }
  },
  mounted() {},
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
  },
  components: {
    ArrayHeader,
  },
}
</script>
