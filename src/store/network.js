import axios from "axios"
import helper from "../helper/helper"
import config from "./../config"
export default {
    namespaced: true,
    state: {
       active: "friend",
       friends: [],
       friendRequest: [],
       myRequest: [],
       loading: false,
       friendNotInContact:[]
    },
    mutations: {
        switchTab(state, payload){
            state.active = payload
        },
        loading(state, payload){
            state.loading = payload
        },
        gettingFriend(state, payload){
            state.friends = payload
        },
        gettingMoreFriend(){

        },
        friendNotInContact(state, payload){
            state.friendNotInContact = payload
        }
    },
    actions: {
        getFriend({commit}, payload){
            commit("loading", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `friend?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    if(payload.p !== undefined && payload.p > 1){
                        commit("gettingMoreFriend", response.data.data)
                    }else{
                        commit("gettingFriend", response.data.data)
                    }
                    commit("loading", false)
                }).catch(err =>{
                    reject(err)
                    commit("loading", false)
                })
            })
        },

        getFriendRequest({commit}, payload){
            commit("loading", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `friend/request-from?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    if(payload.p !== undefined && payload.p > 1){
                        commit("gettingMoreFriendRequest", response.data.data)
                    }else{
                        commit("gettingFriendRequest", response.data.data)
                    }
                    commit("loading", false)
                }).catch(err =>{
                    reject(err)
                    commit("loading", false)
                })
            })
        },
        getFriendNotInContact({commit}, payload){
            commit("loading", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `friend/request-from?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    if(payload.p !== undefined && payload.p > 1){
                        commit("moreFriendNotInContact", response.data.data)
                    }else{
                        commit("friendNotInContact", response.data.data)
                    }
                    commit("loading", false)
                }).catch(err =>{
                    reject(err)
                    commit("loading", false)
                })
            })
        }
    }

}