import axios from "axios"
import { stat } from "fs"
import config from "./../config"
import helper from "./../helper/helper"
export default {
    namespaced: true,
    state: {
       libraries:[],
       loading: false,
       showList: false,
       filter_id: '',
       loadingDetail: false,
       details: []
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
        },
        loadMore(state, payload){
            if(payload.list.length){
                for(let i = 0; i < payload.list.length; i++){
                    state.libraries.list.push(payload.list[i])
                }
            }

            if(payload.package.length){
                for(let i = 0; i < payload.package.length; i++)[
                    state.libraries.package.push(payload.package[i])
                ]
            }
        },
        getLibraryDetail(state, payload){
            state.details = payload
        },
        
        gettingLibraryDetail(state, payload){
            state.loadingDetail = payload
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
        getLibraryPagination({commit},payload){
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `library?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("loadMore", response.data.data)
                }).catch(err =>{
                    reject(err)

                })
            })
        },
        getLibraryDetail({commit}, payload){
            commit("gettingLibraryDetail", true);
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `/library/detail?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("gettingLibraryDetail", false);
                    commit("getLibraryDetail", response.data.data)
                }).catch(err =>{
                    reject(err)
                    commit("gettingLibraryDetail", false);
                })
            })

        }
    }

}