import axios from "axios"
import config from "@/config";
export default {
    namespaced: true,
    state: {
        wallet_loading: false,
    },

    mutations: {
        loading(state, payload) {
            state.wallet_loading = payload
        }
    },

    actions: {
        walletTransfer({commit}, payload) {
            commit('loading', true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'wallet', payload).then(res => {
                    commit("loading", false)
                    resolve(res)
                }).catch(err => {
                    commit('loading', false)
                    reject(err)
                })
            })
        },
        billPay({commit}, payload) {
            commit('loading', true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'wallet/bill/pay', payload).then(res => {
                    commit("loading", false)
                    resolve(res)
                }).catch(err => {
                    commit('loading', false)
                    reject(err)
                })
            })
        },
        getPin({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `wallet/pin?password=${payload}`).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }


}