<template>
  <tr>
    <td>
      <Checkbox
        class="line-selector"
        v-model="p_selectedProfiles"
        :checkboxValue="id"></Checkbox>
    </td>
    <td>
      {{ name }}
    </td>
    <td>
      {{ description }}
    </td>
    <td>{{ languages }}</td>
    <td>{{ languages }}</td>
    <td>
      <button>
        <span class="label">Edit</span>
        <span class="icon edit"></span>
      </button>
    </td>
  </tr>
</template>
<script>
import { bus } from "@/main.js"
import { transcriberProfileModelMixin } from "@/mixins/transcriberProfileModel.js"
import Checkbox from "@/components/Checkbox.vue"
export default {
  mixins: [transcriberProfileModelMixin],
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    p_selectedProfiles: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  methods: {},
  components: {
    Checkbox,
  },
}
</script>
