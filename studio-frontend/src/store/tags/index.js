import { apiGetAllCategories } from "@/api/tag"

export default {
    namespaced: true,
    state: {
        tags: [],
        loading: false,
        error: null
    },
    mutations: {
        clearTags(state) {
            state.tags = []
        },
        setTags(state, tags) {
            state.tags = tags
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setError(state, error) {
            state.error = error
        }
    },
    actions: {
        async fetchTags({ commit, getters, rootGetters }) {
            commit('setLoading', true)
            try {
                const data = await apiGetAllCategories(
                    rootGetters["organizations/getCurrentOrganizationScope"],
                )

                commit('setTags', data)
            } catch (error) {
                commit('setError', error)
            } finally {
                commit('setLoading', false)
            }
        }
    }
}
