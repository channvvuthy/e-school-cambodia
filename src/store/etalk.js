import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"
export default {
    namespaced: true,

    state: {
        loading: false,
        contacts: [],
        messages: [],
        active: 0
    },

    mutations:{
        loading(state, payload){
            state.loading = payload
        },
        getContact(state, payload){
            state.contacts = payload
        },
        setActive(state, payload){
            state.active = payload 
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
        },
        createGroup({commit}, form){
            return new Promise((resolve, reject) => {
                var settings = {
                    "url": config.apiUrl + "etalk/group",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };
    
                axios(settings).then(function (response) {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            })
        }
    }
}