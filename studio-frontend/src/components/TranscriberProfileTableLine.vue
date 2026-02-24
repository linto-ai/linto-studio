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
      <span class="clickable" @click="editProfile">{{ name }}</span>
    </td>
    <td>
      <span class="clickable" @click="editProfile">{{ description }}</span>
    </td>
    <td>
      <span class="clickable" @click="editProfile">{{ languages }}</span>
    </td>
    <!-- <td>
      {{ transcriberOrganizationId || "–" }}
    </td> -->
    <td>
      <Button
        @click="editProfile"
        variant="secondary"
        icon="pencil"
        label="Edit" />
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
  },
  methods: {
    editProfile(event) {
      event.stopPropagation()
      this.$emit("edit", this.id)
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

<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}
</style>
