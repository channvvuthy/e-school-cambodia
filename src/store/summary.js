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
        loading: false,
        course: [],
        courseDetail: [],
        attendant:[]
    },
    mutations: {
        getCourse(state, payload){
            state.course = payload
        },
        getCoursePagination(state, payload){
            for(let i = 0; i < payload.list.length; i ++){
                state.course.list.push(payload.list[i])
            }
        },
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
        },
        getCourseDetail(state, payload){
            state.courseDetail = payload
        },
        getAttendant(state, payload){
            state.attendant = payload
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
        },
        getCourse({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/course?${helper.q(payload)}`).then(response => {
                    resolve(response)
                    commit("loadingSummary", false)
                    commit("getCourse", response.data.data)
                }).catch(err =>{
                    reject(err)
                    commit("loadingSummary", false)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        getCoursePagination({commit}, payload){
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/course?${helper.q(payload)}`).then(response => {
                    resolve(response)
                    commit("getCoursePagination", response.data.data)
                }).catch(err =>{
                    reject(err)
                   
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },

        getCourseDetail({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/course/detail?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("loadingSummary", false)
                    commit("getCourseDetail", response.data.data)
                }).catch(err =>{
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                    commit("loadingSummary", false)
                })
            })
        },

        getAttendant({commit}, payload){
            commit("loadingSummary", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `report/attendant?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("loadingSummary", false)
                    commit("getAttendant", response.data.data)
                }).catch(err =>{
                    reject(err)
                    commit("loadingSummary", false)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        }
        
    },

}