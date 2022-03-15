import axios from "axios"
import config from "./../config"

export default {
    namespaced: true,
    state: {
        loading: false,
    },
    mutations: {
        postingSocial(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        postSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social`, payload).then(res => {
                    commit("postingSocial", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        }
    }

}