<template>
  <span class="ai-credits-note">
    <PhIcon
      name="sparkle"
      size="xs"
      color="var(--pack-accent, var(--primary-color))" />
    <span><slot /></span>
  </span>
</template>

<script>
// The AI credits a file pack carries, as a small boxed line on the pack card.
// Phrasing content only, like the card it sits in (a pack card can be the
// <label> of a radio).
export default {
  name: "AiCreditsNote",
}
</script>

<style lang="scss" scoped>
.ai-credits-note {
  display: flex;
  align-items: center;
  gap: var(--tiny-gap);
  padding: var(--tiny-gap) var(--small-gap);
  border: 1px solid var(--neutral-20);
  border-radius: var(--border-radius-sm);
  background: var(--background-primary);
  font-size: var(--text-xs);

  .icon-svg {
    flex-shrink: 0;
  }
}
</style>
