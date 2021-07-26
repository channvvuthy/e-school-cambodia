import axios from "axios"
import config from "./../config"
import store from "./../store"
import helper from "./../helper/helper"
export default {
    namespaced: true,

    state: {
        loading: false,
        contacts: [],
        messages: []
    },

    mutations:{
        loading(state, payload){
            state.loading = payload
        },
        getContact(state, payload){
            state.contacts = payload
        }

    },

    actions:{
        getContact({commit}){
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `etalk/contact`).then(response => {
                    resolve(response)
                    commit("getContact", response.data.data)
                    commit("loading", false)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}