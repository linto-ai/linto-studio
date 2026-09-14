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
    return { iosGuideOpen: false }
  },
  computed: {
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
      this.accountOpen = false
      if (installPrompt.platform === "ios") {
        this.iosGuideOpen = true
        return
      }
      await promptInstall()
    },
    dismissInstall,
  },
}
