<template>
  <thead>
    <tr>
      <th class="no-size"></th>
      <ArrayHeader
        class="no-size"
        @list_sort_by="sortBy"
        eventLabel="organizationId"
        :sortListKey="sortListKey"
        :sortListDirection="sortListDirection">
        <span class="icon work" />
      </ArrayHeader>
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="config.name"
        :label="$t('session.profile_selector.labels.name')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="config.description"
        :label="$t('session.profile_selector.labels.description')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="config.languages.0.candidate"
        :label="$t('session.profile_selector.labels.languages')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" />
      <!-- <ArrayHeader
        @list_sort_by="sortBy"
        eventLabel="organizationId"
        :label="$t('session.profile_selector.labels.organization')"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey" /> -->
      <th class="no-size"></th>
    </tr>
  </thead>
</template>
<script>
import { bus } from "@/main.js"
import ArrayHeader from "@/components/ArrayHeader.vue"

export default {
  props: {
    sortListKey: {
      type: String,
      required: false,
      default: "name",
    },
    sortListDirection: {
      type: String,
      required: false,
      default: "asc",
    },
  },
  data() {
    return {}
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
