<template>
  <section>
    <h3>{{ $t("session.profile_selector.title") }}</h3>
    <table style="width: 100%">
      <thead>
        <tr>
          <ArrayHeader
            @list_sort_by="sortBy"
            eventLabel="selected"
            :label="$t('session.profile_selector.labels.selected')"
            :sortListDirection="sortListDirection"
            :sortListKey="sortListKey" />
          <ArrayHeader
            @list_sort_by="sortBy"
            eventLabel="type"
            :label="$t('session.profile_selector.labels.type')"
            :sortListDirection="sortListDirection"
            :sortListKey="sortListKey" />
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
            eventLabel="translations"
            :label="$t('session.profile_selector.labels.translations')"
            :sortListDirection="sortListDirection"
            :sortListKey="sortListKey" />
        </tr>
      </thead>
      <tbody>
        <TranscriberProfileSelectorLine
          v-for="profile in l_profilesList"
          :profilesList="l_profilesList"
          :key="profile.id"
          :profile="profile"
          v-model="selectedProfiles" />
      </tbody>
    </table>
  </section>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import ArrayHeader from "./ArrayHeader.vue"
import TranscriberProfileSelectorLine from "./TranscriberProfileSelectorLine.vue"

export default {
  props: {
    profilesList: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
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
        console.log("set selectedProfiles", value)
        this.$emit("input", value)
      },
    },
  },
  mounted() {},
  methods: {
    sortBy(key) {
      console.log("sortBy", key)
    },
  },
  components: { Fragment, ArrayHeader, TranscriberProfileSelectorLine },
}
</script>
