<template>
  <ComingSoon :title="$t('mobile.home.media_title')" />
</template>

<script>
import ComingSoon from "@/mobile/components/ComingSoon.vue"

export default {
  name: "MobileMedia",
  components: { ComingSoon },
}
</script>
