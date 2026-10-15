<template>
  <p class="pack-ai-credits-included">
    <Avatar icon="sparkle" tag="span" size="lg" circle padded />
    <span class="pack-ai-credits-included__text">
      <strong>{{
        $t("billing.settings.packs.ai_credits_included.title", { credits })
      }}</strong>
      <span>{{ $t("billing.settings.packs.ai_credits_included.text") }}</span>
    </span>
  </p>
</template>

<script>
// The AI credits every pack of a group comes with, told once beside the
// packs instead of on each card. Colored by the palette of the group
// (--pack-accent, --pack-accent-soft).
export default {
  name: "PackAiCreditsIncluded",
  props: {
    credits: { type: Number, required: true },
  },
}
</script>

<style lang="scss" scoped>
.pack-ai-credits-included {
  // The icon on a plain disc, over the pale wash of the kind
  --avatar-background: var(--background-primary);
  --avatar-color: var(--pack-accent);
  display: flex;
  align-items: center;
  gap: var(--small-gap);
  box-sizing: border-box;
  margin: 0;
  padding: var(--medium-gap);
  border-radius: var(--border-radius-lg);
  background: var(--pack-accent-soft);
  font-size: var(--text-xs);
  color: var(--pack-accent);

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    strong {
      font-size: var(--text-sm);
    }
  }
}
</style>
