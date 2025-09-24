import { RouterLink } from 'vue-router';
<template>
  <div
    class="flex align-center justify-center flex1 col center-text gap-medium">
    <h2>{{ $t("global_error.page_not_found") }}</h2>
    <Svglogo style="max-height: 15rem" />

    <Button
      :to="{ name: 'explore' }"
      variant="primary"
      :label="$t('global_error.back_to_home')" />
  </div>
</template>

<script>
import Svglogo from "@/svg/Desert.vue"

export default {
  props: {},
  mounted() {},
  methods: {},
  components: { Svglogo },
}
</script>
