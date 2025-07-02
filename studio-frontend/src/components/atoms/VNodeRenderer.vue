<script>
export default {
  functional: true,
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
  render(h, { props }) {
    return props.nodes;
  },
};
</script> 