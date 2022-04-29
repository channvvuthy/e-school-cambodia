import config from "./../config"
import axios from "axios"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        quiz: [],
        certificatesQuiz: [],
        loading: false
    },
    mutations: {
        getQuiz(state, payload) {
            state.quiz = payload
        },
        submittingQuiz() {

        },
        gettingQuizCertificate(state, payload) {
            state.loading = payload
        },
        receivingCertificate(state, payload) {
            state.certificatesQuiz = payload
        }
    },
    actions: {
        getQuiz({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `quiz/video?${helper.q(payload)}`).then(res => {
                    commit('getQuiz', res.data.data)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        submitQuiz({commit}, payload) {
            commit("submittingQuiz", true);

            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `quiz/video`, payload).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getQuizCertificate({commit}, payload) {
            commit("gettingQuizCertificate", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `quiz/certificate?${helper.q(payload)}`).then(response => {
                    commit("receivingCertificate", response.data.data)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        submitQuizCertificate({commit}, payload) {
            commit("gettingQuizCertificate", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `quiz/certificate`, payload).then(response => {
                    resolve(response)
                    commit("gettingQuizCertificate", false)
                }).catch(err => {
                    reject(err)
                    commit("gettingQuizCertificate", false)
                })
            })
        }

    }

}