import axios from "axios"
export default {
    namespaced: true,
    state: {
        termAndCondition: null,
        loadingTerm: false,
    },

    mutations: {
        getTermAndCondition(state, termAndCondition){
            state.termAndCondition = termAndCondition
        },

        loadingTermAndCondition(state, status){
            state.loadingTerm = status
        }


    },

    actions: {
        getTerm({commit}){
            commit("loadingTermAndCondition", true)
            return new Promise((resolve, reject) => {
                axios.get("https://e-schoolcambodia.com/term_and_condition_for_app").then(response => {
                    commit("loadingTermAndCondition", false)
                    commit("getTermAndCondition", response.data)
                    resolve(response.data)
                }).catch(err => {
                    commit("loadingTermAndCondition", false)
                    reject(err)
                })
            })
        }
    }


}