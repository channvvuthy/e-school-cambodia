import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"
export default {
    namespaced: true,

    state: {
        loading: false,
        contacts: [],
        messages: [],
        active: 0,
        members: []
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
        },
        getMember(state, payload){
            state.members = payload
        },
        getPagesMember(state, payload){
            for(let i = 0; i < payload.length; i ++){
                state.members.push(payload[i])
            }
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
                    helper.errorMessage(err.response.data)
                });
            })
        },
        renameGroup({}, payload){
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `etalk/contact/rename`, payload).then(response =>{
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        setPhoto({}, payload){
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `etalk/contact/photo`, payload).then(response =>{
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        muteContact({}, payload){
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `etalk/contact/mute`, payload).then(response =>{
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        deleteMute({}, payload){
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `etalk/contact/mute`, {
                    headers:{},
                    data:{
                        id: payload._id
                    }
                }).then(response =>{
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        getMember({commit}, payload){
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `etalk/group/member?${helper.q(payload)}`).then(response =>{
                    if(payload.p !== 'undefined' && payload.p > 1){
                        commit("getPagesMember", response.data.data)
                    }else{
                        commit("getMember", response.data.data)
                    }
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
    }
}