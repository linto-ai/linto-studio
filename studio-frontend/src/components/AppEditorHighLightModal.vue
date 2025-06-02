<template>
  <ModalNew
    :title="$t('app_editor_highlights_modal.ia_title')"
    @on-cancel="close"
    @on-confirm="done"
    :no-apply="selectedServices.length === 0"
    :actionBtnLabel="$t('app_editor_highlights_modal.generate_button')"
    customModalClass="modal--highlights">
    <div v-if="!loading" class="flex col gap-small">
      <div>
        {{ $t("app_editor_highlights_modal.description") }}
      </div>
      <form class="flex gap-small wrap form--highlights">
        <ServiceBox
          v-for="service in servicesListTransformed"
          :key="service.name"
          :id="service.name"
          :service="service"
          v-model="selectedServices" />
      </form>
    </div>

    <div v-else class="flex align-center col center-text">
      <h3>{{ $t("app_editor_highlights_modal.loading_services") }}</h3>
      <ph-icon name="spinner" size="lg" color="primary" weight="bold" />
    </div>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import ModalNew from "@/components/molecules/Modal.vue"
import ServiceBox from "./ServiceBox.vue"
import { apiGetNlpService } from "../api/service.js"

export default {
  props: {
    servicesList: {
      type: Array,
      required: true,
    },
    hightlightsCategories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedServices: [], // array of service names
      loading: false,
    }
  },
  computed: {
    servicesListTransformed() {
      let servicesListCopy = [...this.servicesList]
      let finalList = []
      for (let category of this.hightlightsCategories) {
        if (category.scope) {
          let index = servicesListCopy.findIndex((service) =>
            service.scope.indexOf(category.scope),
          )
          if (index !== -1) {
            var service = servicesListCopy.splice(index, 1)[0]
            if (category.tags && category.tags.length > 0) {
              service.alreadyGenerated = true
            }
            service.categoryName = category.name
            service.categoryId = category._id
            finalList.push(service)
          }
        }
      }
      finalList = finalList.concat(servicesListCopy)
      return finalList
    },
  },
  async mounted() {},
  methods: {
    close() {
      this.$emit("on-cancel")
    },
    done() {
      const services = this.selectedServices.map((name) =>
        this.servicesListTransformed.find((s) => s.name === name),
      )
      this.$emit("on-confirm", services)
    },
  },
  components: { Fragment, ModalNew, ServiceBox },
}
</script>
