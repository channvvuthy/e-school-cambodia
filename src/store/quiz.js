import config from "./../config"
import axios from "axios"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        quiz: []
    },
    mutations:{
        getQuiz(state, payload){
            state.quiz = payload
        },
        submittingQuiz(){

        }
    },
    actions:{
        getQuiz({commit}, payload){
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `quiz/video?${helper.q(payload)}`).then(res =>{
                    commit('getQuiz', res.data.data)
                    resolve(res)
                }).catch(err =>{
                    reject(err)
                } )
            })
        },

        submitQuiz({commit},payload){
            commit("submittingQuiz", true);

            return new Promise((resolve, reject) =>{
                axios.post(config.apiUrl + `quiz/video`, payload).then(response =>{
                    resolve(response)
                }).catch(err =>{
                    reject(err)
                })
            })
        }
    }
    
}