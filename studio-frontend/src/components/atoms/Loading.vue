<template>
  <div
    id="loading-overlay"
    :class="background ? '' : 'overlay-transparent'"
    visible>
    <h2 v-if="title" class="loadind-overlay__title">{{ title }}</h2>
    <!-- <span class="icon loading loadind-overlay__icon"></span> -->
    <VueLoading :active="true" height="32" width="32"></VueLoading>
  </div>
</template>
<script>
import Loading from "vue-loading-overlay"
export default {
  props: {
    title: { required: false },
    background: { required: false, type: Boolean },
  },
  components: {
    VueLoading: Loading,
  },
}
</script>
