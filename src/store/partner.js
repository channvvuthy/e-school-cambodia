import axios from "axios"
import helper from "../helper/helper"
import config from "./../config"

export default {
    namespaced: true,
    state: {
        partners: [],
        loadingPartner: false,
        openLoading: false,
        openUrl: {}
    },
    mutations: {
        receivingOpenPartner(state, openUrl) {
            state.openUrl = openUrl
        },
        openingPartnerLoading(state, status) {
            state.openLoading = status
        },
        loadingPartner(state, status) {
            state.loadingPartner = status
        },
        gettingPartner(state, partners) {
            state.partners = partners
        },
        deleteCart(state, payload) {
            if (state.packages) {
                state.packages = state.partners.filter(item => {
                    item.packages.filter(pk => {
                        if (pk._id === payload) {
                            pk.is_in_cart = 0
                        }
                        return pk
                    })
                    return item
                })
            }
        },
        addToCart(state, payload) {
            state.packages = state.partners.filter(item => {
                item.packages.filter(pk => {
                    if (pk._id === payload) {
                        pk.is_in_cart = 1
                    }
                    return pk
                })
                return item
            })
        },
    },
    actions: {
        getPartner({commit}) {
            commit("loadingPartner", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + "partner").then(response => {
                    resolve(response.data)
                    commit("loadingPartner", false)
                    if (response.data.msg != undefined) {
                        helper.errorMessage(response.data.msg)
                    } else {
                        commit("gettingPartner", response.data.data)
                    }

                }).catch(err => {
                    reject(err)
                    commit("loadingPartner", false)

                })
            })
        },
        openPartner({commit}, id) {
            commit("openingPartnerLoading", true)
            return new Promise((resovle, reject) => {
                axios.get(config.apiUrl + 'partner/open?id=' + id).then(response => {
                    resovle(response.data)
                    commit("openingPartnerLoading", false)
                    commit("receivingOpenPartner", response.data.data)
                }).catch(err => {
                    reject(err)
                    commit("openingPartnerLoading", false)
                })
            })
        }
    }
}