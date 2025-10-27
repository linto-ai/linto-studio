<template>
  <MainContentBackoffice>
    <ApiTokenTable :tokenList="tokenList" :loading="loading" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import ApiTokenTable from "@/components/ApiTokenTable.vue"

export default {
  props: {},
  data() {
    return {
      tokenList: [],
      loading: false,
    }
  },
  mounted() {},
  methods: {},
  components: {
    MainContentBackoffice,
    ApiTokenTable,
  },
}
</script>
