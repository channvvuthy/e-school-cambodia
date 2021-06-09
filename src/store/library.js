import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"
export default {
    namespaced: true,
    state: {
       libraries:{},
       loading: false,
       showList: false,
       filter_id: '',
       loadingDetail: false,
       details: null,
       readingPdf: ''
    },
    mutations: {
        // Add && remove from in list
        addToFavorite(state, payload){
           state.libraries.list = state.libraries.list.filter(item => {
                if(item._id === payload){
                    item.is_favorite = 1
                }
                return item
            })
            if(state.details != null){
                state.details.is_favorite = 1
            }
        },
        removeFromFavorite(state, payload){
            state.libraries.list = state.libraries.list.filter(item =>{
                if(item._id === payload){
                    item.is_favorite = 0
                }
                return item
            })
            if(state.details != null){
                state.details.is_favorite = 0
            }
        },
        // Add && remove favorite for detail
        addFavorite(state){
            state.details.is_favorite = 1
        },
        removeFavorite(state){
            state.details.is_favorite = 0

        },
        readingPdf(state, payload){
            state.readingPdf = payload
        },
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
        stopWatch(){

        },
        getLibraryDetail(state, payload){
            state.details = payload
        },
        
        gettingLibraryDetail(state, payload){
            state.loadingDetail = payload
        },
        deleteCart(state, payload){
            
            if(state.libraries.list.length){
                state.libraries.list = state.libraries.list.filter(item =>{
                    if(item._id === payload){
                        item.is_in_cart = 0
                    }
                    return item
                })
            }

            if(state.libraries.package.length){
                state.libraries.package = state.libraries.package.filter(item =>{
                    if(item._id === payload){
                        item.is_in_cart = 0
                    }
                    return item
                })
            }
        },
        addToCart(state, payload){
            try{
                state.libraries.list = state.libraries.list.filter(item =>{
                    if(item._id === payload){
                        item.is_in_cart = 1
                    }
                    return item
                })
                state.libraries.package = state.libraries.package.filter(item =>{
                    if(item._id === payload){
                        item.is_in_cart = 1
                    }
                    return item
                })
                console.log(state.libraries.package)
            }catch(err){

            }
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
                axios.get(config.apiUrl + `library/detail?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                    commit("gettingLibraryDetail", false);
                    commit("getLibraryDetail", response.data.data)
                }).catch(err =>{
                    reject(err)
                    commit("gettingLibraryDetail", false);
                })
            })

        },
        stopWatch({commit}, payload){
            commit("stopWatch");
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + `library/stop?${helper.q(payload)}`).then(response =>{
                    resolve(response)
                }).catch(err =>{
                    reject(err)
                })
            })

        }
    }

}