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
        }
    }
    
}