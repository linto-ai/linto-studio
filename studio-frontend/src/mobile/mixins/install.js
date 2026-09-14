import {
  installPrompt,
  promptInstall,
  dismissInstall,
} from "@/mobile/services/pwa/installPrompt.js"
import { canOfferInstall } from "@/mobile/tools/canOfferInstall.js"

// Install affordance for a page: Android gets the native prompt, iOS gets
// the step-by-step sheet (iosGuideOpen), everything else offers nothing.
export const installMixin = {
  data() {
    return { iosGuideOpen: false, androidGuideOpen: false }
  },
  computed: {
    // The account row: any phone browser that does not run installed.
    installAvailable() {
      const { standalone, platform } = installPrompt
      return !standalone && platform !== "other"
    },
    canInstall() {
      const { standalone, dismissedUntil, deferredEvent, platform } =
        installPrompt
      return canOfferInstall(
        {
          standalone,
          dismissedUntil,
          hasPromptEvent: !!deferredEvent,
          platform,
        },
        Date.now(),
      )
    },
  },
  methods: {
    async startInstall() {
      if ("accountOpen" in this) this.accountOpen = false
      if (installPrompt.platform === "ios") {
        this.iosGuideOpen = true
        return
      }
      const outcome = await promptInstall()
      if (outcome === "unavailable") this.androidGuideOpen = true
    },
    dismissInstall,
  },
}
