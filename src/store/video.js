import axios from "axios";
import config from "./../config";
export default {
    namespaced: true,
    state: {
        videos:[],
        loading:false,
        loadingMore:false,
        playlist: [],
        order: 1

    },

    mutations: {
        updatingProgressbar(state, payload){
            state.playlist.list.filter(item =>{
                if(item._id === payload.id){
                    item['last_watch'] = payload
                }
                return item
            });
        },
        setOrder(state, payload){
            state.order = payload
        },
        removeFavoriteVideo(state, payload){
            state.playlist.list.filter(item =>{
                if(item._id === payload){
                    item.is_favorite = 0;
                }
                return item
            });
        },
        addFavoriteVideo(state, payload){
            state.playlist.list.filter(item =>{
                if(item._id === payload){
                    item.is_favorite = 1;
                }
                return item
            });
        },
        gettingVideo(state, payload){
            state.loading = payload
        },

        receivingVideo(state, payload){
            state.videos = payload
        },
        gettingVideowithPagination(state, payload){
            state.loadingMore = payload
        },

        receivingVideoWidthPagination(state,payload){
            for(let i =0; i < payload.length; i++){
                state.videos.list.push(payload[i]);
            }
        },

        gettingPlaylist(state, payload){
            state.playlist = payload
        },
        gettingMorePlaylist(state, payload){
           if(payload.length){
                for(let i =0; i < payload.length; i++){
                    state.playlist.list.push(payload[i]);
                }
           }
            
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
       },

       getVideoWithPagination({commit}, payload){
        let qs = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');
           commit("gettingVideowithPagination", true);
           return new Promise((resolve, reject) =>{
               axios.get(config.apiUrl + `video?${qs}`).then(response =>{
                commit("gettingVideowithPagination", false);
                commit("receivingVideoWidthPagination", response.data.data.list);
                resolve(response)
               }).catch(err =>{
                   reject(err)
                   commit("gettingVideowithPagination", false);
               })
           })
       },

       getPlaylist({commit},payload){
        let qs = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');
        commit("gettingVideo", true);
        return new Promise((resolve, reject) =>{
            axios.get(config.apiUrl + `video/playlist?${qs}`).then(response =>{
                commit("gettingVideo", false);
                commit("gettingPlaylist", response.data.data);
                resolve(response)
            }).catch(err =>{
                reject(err)
            })
        })
       },
       getPlaylistWithPagination({commit},payload){
        let qs = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');
        // commit("gettingVideo", true);
        return new Promise((resolve, reject) =>{
            axios.get(config.apiUrl + `video/playlist?${qs}`).then(response =>{
                // commit("gettingVideo", false);
                commit("gettingMorePlaylist", response.data.data.list);
                resolve(response)
            }).catch(err =>{
                reject(err)
            })
        })
       },
    }
}