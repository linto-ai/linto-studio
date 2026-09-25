<template>
  <section class="share-owner">
    <ShareSectionHeader
      icon="crown"
      :title="$t('share_menu.owner_label')"
      :count="1" />

    <div class="share-owner__row">
      <UserInfoInline :user="owner" :user-id="ownerId" :role="owner?.role" />
      <RightSelect :value="FULL_RIGHTS" readonly />
    </div>
  </section>
</template>

<script>
import RIGHTS from "@/const/userRights.js"

import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import ShareSectionHeader from "./ShareSectionHeader.vue"
import RightSelect from "./RightSelect.vue"

const FULL_RIGHTS =
  RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.DELETE + RIGHTS.SHARE

export default {
  name: "ShareOwnerSection",
  components: { UserInfoInline, ShareSectionHeader, RightSelect },
  props: {
    ownerId: { type: String, required: true },
    // Optional: UserInfoInline fetches the user itself when missing.
    owner: { type: Object, default: null },
  },
  data() {
    return { FULL_RIGHTS }
  },
}
</script>

<style lang="scss" scoped>
.share-owner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  border-radius: 4px;
  padding: 0.75rem;
  border: var(--border-block);
  box-shadow: var(--shadow-1);
  background-color: var(--background-primary);

  &__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
