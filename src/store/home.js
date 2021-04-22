import axios from "axios"
import config from "./../config"
// import err from "./../helper/err"

export default {
    namespaced: true,
    state: {
        list: [],
        filter: [],
        homeLoading: false
    },
    mutations: {
        homeLoading(state, status){
            state.homeLoading = status
        },
        receiveList(state, payload){
            state.list = payload.list
            state.filter = payload.filter
        }
    },
    actions: {
        getList({commit}, payload){
            let qs = Object.keys(payload)
                .map(key => `${key}=${payload[key]}`)
                .join('&');
            commit("homeLoading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `home?${qs}`).then(response => {
                    commit("homeLoading", false)
                    commit("receiveList", response.data.data)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}