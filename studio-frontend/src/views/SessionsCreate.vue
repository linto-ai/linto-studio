<template>
  <MainContent sidebar box>
    <div class="flex row">
      <form
        class="flex col flex1"
        @submit="createSession"
        :disabled="formState === 'sending'">
        <section>
          <h1>{{ $t("session.create_page.title") }}</h1>
          <FormInput :field="name" v-model="name.value" />
          <FormCheckbox
            :field="fieldIsPublic"
            v-model="fieldIsPublic.value"></FormCheckbox>
        </section>
        <section class="flex col gap-medium">
          <div class="flex row gap-medium">
            <h2 style="width: auto">
              {{ $t("session.channels_list.title") }}
            </h2>
            <button class="btn" @click="addChannel" type="button">
              <span class="icon add"></span>
              <span class="label">{{ $t("session.channels_list.add") }}</span>
            </button>
          </div>
          <div class="overflow-horizontal-auto">
            <SessionChannelsTable
              v-if="channels.length > 0"
              :channelsList="channels"
              @updateName="updateName"
              @removeChannel="removeChannel" />
            <p v-else>{{ $t("session.channels_list.empty") }}</p>
          </div>
        </section>

        <div class="form-field flex row">
          <button
            type="submit"
            class="btn green"
            :disabled="formState === 'sending'">
            <span class="icon apply"></span>
            <span class="label">
              {{ $t("session.create_page.submit_button") }}
            </span>
          </button>
        </div>
      </form>
    </div>
    <ModalAddSessionChannels
      v-if="modalAddChannelsIsOpen"
      v-model="selectedProfiles"
      @on-confirm="confirmAddSessionChannels"
      @on-cancel="closeModalAddSessionChannels" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import { testName } from "@/tools/fields/testName"

import EMPTY_FIELD from "@/const/emptyField"

import { apiCreateSession } from "@/api/session.js"

import { formsMixin } from "@/mixins/forms.js"

import MainContent from "@/components/MainContent.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"

import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import ModalAddSessionChannels from "@/components/ModalAddSessionChannels.vue"
import { lang } from "moment"

export default {
  mixins: [formsMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formState: "idle",
      fields: ["name"],
      name: {
        ...EMPTY_FIELD,
        label: this.$i18n.t("session.create_page.name_field.label"),
        testField: testName,
      },
      fieldIsPublic: {
        value: true,
        error: null,
        valid: false,
        label: this.$t("session.settings_page.isPublic_label"),
      },
      channels: [],
      selectedProfiles: [],
      modalAddChannelsIsOpen: false,
    }
  },
  mounted() {},
  methods: {
    async createSession(e) {
      e.preventDefault()
      this.state = "sending"
      if (this.testFields()) {
        const res = await apiCreateSession(this.currentOrganizationScope, {
          name: this.name.value,
          channels: this.channels.map(({ profileId, name }) => ({
            transcriberProfileId: profileId,
            name,
          })),
          public: this.fieldIsPublic.value,
        })
        if (res.status == "success") {
          this.state = "success"
          console.log("res success !!!", res)
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t("session.create_page.success_message"),
            redirect: false,
          })
          this.$router.push({
            name: "sessions settings",
            params: {
              sessionId: res.data.id,
              organizationId: this.currentOrganizationScope,
            },
          })
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("session.create_page.error_message"),
            timeout: null,
          })
          this.state = "error"
        }
      } else {
        this.state = "error"
      }

      return false
    },
    addChannel() {
      this.openModalAddSessionChannels()
    },
    confirmAddSessionChannels(channels) {
      this.channels = this.channels.concat(channels)
      this.closeModalAddSessionChannels()
    },
    closeModalAddSessionChannels() {
      this.modalAddChannelsIsOpen = false
      this.selectedProfiles = []
    },
    openModalAddSessionChannels() {
      this.modalAddChannelsIsOpen = true
    },
    removeChannel(index) {
      this.channels.splice(index, 1)
    },
    updateName(index, value) {
      this.channels[index].name = value
    },
  },
  components: {
    MainContent,
    FormInput,
    SessionChannelsTable,
    ModalAddSessionChannels,
    FormCheckbox,
  },
}
</script>
