export default {
  plans: [],
  subscription: null, // current org subscription doc (org admin only)
  usage: null, // { planKey, mode, seats, capabilities: {...}, live: {...} }
  usageByMember: null, // { planKey, seats, members: { userId: {cap:{used,events}} } }
  loading: false,
  // Upgrade/onboarding wizard visibility, settable from anywhere (footer
  // button, quota-gated API calls, locked-feature CTAs) without a direct
  // reference to the component that renders it (see OnboardingWizard.vue).
  upgradeModalOpen: false,
  upgradeReason: null, // { code, reason, capability, remaining } | null
}
