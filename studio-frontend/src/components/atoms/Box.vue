<template>
    <div class="box" :class="type" :style="style">
        <slot></slot>
    </div>
</template>

<script>
const BORDER_SIZES = ["1px", "2px", "3px", "4px", "5px", "0px"]
const COLORS = [
    "white",
    "black",
    "primary-soft",
    "primary-hard",
    "secondary-soft",
    "secondary-hard",
    "tertiary-soft",
    "tertiary-hard",
    "neutral-10",
    "neutral-20",
    "neutral-30",
    "neutral-40",
    "neutral-50",
    "neutral-60",
    "neutral-70",
    "neutral-80",
    "neutral-90",
    "neutral-100",
]

export default {
    name: "Box",
    props: {
        type: {
            type: String,
            default: "outline",
            validator: (value) => ["outline", "flat", "shadow"].includes(value),
        },
        borderSize: {
            type: String,
            default: "1px",
            validator: (value) => BORDER_SIZES.includes(value),
        },
        borderColor: {
            type: String,
            default: "neutral-40",
        },
        borderRadius: {
            type: String,
            default: "4px",
        },
        color: {
            type: String,
            default: "neutral-10",
            validator: (value) => COLORS.includes(value),
        },
        textColor: {
            type: String,
            default: "neutral-100",
            validator: (value) => COLORS.includes(value),
        },
        backgroundColor: {
            type: String,
            default: "neutral-10",
            validator: (value) => COLORS.includes(value),
        },
    },
    computed: {
        computedColor() {
            return `var(--${this.color})`
        },
        computedTextColor() {
            return `var(--${this.textColor})`
        },
        computedBorderColor() {
            return `var(--${this.borderColor})`
        },
        style() {
            return {
                backgroundColor: `var(--${this.backgroundColor})`,
                color: `var(--${this.textColor})`,
                borderColor: `var(--${this.borderColor})`,
                borderWidth: this.borderSize,
                borderRadius: this.borderRadius,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.box {
    border: 1px solid var(--neutral-10);

    &.outline {
        border: 1px solid var(--neutral-40);
    }

    &.shadow {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    &.flat {
        box-shadow: none;
    }
}
</style>
