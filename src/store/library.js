import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"
export default {
    namespaced: true,
    state: {
       libraries:[],
       loading: false,
       showList: false,
       filter_id: ''
    },
    mutations: {
        gettingLibrary(state, payload){
            state.loading = payload
        },

        receivingLibrary(state, payload){
            state.libraries = payload
        },

        showFilterList(state, payload){
            state.showList = !payload
        },

        changeFilterId(state, payload){
            state.filter_id = payload
        }
    },
    actions: {
        getLibrary({commit},payload){
            commit("gettingLibrary", true);
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `library?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("receivingLibrary", response.data.data)
                    commit("gettingLibrary", false)
                }).catch(err =>{
                    reject(err)
                    commit("gettingLibrary", false)
                })
            })
        },
    }

}