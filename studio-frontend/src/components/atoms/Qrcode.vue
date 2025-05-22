<template>
  <div ref="qrcode" style="width: 100%; height: 100%">
    {{ value }}
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {
    // qrcode is imported as script in index.html (see public/index.html)
    // from https://github.com/kazuhikoarase/qrcode-generator
    var qr = qrcode("0", "M")
    qr.addData(this.value)
    qr.make()
    this.$refs.qrcode.innerHTML = qr.createSvgTag()
    this.$refs.qrcode.childNodes[0].setAttribute("height", "100%")
    this.$refs.qrcode.childNodes[0].setAttribute("width", "100%")
  },
  methods: {},
  components: {},
}
</script>
