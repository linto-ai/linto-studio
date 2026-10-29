<template>
  <span
    v-if="tag"
    class="user-id-tag"
    :style="{ '--user-id-tag-hue': tag.hue }"
    role="img"
    :title="label"
    :aria-label="label">
    <!-- <span class="user-id-tag__dot" aria-hidden="true"></span> -->
    <span aria-hidden="true">#{{ tag.code }}</span>
  </span>
</template>
<script>
import { computeUserTag } from "@/tools/user/computeUserTag.js"

export default {
  name: "UserIdTag",
  props: {
    userId: { type: String, default: null },
  },
  computed: {
    tag() {
      return computeUserTag(this.userId)
    },
    label() {
      return this.$t("user_id_tag.label", { code: this.tag?.code })
    },
  },
}
</script>

<style lang="scss" scoped>
.user-id-tag {
  display: inline-flex;
  align-items: center;
  // align-self: center;
  gap: 0.25em;
  flex-shrink: 0;
  font-family: monospace;
  font-weight: 500;
  font-size: 0.75rem;
  // color: var(--text-secondary);

  // background: hsl(var(--user-id-tag-hue), 58.4%, 84.9%);
  // padding: 2px 0.25rem;
  // border-radius: 30px;
  // border: 1px solid hsl(var(--user-id-tag-hue), 65%, 45%);

  color: var(--text-secondary);
  position: relative;
  top: -1px;
}

.user-id-tag__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background-color: hsl(var(--user-id-tag-hue) 65% 45%);
}

</style>
