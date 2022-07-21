import axios from "axios"
import config from "./../config"
import helper from "../helper/helper";

export default {
    namespaced: true,
    state: {
        loading: false,
        progress: 0
    },
    mutations: {
        progress(state, payload) {
            state.progress = payload
        },
        loading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        singleUpload({commit}, payload) {
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/photo`, payload, conf).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    if (err.response.status == 504 || err.response.status == 502) {
                        helper.errorMessage(err.response.status)
                    }
                    reject(err)
                })
            })
        },
        uploadPdf({commit}, payload) {
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/pdf`, payload, conf).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    if (err.response.status == 504 || err.response.status == 502) {
                        helper.errorMessage(err.response.status)
                    }
                    reject(err)
                })
            })
        },
        uploadSound({commit}, payload) {
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/sound`, payload, conf).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    if (err.response.status == 504 || err.response.status == 502) {
                        helper.errorMessage(err.response.status)
                    }
                    reject(err)
                })
            })
        },
        multiUpload({commit}, payload) {
            commit("loading", true)
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/multiple-photo`, payload, conf).then(res => {
                    commit("loading", false)
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                    if (err.response.status == 504 || err.response.status == 502) {
                        helper.errorMessage(err.response.status)
                    }
                })
            })
        },
        videoUpload({commit}, payload) {
            commit("loading", true)
            const conf = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    commit("progress", percentCompleted)
                }
            }
            return new Promise((resolve, reject) => {
                axios.post(config.microserviceUrl + `upload/video`, payload, conf).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    commit("loading", false)
                    if (err.response.status == 504 || err.response.status == 502) {
                        helper.errorMessage(err.response.status)
                    }
                    reject(err)
                })
            }).finally(() => {
                commit("loading", false)
            })
        },

    }

}