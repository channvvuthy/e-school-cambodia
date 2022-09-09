import axios from "axios"
import config from "./../config"
import err from "./../helper/err"
import helper from "@/helper/helper";

export default {
    namespaced: true,
    state: {
        help: "",
        loadingHelp: "",
        loadingHelpDetail: false,
        youtube_url: "",

    },
    mutations: {
        receivingYouTube(state, payload) {
            state.youtube_url = payload
        },
        loadingHelp(state, payload) {
            state.loadingHelp = payload
        },
        receivingHelp(state, payload) {
            state.help = payload
        },
        gettingHelpDetail(state, payload) {
            state.loadingHelpDetail = payload
        }
    },

    actions: {
        getHelp({commit}) {
            commit("loadingHelp", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + "company/help").then(res => {

                    if (res.data.msg != undefined) {
                        helper.errorMessage(res.data.msg)
                        return
                    }

                    commit("loadingHelp", false)
                    commit("receivingHelp", res.data.data)
                    resolve(res)
                }).catch(err => {
                    commit("loadingHelp", false)
                    reject(err)
                })
            })
        }
    },

}