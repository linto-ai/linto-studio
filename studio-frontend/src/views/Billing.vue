<template>
  <LayoutV2>
    <IsCloud>
      <div class="billing-page">
        <div class="billing-page__inner">
          <SubscriptionPanel />
        </div>
      </div>
    </IsCloud>
  </LayoutV2>
</template>

<script>
// Standalone /billing route. Subscription management lives in the organization
// settings page (OrganizationsUpdate); this page renders the same panel and
// becomes the Checkout / Portal return page in J2.
import LayoutV2 from "@/layouts/v2-layout.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"
import SubscriptionPanel from "@/components-cloud/SubscriptionPanel.vue"

export default {
  name: "Billing",
  components: { LayoutV2, IsCloud, SubscriptionPanel },
}
</script>

<style lang="scss" scoped>
.billing-page {
  padding: 1.5em;
  overflow-y: auto;
  &__inner {
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>
