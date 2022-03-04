import config from "./../config"
import axios from "axios"
import helper from "./../helper/helper"

export default {
    namespaced: true, state: {
        stickers: [],
        loadingSticker: false
    },
    mutations: {
        loading(state, payload) {
            state.loadingSticker = payload
        }, getSticker(state, payload) {
            state.stickers = payload
        },
        getMoreSticker(state, payload) {
            for (let i = 0; i < payload.list; i++) {
                state.stickers.list.push(payload[i])
            }
        }
    },
    actions: {
        getSticker({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `/sticker?${helper.q(payload)}`).then(res => {
                    commit("loading", false)
                    commit("getSticker", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                })
            })
        },
        getMoreSticker({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `/sticker?${helper.q(payload)}`).then(res => {
                    commit("getMoreSticker", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}