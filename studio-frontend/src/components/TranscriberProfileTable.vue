<template>
  <table
    class="table-grid"
    style="grid-template-columns: auto 1fr 1fr 1fr 1fr auto; width: 100%">
    <TranscriberProfileTableHeader
      @list_sort_by="sortBy"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection" />
    <tbody>
      <div class="table-loader" v-if="loading">
        <Loading />
      </div>
      <TranscriberProfileTableLine
        v-for="profile in transcriberProfilesList"
        v-model="p_selectedProfiles"
        :key="profile.id"
        :linkTo="linkTo"
        :profile="profile" />
    </tbody>
  </table>
</template>
<script>
import { bus } from "@/main.js"
import TranscriberProfileTableHeader from "./TranscriberProfileTableHeader.vue"
import TranscriberProfileTableLine from "./TranscriberProfileTableLine.vue"
import Loading from "./Loading.vue"

export default {
  props: {
    transcriberProfilesList: {
      type: Array,
      required: true,
    },
    linkTo: {
      type: Object,
      required: false,
    },
    value: {
      //selectedOrganizations
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
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
  computed: {
    p_selectedProfiles: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
  },
  components: {
    TranscriberProfileTableHeader,
    TranscriberProfileTableLine,
    Loading,
  },
}
</script>
