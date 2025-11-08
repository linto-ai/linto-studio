<template>
  <button @click="toggleTheme()">
    <span
      :class="{
        icon: true,
        moon: currentTheme == 'dark',
        sun: currentTheme == 'light',
      }"></span>
  </button>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {},
  data() {
    return {
      currentTheme:
        document.documentElement.getAttribute("data-theme") ||
        localStorage.getItem("currentTheme") ||
        "default",
    }
  },
  mounted() {},
  methods: {
    toggleTheme() {
      if (this.currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "dark")
        this.currentTheme = "dark"
        localStorage.setItem("currentTheme", "dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        this.currentTheme = "light"
        localStorage.setItem("currentTheme", "light")
      }
    },
  },
}
</script>
