<template>
  <div class="card" :class="cardClass" @click="handleClick">
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    color: {
      type: String,
      default: "default",
    },
    link: {
      type: [Boolean, String],
      default: false,
    },
    type: {
      type: String,
      default: "outline",
    },
  },
  computed: {
    cardClass() {
      return [this.color, this.type, this.link ? "link" : ""]
    },
  },
  methods: {
    handleClick() {
      if (this.link) {
        if (typeof this.link === "string") {
          this.$router.push(this.link)
        } else {
          this.$emit("click")
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  background-color: var(--background-secondary);
  border-radius: 4px;
  padding: 1em;
  color: var(--neutral-100);
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  position: relative;

  &-content {
  }

  &.link {
    cursor: pointer;
  }

  &.flat {
    color: var(--neutral-10);

    &:hover {
      color: var(--neutral-90);
    }

    &.default {
      background-color: var(--neutral-10);
    }
    &.primary {
      background-color: var(--primary-color);

      &:hover {
        background-color: var(--primary-soft);
      }
    }
    &.secondary {
      background-color: var(--secondary-color);

      &:hover {
        background-color: var(--secondary-soft);
      }
    }
    &.tertiary {
      background-color: var(--tertiary-color);

      &:hover {
        background-color: var(--tertiary-soft);
      }
    }
    &.yellow {
      background-color: var(--yellow-color);

      &:hover {
        background-color: var(--yellow-soft);
      }
    }
    &.green {
      background-color: var(--green-color);

      &:hover {
        background-color: var(--green-soft);
      }
    }
  }

  &.outline {
    background-color: transparent;
    border: 1px solid var(--neutral-40);

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      z-index: 1;
      transition: all 0.2s ease-in-out;
    }

    &.active::before,
    &:hover::before {
      border-color: var(--neutral-80);
    }

    &:hover {
      border-color: var(--neutral-80);
    }

    &.primary {
      border-color: var(--primary-color);
      color: var(--primary-color);

      &:hover {
        color: var(--primary-hard);
        border-color: var(--primary-hard);
      }
    }
    &.secondary {
      border-color: var(--secondary-color);
      color: var(--secondary-color);

      &:hover {
        color: var(--secondary-hard);
        border-color: var(--secondary-hard);
      }
    }
    &.tertiary {
      border-color: var(--tertiary-color);
      color: var(--tertiary-color);

      &:hover {
        color: var(--tertiary-hard);
        border-color: var(--tertiary-hard);
      }
    }
    &.yellow {
      border-color: var(--yellow-color);
      color: var(--yellow-color);

      &:hover {
        color: var(--yellow-hard);
        border-color: var(--yellow-hard);
      }
    }
    &.green {
      border-color: var(--green-color);
      color: var(--green-color);

      &:hover {
        color: var(--green-hard);
        border-color: var(--green-hard);
      }
    }
  }
}
</style>
