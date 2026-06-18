export default {
  plans: [],
  subscription: null, // current org subscription doc (null => implicit free)
  usage: null, // { planKey, seats, capabilities: {...} }
  usageByMember: null, // { planKey, seats, members: { userId: {cap:{used,events}} } }
  loading: false,
}
