import axios from "axios"
import config from "../config"
import helper from "../helper/helper"

export default {
    namespaced: true,
    state: {
        summaries: {
            watch_video: 0,
        },
        loading: false
    },
    mutations: {
        loadingSummary(state, payload){
            state.loading = payload
        },
        receivedSummary(state, payload){
            state.summaries = payload
        },
    },

    actions: {
        getSummary({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/activity?${helper.q(payload)}`).then(response => {
                    commit("loadingSummary", false)
                    resolve(response)
                    commit("receivedSummary", response.data.data)
                }).catch(err => {
                    commit("loadingSummary", false);
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
    },

}