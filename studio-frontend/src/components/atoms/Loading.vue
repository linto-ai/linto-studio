<template>
  <div
    id="loading-overlay"
    :block="block"
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
    block: { required: false, type: Boolean }, // will be positioned static instead of absolute centered
  },
  components: {
    VueLoading: Loading,
  },
}
</script>

<style>
#loading-overlay:not([block]) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 50;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0;

  &.overlay-transparent {
    background-color: transparent;

    .vld-background {
      background-color: transparent;
    }
  }
}

#loading-overlay[block] {
  position: static;
}

#loading-overlay[visible] {
  display: flex;
}

.loadind-overlay__loader-container {
  height: 40px;
  width: 40px;
}
</style>
