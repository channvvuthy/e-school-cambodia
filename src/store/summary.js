import axios from "axios"
import config from "../config"
import helper from "../helper/helper"

export default {
    namespaced: true,
    state: {
        summaries: {
            watch_video: 0,
        },
        summariesDetail:[],
        loading: false
    },
    mutations: {
        loadingSummary(state, payload){
            state.loading = payload
        },
        receivedSummary(state, payload){
            state.summaries = payload
        },
        getSummaryDetail(state, payload){
            state.summariesDetail = payload
        },
        getSummaryDetailPagination(state, payload){
            for(let i = 0; i < payload.length; i ++){
                state.summariesDetail.push(payload[i])
            }
        }
    },

    actions: {
        getSummary({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/activity?${helper.q(payload)}`).then(response => {
                    commit("loadingSummary", false)
                    resolve(response)
                    commit("receivedSummary", response.data.data)
                }).catch(err => {
                    commit("loadingSummary", false);
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        getSummaryDetail({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `report/activity/detail?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("getSummaryDetail", response.data.data)
                    commit("loadingSummary", false)
                }).catch(err =>{
                    reject(err)
                    commit("loadingSummary", false)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        getSummaryDetailPagination({commit}, payload){
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `report/activity/detail?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("getSummaryDetailPagination", response.data.data)
                }).catch(err =>{
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        }
    },

}