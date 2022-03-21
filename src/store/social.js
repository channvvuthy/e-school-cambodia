import axios from "axios"
import config from "./../config"
import helper from "@/helper/helper";

export default {
    namespaced: true,
    state: {
        loading: false,
        social: [],
        ads: [],
        loadingMore: false,
    },
    mutations: {
        loadingMore(state, payload) {
            state.loadingMore = payload
        },
        postingSocial(state, payload) {
            state.loading = payload
        },
        getSocial(state, payload) {
            state.social = payload.filter(item => item.type !== 51 && item.type !== 52)
            state.ads = payload.filter(item => item.type === 51 || item.type === 52)
        },
        newPost(state, payload) {
            state.social.unshift(payload)
        },
        getMoreSocial(state, payload) {
            if (payload.length) {
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i].type === 51 || payload[i].type === 52) {
                        state.ads.push(payload[i])
                    } else {
                        state.social.push(payload[i])
                    }
                }
            }
        }
    },
    actions: {
        getSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social?${helper.q(payload)}`).then(res => {
                    commit("postingSocial", true)
                    commit("getSocial", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        getMoreSocial({commit}, payload) {
            commit("loadingMore", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social?${helper.q(payload)}`).then(res => {
                    commit("getMoreSocial", res.data.data)
                    resolve(res.data)
                    commit("loadingMore", false)
                }).catch(err => {
                    reject(err)
                    commit("loadingMore", false)
                })
            })
        },
        postSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social`, payload).then(res => {
                    commit("postingSocial", false)
                    commit("newPost", res.data.data)
                    resolve(res.data.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        }
    }

}