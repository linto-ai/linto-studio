<template>
  <div class="m-page">
    <div class="m-page__content">
      <ApiUnreachable />
    </div>
    <InstanceFooter
      v-if="instance"
      :address="instanceAddress"
      @change="instancePickerOpen = true" />
    <InstancePickerSheet v-if="instance" v-model="instancePickerOpen" />
  </div>
</template>

<script>
import ApiUnreachable from "@/views/ApiUnreachable.vue"
import InstanceFooter from "@/mobile/components/instance/InstanceFooter.vue"
import InstancePickerSheet from "@/mobile/components/instance/InstancePickerSheet.vue"
import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { loadSavedInstance } from "@/mobile/services/native/instanceStorage.js"
import { formatInstanceAddress } from "@/mobile/tools/formatInstanceAddress.js"

// The shared "API unreachable" screen in the mobile page frame. The native
// app can also switch to another instance from here.
export default {
  name: "MobileApiUnreachable",
  components: { ApiUnreachable, InstanceFooter, InstancePickerSheet },
  data() {
    return {
      instance: IS_NATIVE_APP ? loadSavedInstance() : null,
      instancePickerOpen: false,
    }
  },
  computed: {
    instanceAddress() {
      return formatInstanceAddress(this.instance.address)
    },
  },
}
</script>
