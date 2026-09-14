<template>
  <ComingSoon :title="$t('mobile.home.record_title')" />
</template>

<script>
import ComingSoon from "@/mobile/components/ComingSoon.vue"

export default {
  name: "MobileRecord",
  components: { ComingSoon },
}
</script>
