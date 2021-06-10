import config from "./../config"
import axios from "axios"
import err from "./../helper/err"
import helper from "./../helper/helper"

export default {
    namespaced: true,
    state: {
        receipts: [],
        receiptDetail: [],
        takingReceipt: false,
        deleting: false,
        loadingReceipt: false,

    },
    mutations: {
        deletedReceipt(state, _id){
            state.receipts = state.receipts.filter(item => item._id !== _id)
        },
        gettingReceipt(state, receipts){
            state.receipts = receipts
        },
        takingReceipt(state, status){
            state.takingReceipt = status
        },
        loadingReceipt(state, status){
            state.loadingReceipt = status
        },
        receivingReceipt(state, receiptDetail){
            state.receiptDetail = receiptDetail
        },
        removingReceipt(state, status){
            state.deleting = status
        },
        paginationReceipt(state, payload){
            for(let i = 0; i < payload.length; i++){
                state.receipts.push(payload[i])
            }
        }
    },

    actions: {
        getReceiptDetail({commit}, id){
            commit("loadingReceipt", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + 'invoice/detail/?id=' + id).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                    }


                    commit("loadingReceipt", false)
                    commit("receivingReceipt", response.data.data)
                    resolve(response)
                }).catch(err => {
                    commit("loadingReceipt", false)
                    reject(err)
                })
            })
        },
        deleteReceipt({commit}, id){
            commit("removingReceipt", true)
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + 'invoice',{
                    headers:{

                    },
                    data:{
                        id:id
                    }
                }).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                    }


                    commit("removingReceipt", false)
                    commit("deletedReceipt", id)
                    resolve(response)
                }).catch(err => {
                    commit("removingReceipt", false)
                    reject(err)
                })
            })
        },

        getReceipt({commit}, payload){
            commit("takingReceipt", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `invoice?${helper.q(payload)}`).then(response => {
                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                    }
                    commit("takingReceipt", false)
                    if(payload.p > 1){
                        commit('paginationReceipt', response.data.data)
                    }else{
                        commit('gettingReceipt', response.data.data)
                    }
                    resolve(response)
                }).catch(err => {
                    commit("takingReceipt", false)
                    reject(err)
                })
            })
        },
    }
}