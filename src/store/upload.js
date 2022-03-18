import axios from "axios"
import config from "./../config"

export default {
    namespaced: true,
    state: {
        loading: false,
        progress: 0
    },
    mutations: {
        progress(state, payload) {
            state.progress = payload
        },
        loading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        singleUpload({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/photo`, payload).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })
        },
        multiUpload({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/multiple-photo`, payload).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })
        },
        videoUpload({commit}, payload) {
            commit("loading", true)
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/video`, payload, conf).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })
        },

    }

}