<template>
  <table style="width: 100%">
    <thead>
      <tr>
        <ArrayHeader
          @list_sort_by="sortBy"
          eventLabel="type"
          :label="$t('session.channels_list.labels.type')"
          :sortListKey="sortListKey"
          :sortListDirection="sortListDirection" />
        <ArrayHeader
          @list_sort_by="sortBy"
          eventLabel="name"
          :label="$t('session.channels_list.labels.name')"
          :sortListKey="sortListKey"
          :sortListDirection="sortListDirection" />
        <ArrayHeader
          @list_sort_by="sortBy"
          eventLabel="profileName"
          :label="$t('session.channels_list.labels.profile_name')"
          :sortListKey="sortListKey"
          :sortListDirection="sortListDirection" />
        <ArrayHeader
          @list_sort_by="sortBy"
          eventLabel="language"
          :label="$t('session.channels_list.labels.language')"
          :sortListKey="sortListKey"
          :sortListDirection="sortListDirection" />
        <th></th>
      </tr>
    </thead>
    <tbody>
      <SessionChannelsLine
        v-for="(channel, index) in channelsList"
        @removeChannel="removeChannel(index)"
        @updateName="updateName(index, $event)"
        :key="channel.id"
        :item="channel" />
    </tbody>
  </table>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import ArrayHeader from "./ArrayHeader.vue"
import SessionChannelsLine from "./SessionChannelsLine.vue"
export default {
  props: {
    channelsList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortListKey: "name",
      sortListDirection: "asc",
    }
  },
  mounted() {},
  methods: {
    sortBy(key) {
      if (this.sortListKey === key) {
        this.sortListDirection =
          this.sortListDirection === "asc" ? "desc" : "asc"
      } else {
        this.sortListKey = key
        this.sortListDirection = "asc"
      }
    },
    removeChannel(index) {
      this.$emit("removeChannel", index)
    },
    updateName(index, value) {
      this.$emit("updateName", index, value)
    },
  },
  components: { Fragment, ArrayHeader, SessionChannelsLine },
}
</script>
