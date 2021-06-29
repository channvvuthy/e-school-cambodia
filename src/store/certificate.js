import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    mutations:{
        gettingCertificate(){
            
        }
    },
    actions: {
        getCertificate({commit}){
            commit("gettingCertificate", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `certificate`).then(response =>{
                    resolve(response)
                }).catch(err =>{
                    reject(err)
                })
            })
        }
    }
}