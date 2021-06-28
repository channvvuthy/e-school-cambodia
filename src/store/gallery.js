import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        galleries: [],
        loading: false
    },
    mutations: {
        gettingGallery(state, payload){
            state.loading = payload
        },
        receivingGallery(state, payload){
            state.galleries = payload
        },
        loadMoreGallery(state, payload){
            for(let i = 0; i < payload.length; i++){
                state.galleries.push(payload[i])
            }
        }

    },

    actions: {
       getGallery({commit}, payload){
            if(payload.p == undefined){
                commit("gettingGallery", true)
            }
           return new Promise((resolve, reject) =>{
               axios.get(config.apiUrl + `gallery?${helper.q(payload)}`).then(response =>{
                   commit("gettingGallery", false)
                   if(payload.p != undefined && payload.p > 1){
                        commit("loadMoreGallery", response.data.data)
                   }else{
                        commit("receivingGallery", response.data.data)
                   }
                   resolve(response)
               }).catch(err =>{
                    commit("gettingGallery", false)
                    reject(err)
               })

           })
       }
    }
}