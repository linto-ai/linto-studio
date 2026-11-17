<script>
// Functional (no instance, no DOM surgery) so the slotted content's own
// reactive v-if patches through Vue's normal diff. vue-fragment's <fragment>
// detaches its container div from the DOM at mount and only ever moves the
// nodes present at that instant — any node added/removed later (e.g. a
// child's v-if flipping once async data loads) is applied to that orphaned
// div and never reaches the page.
export default {
  name: "IsCloud",
  functional: true,
  render(h, { slots, parent }) {
    return parent.$store.getters["apiStatus/isSaas"] ? slots().default : null
  },
}
</script>
