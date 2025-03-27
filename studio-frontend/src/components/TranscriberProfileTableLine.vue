<template>
  <tr>
    <td>
      <Checkbox
        class="line-selector"
        v-model="p_selectedProfiles"
        :checkboxValue="id"></Checkbox>
    </td>
    <td>
      <router-link :to="to">{{ name }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ description }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ languages }}</router-link>
    </td>
    <td>
      {{ transcriberOrganizationId || "–" }}
    </td>
    <td>
      <button @click="editProfile">
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
    linkTo: {
      type: Object,
      required: false,
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
    to() {
      return {
        ...this.linkTo,
        params: { transcriberProfileId: this.id },
      }
    },
  },
  methods: {
    editProfile() {
      this.$router.push(this.to)
    },
  },
  components: {
    Checkbox,
  },
}
</script>
