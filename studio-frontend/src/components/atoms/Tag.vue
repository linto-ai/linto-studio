<template>
    <span class="tag" :class="classes">
        <slot />
    </span>
</template>

<script>
export default {
    name: "Tag",
    props: {
        color: {
            type: String,
            default: "neutral",
        },
        size: {
            type: String,
            default: "md",
        },
    },
    computed: {
        classes() {
            return [this.color, this.size];
        },
    },
};
</script>

<style lang="scss" scoped>
.tag {
    display: inline-block;
    padding: 0.15rem 0.25rem;
    border-radius: 4px;
    text-transform: uppercase;
    border: 1px solid var(--primary-soft);
    background-color: var(--neutral-40);
    font-weight: 500;

    &.primary {
        border-color: var(--primary-soft);
        background-color: var(--primary-soft);
    }
    &.secondary {
        border-color: var(--secondary-soft);
        background-color: var(--secondary-soft);
    }
    &.tertiary {
        border-color: var(--tertiary-soft);
        background-color: var(--tertiary-soft);
    }
    &.neutral {
        border-color: var(--neutral-soft);
        background-color: var(--neutral-soft);
    }

    &.xs {
        font-size: 0.75rem;
    }
    &.sm {
        font-size: 0.875rem;
    }
    &.md {
        font-size: 1rem;
    }
    &.lg {
        font-size: 1.125rem;
    }
    &.xl {
        font-size: 1.25rem;
    }
}
</style>