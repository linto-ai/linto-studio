<template>
  <div
    class="horizontal-scroller"
    :class="{
      'horizontal-scroller--has-prev': canScrollPrev,
      'horizontal-scroller--has-next': canScrollNext,
    }"
    role="region"
    :aria-label="label">
    <component
      :is="tag"
      ref="viewport"
      class="horizontal-scroller__viewport"
      :tabindex="isScrollable ? 0 : null"
      @scroll.passive="updateEdges">
      <slot />
    </component>
    <Button
      class="horizontal-scroller__arrow horizontal-scroller__arrow--prev"
      variant="secondary"
      shape="circle"
      size="sm"
      icon="caret-left"
      :disabled="!canScrollPrev"
      :aria-label="$t('horizontal_scroller.previous')"
      @click="scrollByItem(-1)" />
    <Button
      class="horizontal-scroller__arrow horizontal-scroller__arrow--next"
      variant="secondary"
      shape="circle"
      size="sm"
      icon="caret-right"
      :disabled="!canScrollNext"
      :aria-label="$t('horizontal_scroller.next')"
      @click="scrollByItem(1)" />
  </div>
</template>

<script>
import { computeScrollEdges } from "@/tools/computeScrollEdges"

// One row of items that scrolls sideways, each item snapping to the start.
// Arrows on the edges (pointer devices only) and a fade show there is more
// on that side; both go away when everything fits. The row is a named
// region, focusable while it scrolls, so the keyboard arrows scroll it too.
export default {
  name: "HorizontalScroller",
  props: {
    // Name of the region for assistive technologies
    label: { type: String, required: true },
    // ul when the items are <li> (the row keeps its list semantics)
    tag: {
      type: String,
      default: "div",
      validator: (value) => ["div", "ul"].includes(value),
    },
  },
  data() {
    return {
      canScrollPrev: false,
      canScrollNext: false,
    }
  },
  computed: {
    isScrollable() {
      return this.canScrollPrev || this.canScrollNext
    },
  },
  mounted() {
    // Not reactive state: only the edges are
    this.resizeObserver = new ResizeObserver(this.updateEdges)
    this.resizeObserver.observe(this.$refs.viewport)
    this.updateEdges()
  },
  // Items added or removed change the scroll width without resizing the row
  updated() {
    this.updateEdges()
  },
  beforeDestroy() {
    this.resizeObserver.disconnect()
  },
  methods: {
    updateEdges() {
      const { canScrollPrev, canScrollNext } = computeScrollEdges(
        this.$refs.viewport,
      )
      this.canScrollPrev = canScrollPrev
      this.canScrollNext = canScrollNext
    },
    // One item further; the snap lands it on the start edge
    scrollByItem(direction) {
      const viewport = this.$refs.viewport
      viewport.scrollBy({
        left: direction * computeItemStep(viewport),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
    },
  },
}

// Width of an item plus the gap to the next one
function computeItemStep(viewport) {
  const item = viewport.firstElementChild
  if (!item) return 0
  const gap = parseFloat(getComputedStyle(viewport).columnGap) || 0
  return item.offsetWidth + gap
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
</script>

<style lang="scss" scoped>
.horizontal-scroller {
  // What the fades blend into: the background behind the row
  --horizontal-scroller-fade: var(--background-primary);
  // Room kept under the items for the scrollbar. The fades stop above it
  // and the arrows center on the items, not on the whole row.
  --horizontal-scroller-scrollbar-room: var(--small-gap);
  position: relative;
  min-width: 0;

  // Fades over the edge items, shown on the sides with more to see
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: var(--horizontal-scroller-scrollbar-room);
    // Above the items; the arrows sit above the fades
    z-index: 1;
    width: 3rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &::before {
    left: 0;
    background: linear-gradient(
      to right,
      var(--horizontal-scroller-fade),
      transparent
    );
  }

  &::after {
    right: 0;
    background: linear-gradient(
      to left,
      var(--horizontal-scroller-fade),
      transparent
    );
  }

  &--has-prev::before,
  &--has-next::after {
    opacity: 1;
  }

  &__viewport {
    display: flex;
    gap: var(--medium-gap);
    margin: 0;
    padding: 0 0 var(--horizontal-scroller-scrollbar-room);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    list-style: none;

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    // The items come from the parent: they keep their width and snap
    > :deep(*) {
      flex-shrink: 0;
      margin: 0;
      scroll-snap-align: start;
    }
  }

  &__arrow {
    position: absolute;
    top: calc(50% - var(--horizontal-scroller-scrollbar-room) / 2);
    // Above the fades
    z-index: 2;
    transform: translateY(-50%);
    box-shadow: var(--shadow-2);
    transition: opacity 0.15s ease;

    &--prev {
      left: var(--small-gap);
    }

    &--next {
      right: var(--small-gap);
    }

    // Nothing that way: out of sight, and out of the tab order (disabled)
    &:disabled {
      opacity: 0;
      pointer-events: none;
    }

    // Touch screens swipe; the fade alone tells there is more
    @media (hover: none) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after,
    &__arrow {
      transition: none;
    }
  }
}
</style>
