<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.account.title')"
    @input="$emit('input', $event)">
    <div class="m-account__identity">
      <span class="m-account__avatar" aria-hidden="true">{{ initials }}</span>
      <span class="m-account__who">
        <span class="m-account__name">{{ userName }}</span>
        <span class="m-muted">{{ email }}</span>
      </span>
    </div>

    <div class="m-account__group">
      <ListRow
        icon="buildings"
        :label="organizationName"
        :hint="roleLabel"
        @click="$emit('open-organizations')">
        <template #trailing>
          <span class="m-account__change">{{
            $t("mobile.organization.switch")
          }}</span>
        </template>
      </ListRow>
      <ListRow
        icon="gear"
        :label="$t('mobile.account.studio_settings')"
        href="/interface/" />
    </div>

    <div class="m-account__group">
      <label class="m-account__language">
        <PhIcon name="translate" size="md" />
        <span class="m-grow">{{ $t("mobile.account.language") }}</span>
        <select
          :value="$i18n.locale"
          @change="changeLanguage($event.target.value)">
          <option
            v-for="locale in $i18n.availableLocales"
            :key="locale"
            :value="locale">
            {{ $t(`lang.${locale.slice(0, 2)}`) }}
          </option>
        </select>
      </label>
      <ListRow
        v-if="canInstall"
        icon="device-mobile"
        :label="$t('mobile.account.install')"
        @click="$emit('install')" />
      <ListRow
        icon="desktop"
        :label="$t('mobile.account.full_version')"
        @click="optOut" />
      <ListRow
        icon="sign-out"
        :label="$t('mobile.account.logout')"
        :chevron="false"
        danger
        @click="logout" />
    </div>

    <p class="m-muted m-account__version">LinTO Studio {{ version }}</p>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import { setLanguage } from "@/mobile/services/preferences/setLanguage.js"
import { optOutOfMobileApp } from "@/mobile/services/preferences/optOutOfMobileApp.js"
import { logout } from "@/tools/logout"

export default {
  name: "AccountSheet",
  components: { BottomSheet, ListRow, PhIcon },
  props: {
    value: { type: Boolean, default: false },
    userName: { type: String, required: true },
    email: { type: String, default: "" },
    initials: { type: String, default: "" },
    organizationName: { type: String, required: true },
    roleLabel: { type: String, default: "" },
    canInstall: { type: Boolean, default: false },
  },
  computed: {
    version() {
      return __APP_VERSION__
    },
  },
  methods: {
    changeLanguage: setLanguage,
    optOut: optOutOfMobileApp,
    logout() {
      logout({ redirect: false })
      window.location.href = "/m/login"
    },
  },
}
</script>

<style scoped>
.m-account__identity {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
}

.m-account__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-account__who {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.m-account__name {
  font-weight: 600;
}

.m-account__group {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}

.m-account__change {
  color: var(--m-primary);
  font-weight: 600;
  font-size: var(--m-font-size-sm);
}

.m-account__language {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 52px;
  padding: var(--m-space-2) var(--m-space-4);
  border-bottom: 1px solid var(--m-divider);
}

.m-account__language select {
  font: inherit;
  min-height: var(--m-tap);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  padding: 0 var(--m-space-2);
}

.m-account__version {
  text-align: center;
}
</style>
