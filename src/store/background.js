import config from "./../config"
import axios from "axios"
import helper from "./../helper/helper"

export default {
    namespaced: true, state: {
        background: [],
        loadingBackground: false
    },
    mutations: {
        loading(state, payload) {
            state.loadingBackground = payload
        }, getBackground(state, payload) {
            state.background = payload
        },
        getMoreBackground(state, payload) {
            for (let i = 0; i < payload.length; i++) {
                state.background.push(payload[i])
            }
        }
    },
    actions: {
        getBackground({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/background?${helper.q(payload)}`).then(res => {
                    commit("loading", false)
                    commit("getBackground", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                })
            })
        },
        getMoreBackground({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/background?${helper.q(payload)}`).then(res => {
                    commit("loading", false)
                    commit("getMoreBackground", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })
        }
    }
}