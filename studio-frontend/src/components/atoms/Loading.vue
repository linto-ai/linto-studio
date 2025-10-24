<template>
  <div
    id="loading-overlay"
    :class="background ? '' : 'overlay-transparent'"
    visible>
    <h2 v-if="title" class="loadind-overlay__title">{{ title }}</h2>
    <!-- <span class="icon loading loadind-overlay__icon"></span> -->
    <div class="relative loadind-overlay__loader-container">
      <VueLoading
        :active="true"
        :height="32"
        :width="32"
        :is-full-page="false"></VueLoading>
    </div>
  </div>
</template>
<script>
import Loading from "vue-loading-overlay"
export default {
  name: "Loading",
  props: {
    title: { required: false },
    background: { required: false, type: Boolean },
  },
  components: {
    VueLoading: Loading,
  },
}
</script>

<style>
.loadind-overlay__loader-container {
  height: 36px;
  width: 36px;
}
</style>
