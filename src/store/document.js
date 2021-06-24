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
       }
    },

}