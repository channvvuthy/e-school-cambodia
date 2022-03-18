import axios from "axios"
import config from "./../config"
import helper from "@/helper/helper";

export default {
    namespaced: true,
    state: {
        loading: false,
        social: [],
        ads: []
    },
    mutations: {
        postingSocial(state, payload) {
            state.loading = payload
        },
        getSocial(state, payload) {
            state.social = payload.filter(item => item.type !== 51 && item.type !== 52)
            state.ads = payload.filter(item => item.type === 51 || item.type === 52)
            console.log(state.ads)
        },
        newPost(state, payload) {
            state.social.push(payload)
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