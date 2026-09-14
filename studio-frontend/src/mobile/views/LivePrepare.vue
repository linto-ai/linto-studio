<template>
  <ComingSoon :title="$t('mobile.home.live_title')" />
</template>

<script>
import ComingSoon from "@/mobile/components/ComingSoon.vue"

export default {
  name: "MobileLivePrepare",
  components: { ComingSoon },
}
</script>
