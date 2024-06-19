<template>
  <div class="flex col flex1 align-center justify-center">
    <h2 class="center-text">{{ $t("error.server_error.title") }}</h2>
    <img src="/img/raining_illustration.svg" style="height: 8rem" />
    <p>
      {{ $t("error.server_error.subtitle") }}
    </p>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
