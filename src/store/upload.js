import axios from "axios"
import helper from "../helper/helper"
import config from "./../config"

export default {
    namespaced: true,
    state: {
        loading: false,
    },
    mutations: {
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
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/video`, payload).then(res => {
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