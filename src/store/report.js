import axios from "axios"
import config from "./../config"


export default {
    namespaced: true,
    state: {
        report: "",
        loading: false,
    },
    mutations: {
        getReport(state, payload) {
            state.report = payload
        },
        loading(state, payload) {
            state.loading = payload
        }
    },

    actions: {
        getReport({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit("loading", true)
                axios.get(config.apiUrl + `social/report`).then(res => {
                    resolve(res.data)
                    commit("loading", false)
                    if (res.data && res.data.data) {
                        commit("getReport", res.data.data)
                    }
                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                })
            })
        },
        postReport({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/report`, payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    },

}