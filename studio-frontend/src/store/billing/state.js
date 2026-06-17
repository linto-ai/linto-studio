export default {
  plans: [],
  subscription: null, // current org subscription doc (null => implicit free)
  usage: null, // { planKey, seats, capabilities: {...} }
  loading: false,
}
