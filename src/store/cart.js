import axios from "axios"
import config from "./../config"
import store from "./../store"
export default {
    namespaced: true,

    state: {
        carts: [],
        loading: false,
        couponLoading: false,
        identifier: 1


    },

    mutations:{
        addingCart(state, payload){
            state.loading = payload
        },
        gettingCart(state, payload){
            state.loading = payload
        },
        deletingCart(state, payload){
            state.loading = payload
        },
        receivedCart(state, payload){
            state.carts = payload
        },
        addingCoupon(state, payload){
            state.couponLoading = payload
        },
        deletingCoupon(){

        },
        updatingDuration(state, params){
            state.carts.list.filter(items => {
                if (items._id === params._id) {
                    items.price['duration'] = params.duration
                }
                return items
            })
        },
        deletedCart(state, payload){
            state.identifier = payload
        },
        checkingOut(){

        }

    },

    actions:{
        // Add cart
        addCart({commit}, payload){
            commit("addingCart", true)
            return new Promise((resolve, reject) =>{
                axios.post(config.apiUrl + 'cart', payload).then(response =>{
                    resolve(response)
                    commit("addingCart", false)
                    store.commit('library/addToCart', payload.id)

                }).catch(errr =>{
                    reject(errr)
                    commit("addingCart", false)
                })
            })
        },
        // Get cart
        getCart({commit}){
            commit("gettingCart", true)
            return new Promise((resolve, reject) =>{
                axios.get(config.apiUrl + 'cart').then(response =>{
                    commit("gettingCart", false)
                    commit("receivedCart", response.data.data)
                    resolve(response)
                }).catch(err =>{
                    commit("gettingCart", false)
                    reject(err)
                })
            })
        },
        // Delete cart
        deleteCart({commit}, payload){
            commit("deletingCart", true)
            return new Promise((resolve, reject) =>{
                axios.delete(config.apiUrl + 'cart',{
                    headers: {

                    },
                    data: {
                      id: payload
                    }
                  }).then(response =>{
                    commit("deletingCart", false)
                    commit("deletedCart", payload)
                    store.commit("partner/deleteCart", payload)
                    store.commit('library/deleteCart', payload)

                    resolve(response)
                }).catch(err =>{
                    commit("deletingCart", false)
                    reject(err)
                })
            })
        },
        // Add coupon
        addCoupon({commit}, payload){
            commit("addingCoupon", true)
            return new Promise((resolve, reject) =>{
                axios.post(config.apiUrl + 'cart/coupon', payload).then(response =>{
                    resolve(response)
                    commit("addingCoupon", false)
                }).catch(err =>{
                    commit("addingCoupon", false)
                    reject(err)
                })
            })
        },
        // Delete coupon
        deleteCoupon({commit}, payload){
            commit("deletingCoupon", true)
            return new Promise((resolve, reject) =>{
                axios.delete(config.apiUrl + 'cart/coupon',{
                    headers: {

                    },
                    data: {
                        code: payload
                    }
                  }).then(response =>{
                    resolve(response)
                }).catch(err =>{
                    reject(err)
                })
            })
        },
        // Update duration
        async updateDuration({commit}, params){
            await  commit("updatingDuration", params)
        },
        // Cart checkout
        cartCheckout({commit}, payload){
            commit("checkingOut")
            return new Promise((resolve, reject) =>{
                axios.post(config.apiUrl + 'cart/checkout', payload).then(response =>{
                    resolve(response)
                    
                }).catch(err =>{
                    reject(err)
                })
            })
        }
    }
}