<template>
  <tr @click="selectTranscriberProfile">
    <td>
      <Checkbox
        class="line-selector"
        v-model="p_selectedProfiles"
        :checkboxValue="id"></Checkbox>
    </td>
    <td>
      <span v-if="hasOrganization" class="icon apply" />
      <span v-else class="icon close" />
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
    <!-- <td>
      {{ transcriberOrganizationId || "–" }}
    </td> -->
    <td>
      <button @click="editProfile">
        <ph-icon name="pencil"></ph-icon>
        <span class="label">Edit</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { bus } from "@/main.js"
import { transcriberProfileModelMixin } from "@/mixins/transcriberProfileModel.js"
import Checkbox from "@/components/atoms/Checkbox.vue"
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
    value: {
      //selectedProfiles
      type: Array,
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
    selectTranscriberProfile() {
      this.p_selectedProfiles = this.p_selectedProfiles.includes(this.id)
        ? this.p_selectedProfiles.filter((id) => id !== this.id)
        : [...this.p_selectedProfiles, this.id]
    },
  },
  components: {
    Checkbox,
  },
}
</script>
