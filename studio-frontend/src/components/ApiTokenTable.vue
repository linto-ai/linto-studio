<template>
  <table
    class="table-grid"
    style="grid-template-columns: auto auto 1fr 1fr 1fr auto; width: 100%">
    <TokenTableHeader
      @list_sort_by="sortBy"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection" />
    <tbody>
      <div class="table-loader" v-if="loading">
        <Loading />
      </div>
      <TokenTableLine
        v-for="token in tokenList"
        v-model="p_selectedTokens"
        :linkTo="linkTo"
        :key="token.id"
        :token="token" />
    </tbody>
  </table>
</template>
<script>
import TokenTableHeader from "./TokenTableHeader.vue"
import TokenTableLine from "./TokenTableLine.vue"
import Loading from "@/components/atoms/Loading.vue"
export default {
  props: {
    tokenList: {
      type: Array,
      required: true,
    },
    linkTo: {
      type: Object,
      required: false,
    },
    value: {
      //selectedTokens
      type: Array,
      required: true,
    },
    sortListKey: {
      type: String,
      required: true,
    },
    sortListDirection: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
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
  computed: {
    p_selectedTokens: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: { TokenTableHeader, TokenTableLine, Loading },
}
</script>
