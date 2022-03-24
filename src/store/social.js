import axios from "axios"
import config from "./../config"
import helper from "@/helper/helper";
import auth from "@/store/auth";

export default {
    namespaced: true,
    state: {
        loading: false,
        social: [],
        ads: [],
        loadingMore: false,
        loadingComment: false,
        comments: [],
        replies: []
    },
    mutations: {
        getReply(state, payload) {
            state.replies = payload
        },
        replyComment(state, payload) {
            if (state.replies.list) {
                state.replies.list.push(payload)
            }
            state.comments.comments = state.comments.comments.filter(item => {
                if (item._id === payload.comment_id) {
                    item.reply_comment = payload
                }
                return item
            })
        },
        addComment(state, payload) {
            state.comments.comments.unshift(payload)
        },
        loadingComment(state, payload) {
            state.loadingComment = payload
        },
        getComment(state, payload) {
            state.comments = payload
        },
        liker(state, payload) {
            let user = {
                _id: auth.state.stProfile._id,
                name: auth.state.stProfile.first_name + ' ' + auth.state.stProfile.last_name,
                photo: auth.state.stProfile.photo
            }
            state.social = state.social.filter(item => {
                if (item._id == payload.id) {
                    item.liker.push(user)
                    item.total.like = parseInt(item.total.like) + 1
                }
                return item
            })
        },
        removeLike(state, payload) {
            state.social = state.social.filter(item => {
                if (item._id == payload.id) {
                    item.liker = payload.liker
                    item.total.like = parseInt(item.total.like) - 1
                }
                return item
            })
        },
        loadingMore(state, payload) {
            state.loadingMore = payload
        },
        postingSocial(state, payload) {
            state.loading = payload
        },
        getSocial(state, payload) {
            state.social = payload.filter(item => item.type !== 51 && item.type !== 52)
            state.ads = payload.filter(item => item.type === 51 || item.type === 52)
        },
        newPost(state, payload) {
            state.social.unshift(payload)
        },
        getMoreSocial(state, payload) {
            if (payload.length) {
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i].type === 51 || payload[i].type === 52) {
                        state.ads.push(payload[i])
                    } else {
                        state.social.push(payload[i])
                    }
                }
            }
        }
    },
    actions: {
        getSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social?${helper.q(payload)}`).then(res => {
                    commit("postingSocial", true)
                    commit("getSocial", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        getMoreSocial({commit}, payload) {
            commit("loadingMore", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social?${helper.q(payload)}`).then(res => {
                    commit("getMoreSocial", res.data.data)
                    resolve(res.data)
                    commit("loadingMore", false)
                }).catch(err => {
                    reject(err)
                    commit("loadingMore", false)
                })
            })
        },
        postSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social`, payload).then(res => {
                    commit("postingSocial", false)
                    commit("newPost", res.data.data)
                    resolve(res.data.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        like({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/like`, payload).then(res => {
                    commit("liker", payload)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        deleteLike({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `social/like`, {
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
        },
        addComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/comment`, payload).then(res => {
                    commit("addComment", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        replyComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/comment/reply`, payload).then(res => {
                    commit("replyComment", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getComment({commit}, payload) {
            commit("loadingComment", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/comment?${helper.q(payload)}`).then(res => {
                    commit("getComment", res.data.data)
                    commit("loadingComment", false)
                    resolve(res.data.data)
                }).catch(err => {
                    commit("loadingComment", false)
                    reject(err)
                })
            })
        },
        getReply({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/comment/reply?${helper.q(payload)}`).then(res => {
                    commit("getReply", res.data.data)
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

    }

}