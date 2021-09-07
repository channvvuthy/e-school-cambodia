import axios from "axios"
import helper from "../helper/helper"
import config from "./../config"


export default {
    namespaced: true,
    state: {
        documents: [],
        loading: false
    },
    mutations: {
        gettingDocument(state, payload){
            state.documents = payload
        },
        creatingDirectory(state, payload){
            state.loading = payload
        },
        deletingDocument(state, payload){
            state.loading = payload
        },
        deletedDocument(state, payload){
            state.documents = state.documents.filter(item => item._id != payload)
        },
        gettingMoreDocument(state, payload){
            for(let i = 0; i < payload.length; i ++){
                state.documents.push(payload[i])
            }
        }
    },

    actions: {
       getDocument({commit}, payload){
           return new Promise((resolve, reject) =>{
               axios.get(config.apiUrl + `document?${helper.q(payload)}`).then(response =>{
                   resolve(response)
                   commit("gettingDocument",response.data.data)
               }).catch(err =>{
                   reject(err)
               })
           })
       },
       getMoreDocument({commit}, payload){
        return new Promise((resolve, reject) =>{
            axios.get(config.apiUrl + `document?${helper.q(payload)}`).then(response =>{
                resolve(response)
                commit("gettingMoreDocument",response.data.data)
            }).catch(err =>{
                reject(err)
            })
        })
    },
       createDocument({commit}, payload){
           commit("creatingDirectory", true)
           return new Promise((resolve, reject) =>{
               axios.post(config.apiUrl + `document`, payload).then(response =>{
                    resolve(response)
                    commit("creatingDirectory", false)
               }).catch(err =>{
                    reject(err)
                    commit("creatingDirectory", false)
               })
           })
       },
       rename({commit}, payload){
           return new Promise((resolve, reject) =>{
               axios.put(config.apiUrl + `document`,payload).then(response =>{
                   resolve(response)
               }).catch(err=>{
                   reject(err)
               })
           })
       },
       deleteDocument({commit}, payload){
           commit("deletingDocument", true)
           return new Promise((resolve, reject) =>{
               axios.delete(config.apiUrl + `document`,{
                   headers:{

                   },
                   data:{
                       id: payload
                   }
               }).then(response =>{
                   resolve(response)
                   commit("deletedDocument", payload)
                   commit("deletingDocument", false)
               }).catch(err =>{
                   reject(err)
                   commit("deletingDocument", false)
               })
           })
       }
    },

}