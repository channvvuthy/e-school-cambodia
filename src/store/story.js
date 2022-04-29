export default {
    namespaced: true,
    state: {
        storyDetail: {
            id: null
        }
    },
    mutations: {
        getStoryDetail(state, payload) {
            state.storyDetail = payload
        }
    },
}