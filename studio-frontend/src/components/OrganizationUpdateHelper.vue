<template>
  <div id="helper-container" class="flex col" v-if="showHelper">
    <div class="flex row helper-close">
      <button class="btn" @click="hide()">
        <span class="icon close"></span>
      </button>
    </div>

    <div class="flex col flex1 form-info-container" style="border: none">
      <span class="form-info-title">{{ $t("organisation.name_label") }}</span>
      <p class="form-info-content">
        {{ $t("organisation.name_description") }}
      </p>

      <span class="form-info-title">{{
        $t("organisation.description_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("organisation.description_description") }}
      </p>

      <span class="form-info-title">{{
        $t("organisation.visibility_label")
      }}</span>
      <ul class="form-info-list">
        <li>
          <strong>{{ $t("organisation.visibility.public_inline") }}</strong
          >{{ $t("organisation.visibility.public_description") }}
        </li>
        <li>
          <strong>{{ $t("organisation.visibility.private_inline") }}</strong
          >{{ $t("organisation.visibility.private_description") }}
        </li>
      </ul>

      <span class="form-info-title">{{
        $t("organisation.add_member_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("organisation.add_member_description") }}
      </p>

      <span class="form-info-title">{{
        $t("organisation.user_list_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("organisation.user_list_description") }}
      </p>
      <ul class="form-info-list">
        <li>
          <strong>{{ $t("organisation.user_label_inline") }}</strong
          >{{ $t("organisation.user_description") }}
        </li>
        <li>
          <strong>{{ $t("organisation.user.role_label_inline") }}</strong
          >{{ $t("organisation.user.role_description") }}
        </li>
        <li>
          <strong>{{ $t("organisation.user.remove_label_inline") }}</strong
          >{{ $t("organisation.user.remove_description") }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showHelper: { required: true },
  },
  data() {
    return {}
  },
  methods: {
    hide() {
      this.$emit("close")
    },
  },
}
</script>
