import axios from "axios";
import config from "../config";

export default {
    namespaced: true,
    state: {
        storyDetail: {
            id: null
        },
        currentStory: {},
    },
    mutations: {
        setStory(state, payload) {
            state.currentStory = payload
        },
        getStoryDetail(state, payload) {
            state.storyDetail = payload
        }
    },
    actions: {
        deleteStory({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `story`, {
                    headers: {},
                    data: {
                        id: payload.id,
                        type: payload.type
                    }
                }).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}