import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        attendant: [],
        loading: false
    },
    mutations: {
        loadingAttendant(state, payload) {
            state.loading = payload
        },
        receivedAttendant(state, payload) {
            state.attendant = payload
        },
    },

    actions: {
        getAttendant({commit}, payload) {
            commit("loadingAttendant", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `report/attendant?${helper.q(payload)}`).then(response => {
                    commit("loadingAttendant", false)
                    resolve(response)
                    commit("receivedAttendant", response.data.data)
                }).catch(err => {
                    commit("loadingAttendant", false);
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
    },

}