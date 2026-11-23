// The mobile app reuses the classic store instance: its modules are pure
// data (no DOM), and organizations/setCurrentOrganizationScope registers the
// media modules on that very instance. Mobile-only modules are added here.
import store from "@/store/index.js"
import recordings from "@/mobile/store/recordings/index.js"
import network from "@/mobile/store/network.js"

store.registerModule("mobileRecordings", recordings)
store.registerModule("mobileNetwork", network)

export default store
