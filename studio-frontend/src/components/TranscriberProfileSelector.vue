<template>
  <table style="width: 100%">
    <thead>
      <tr>
        <ArrayHeader
          eventLabel="selected"
          :label="$t('session.profile_selector.labels.selected')"
          :sortListDirection="sortListDirection"
          :sortListKey="sortListKey" />
        <ArrayHeader
          @list_sort_by="sortBy"
          eventLabel="config.type"
          :label="$t('session.profile_selector.labels.type')"
          :sortListDirection="sortListDirection"
          :sortListKey="sortListKey" />
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
        <ArrayHeader
          class="no-size"
          @list_sort_by="sortBy"
          eventLabel="translations"
          :label="$t('session.profile_selector.labels.translations')"
          :sortListDirection="sortListDirection"
          :sortListKey="sortListKey" />
        <!-- <ArrayHeader
            class="no-size"
            @list_sort_by="sortBy"
            eventLabel="translations"
            :label="$t('session.profile_selector.labels.diarization')"
            :sortListDirection="sortListDirection"
            :sortListKey="sortListKey" /> -->
      </tr>
    </thead>
    <tbody>
      <TranscriberProfileSelectorLine
        v-for="profile in sortedTranscriberProfiles"
        :multiple="multiple"
        :profilesList="sortedTranscriberProfiles"
        :key="profile.id"
        :profile="profile"
        v-model="selectedProfiles" />
    </tbody>
  </table>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { sortArray } from "@/tools/sortList.js"

import ArrayHeader from "@/components/ArrayHeader.vue"
import TranscriberProfileSelectorLine from "@/components/TranscriberProfileSelectorLine.vue"

export default {
  props: {
    profilesList: {
      type: Array,
      required: true,
    },
    value: {
      type: [Array, Object],
      required: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sortListKey: "name",
      sortListDirection: "asc",
      l_profilesList: structuredClone(this.profilesList), // TranscriberProfileSelectorLine uses shallow copy so we need to clone the list to avoid propagation to parent
    }
  },
  computed: {
    selectedProfiles: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    sortedTranscriberProfiles() {
      return sortArray(
        this.l_profilesList,
        this.sortListKey,
        this.sortListDirection,
      )
    },
  },
  mounted() {},
  methods: {
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
    },
  },
  components: { Fragment, ArrayHeader, TranscriberProfileSelectorLine },
}
</script>
