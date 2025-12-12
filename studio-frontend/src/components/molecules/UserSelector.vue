<template>
  <div>
    <input type="search" v-model="search"></input>
    <Popover v-model="showPopover">
      <SearchUsersList :searchMemberValue="search" :currentUser="currentUsers"/>
    </Popover>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import SearchUsersList from "../SearchUsersList.vue";
export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      search: "",
      showPopover: false,
    }
  },
  mounted() {},
  methods: {},
  watch: {
    search: function (newSearch, oldSearch) {
      if(newSearch.length > 0 && newSearch !== oldSearch){
        this.showPopover = true
      }
    }
  },
  computed: {
    currentUsers() {
      return this.value ? [this.value] : []
    }
  },
  components: {
    SearchUsersList
  },
}
</script>
