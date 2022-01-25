import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        list: [],
        ads:{},
        filter: [],
        homeLoading: false,
        paginationLoading: false,
        filter_id: 'all',
        s: "",
        selectedFilterName: "all"
    },
    mutations: {
        stopWatch(state, payload){
            payload.percentage = Math.round((payload.mark*100)/payload.duration)
            state.list.filter(item => {
                if(item.type == 'vdo'){
                    if(payload.id == item.vdo._id){
                        item.vdo.last_watch = payload
                    }
                }
            })
        },
        removeFavorite(state, payload) {
            let updateList = state.list.filter(item => {
                if(item.type==='vdo'){
                    if(item.vdo._id === payload){
                        item.vdo.is_favorite = 0
                    }
                }
                return item
            })

            state.list = updateList
        },
        paginationLoading(state, status) {
            state.paginationLoading = status
        },
        receivePagination(state, payload) {
            if (payload) {
                for (let i = 0; i < payload.list.length; i++) {
                    state.list.push(payload.list[i])
                }
            }
        },

        selectedFilterName(state, payload) {
            state.selectedFilterName = payload
        },
        receiveFilter(state, payload) {
            state.filter_id = payload
        },
        receiveS(state, payload) {
            state.s = payload
        },
        homeLoading(state, status) {
            state.homeLoading = status
        },
        receiveList(state, payload) {
            state.ads = payload.menu_ads
            state.list = payload.list
            state.filter = payload.filter
        },
        getFilter(state, payload) {
            state.filter = payload.filter
        }
    },
    actions: {
        getList({
            commit
        }, payload) {
            let qs = Object.keys(payload)
                .map(key => `${key}=${payload[key]}`)
                .join('&');
            commit("homeLoading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `home?${qs}`).then(response => {
                    commit("homeLoading", false)
                    if(response.data.msg != undefined){
                        helper.errorMessage(response.data.msg)
                    }else{
                        commit("receiveList", response.data.data)
                    }
                    resolve(response)
                }).catch(err => {
                    commit("homeLoading", false)
                    helper.errorMessage(err.response.data.msg)
                    reject(err)
                })
            })
        },
        getListPagination({
            commit
        }, payload) {
            let qs = Object.keys(payload)
                .map(key => `${key}=${payload[key]}`)
                .join('&');
            commit("paginationLoading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `home?${qs}`).then(response => {
                    commit("paginationLoading", false)
                    commit("receivePagination", response.data.data)
                    resolve(response)
                }).catch(err => {
                    commit("paginationLoading", false)
                    helper.errorMessage(err.response)
                    reject(err)
                })
            })
        }
    }
}