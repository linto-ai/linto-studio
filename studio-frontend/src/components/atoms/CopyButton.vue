<template>
  <Button :icon="icon" iconWeight="regular" :loading="loading" @click="copy" />
</template>
<script>
export default {
  name: "CopyButton",
  props: {
    value: {
      type: [String, Function],
      required: true,
    },
    iconWeight: {
      type: String,
      default: "regular",
    },
  },
  data() {
    return {
      icon: "copy",
      loading: false,
    }
  },
  mounted() {},
  methods: {
    async copy() {
      try {
        if (this.loading) return
        if (typeof this.value === "function") {
          this.loading = true
          const res = await this.value()
          navigator.clipboard.writeText(res)
        } else {
          navigator.clipboard.writeText(this.value)
        }
        this.icon = "check"
        this.loading = false
        setTimeout(() => {
          this.icon = "copy"
        }, 2000)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
  components: {},
}
</script>
