export default {
  plans: [],
  subscription: null, // current org subscription doc (org admin only)
  usage: null, // { planKey, mode, seats, capabilities: {...}, live: {...} }
  usageByMember: null, // { planKey, seats, members: { userId: {cap:{used,events}} } }
  loading: false,
}
