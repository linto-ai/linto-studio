<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="addChannels"
    :title="$t('session.channels_list.modal_add.title')"
    :actionBtnLabel="
      $tc(
        'session.channels_list.modal_add.main_button',
        selectedProfiles.length
      )
    ">
    <LoadingComponent
      v-if="loading"
      :title="
        $t('session.channels_list.modal_add.loading_profiles')
      "></LoadingComponent>
    <TranscriberProfileSelector
      v-else
      v-model="selectedProfiles"
      :profilesList="profilesList" />
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { apiGetTranscriberProfiles } from "@/api/session.js"

import ModalNew from "./ModalNew.vue"
import TranscriberProfileSelector from "./TranscriberProfileSelector.vue"
import LoadingComponent from "./Loading.vue"
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      profilesList: [],
      loading: true,
    }
  },
  mounted() {
    this.fetchProfiles()
  },
  methods: {
    async fetchProfiles() {
      const res = await apiGetTranscriberProfiles()
      this.profilesList = res
      this.loading = false
    },
    addChannels() {
      const newChannels = this.selectedProfiles.map((profile) => {
        return {
          id: profile.id,
          name: profile.config.description,
          type: profile.config.type,
          profileName: profile.config.name,
          profileId: profile.id,
          languages: profile.config.languages.map((l) => l.candidate),
        }
      })
      this.$emit("on-confirm", newChannels)
    },
  },
  computed: {
    selectedProfiles: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: {
    Fragment,
    ModalNew,
    TranscriberProfileSelector,
    LoadingComponent,
  },
}
</script>
