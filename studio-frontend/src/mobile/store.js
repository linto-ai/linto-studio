// The mobile app reuses the classic store instance: its modules are pure
// data (no DOM), and organizations/setCurrentOrganizationScope registers the
// media modules on that very instance. Mobile-only modules are added here.
import store from "@/store/index.js"

export default store
