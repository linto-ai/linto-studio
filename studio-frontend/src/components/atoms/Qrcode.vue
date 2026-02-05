<template>
  <div ref="qrcode" style="width: 100%; height: 100%">
    {{ value }}
  </div>
</template>
<script>
import qrcode from "qrcode-generator"

export default {
  name: "Qrcode",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  mounted() {
    var qr = qrcode(0, "M")
    qr.addData(this.value)
    qr.make()
    this.$refs.qrcode.innerHTML = qr.createSvgTag()
    this.$refs.qrcode.childNodes[0].setAttribute("height", "100%")
    this.$refs.qrcode.childNodes[0].setAttribute("width", "100%")
  },
}
</script>
