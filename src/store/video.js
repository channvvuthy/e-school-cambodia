import axios from "axios";
import config from "./../config";
export default {
    namespaced: true,
    state: {
        videos:[],
        loading:false,

    },

    mutations: {
        gettingVideo(state, payload){
            state.loading = payload
        },

        receivingVideo(state, payload){
            state.videos = payload
        }
    },

    actions: {
       getVideo({commit}, payload){
        let qs = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');
           commit("gettingVideo", true);
           return new Promise((resolve, reject) =>{
               axios.get(config.apiUrl + `video?${qs}`).then(response =>{
                commit("gettingVideo", false);
                commit("receivingVideo", response.data.data);
                resolve(response)
               }).catch(err =>{
                   reject(err)
                   commit("gettingVideo", false);
               })
           })
       }
    }
}