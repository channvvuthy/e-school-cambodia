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
        replies: [],
        likes: [],
        actionId: null,
        socialComment: {},
        favorites: [],
        recomments: [],
    },
    mutations: {
        getRecomment(state, payload) {
            state.recomments = payload
        },
        getFavorite(state, payload) {
            state.favorites = payload
        },
        socialComment(state, payload) {
            state.socialComment = payload
        },
        deleteReplyComment(state, payload) {
        },
        deleteComment(state, payload) {
            state.comments.comments = state.comments.comments.filter(item => item._id != payload)
        },
        setActionId(state, payload) {
            state.actionId = payload
        },
        addFavorite(state, payload) {
            state.social = state.social.filter(item => {
                if (item._id == payload.id) {
                    item.is_favorite = 1
                }
                return item
            })
        },
        deleteFavorite(state, payload) {
            state.social = state.social.filter(item => {
                if (item._id == payload.id) {
                    item.is_favorite = 0
                }
                return item
            })
        },
        deleteSocial(state, payload) {
            state.social = state.social.filter(item => item._id != payload)
        },
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
            if (payload.isFavorite) {
                state.favorites = state.favorites.filter(item => {
                    if (item._id == payload.id) {
                        item.is_like = 1
                        item.liker.push(user)
                        item.total.like = parseInt(item.total.like) + 1
                    }
                    return item
                })
            } else {
                state.social = state.social.filter(item => {
                    if (item._id == payload.id) {
                        item.is_like = 1
                        item.liker.push(user)
                        item.total.like = parseInt(item.total.like) + 1
                    }
                    return item
                })
            }

        },
        removeLike(state, payload) {
            if (payload.isFavorite) {
                state.favorites = state.favorites.filter(item => {
                    if (item._id == payload.id) {
                        item.is_like = 0
                        item.liker = payload.liker
                        item.total.like = parseInt(item.total.like) - 1
                    }
                    return item
                })
            } else {
                state.social = state.social.filter(item => {
                    if (item._id == payload.id) {
                        item.is_like = 0
                        item.liker = payload.liker
                        item.total.like = parseInt(item.total.like) - 1
                    }
                    return item
                })
            }
        },
        loadingMore(state, payload) {
            state.loadingMore = payload
        },
        postingSocial(state, payload) {
            state.loading = payload
        },
        getSocial(state, payload) {
            state.social = payload
            // state.ads = payload.filter(item => item.type === 51 || item.type === 52)
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
        },
        getLiker(state, payload) {
            state.likes = payload
        },
        geMoretLiker(state, payload) {
            if (payload.liker && payload.liker.length) {
                for (let i = 0; i < payload.liker.length; i++) {
                    state.likes.liker.push(payload.liker[i])
                }
            }
        },
    },
    actions: {
        getSocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social?${helper.q(payload)}`).then(res => {
                    commit("postingSocial", true)
                    if (res.data && res.data.status == 2)
                        helper.errorMessage(res.data.msg)
                    else
                        commit("getSocial", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        getMySocial({commit}, payload) {
            commit("postingSocial", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/me?${helper.q(payload)}`).then(res => {
                    commit("postingSocial", true)
                    if (res.data && res.data.status == 2)
                        helper.errorMessage(res.data.msg)
                    else
                        commit("getSocial", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        getMoreMySocial({commit}, payload) {
            commit("loadingMore", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/me?${helper.q(payload)}`).then(res => {
                    commit("getMoreSocial", res.data.data)
                    resolve(res.data)
                    commit("loadingMore", false)
                }).catch(err => {
                    commit("loadingMore", false)
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
                    if (res.data && res.data.data) {
                        commit("newPost", res.data.data)
                    }
                    resolve(res.data.data)
                }).catch(err => {
                    commit("postingSocial", false)
                    reject(err)
                })
            })
        },
        editSocial({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.put(config.apiUrl + `social`, payload).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        editComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                let url = 'social/comment'
                if (payload.replyId) {
                    delete payload.replyId
                    url = "social/comment/reply"
                }

                axios.put(config.apiUrl + url, payload).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
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
        deleteSocial({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `social`, {
                    headers: {},
                    data: {
                        id: payload.id,
                    }
                }).then(res => {
                    resolve(res.data)
                    commit("deleteSocial", payload.id)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        addComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/comment`, payload).then(res => {
                    if (res.data.msg == undefined) {
                        commit("addComment", res.data.data)
                    }
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        replyComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `social/comment/reply`, payload).then(res => {
                    if (res.data.msg == undefined) {
                        commit("replyComment", res.data.data)
                    }
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
                    if (res.data.msg == undefined) {
                        commit("getComment", res.data.data)
                    }
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
                    if (res.data.msg == undefined) {
                        commit("getReply", res.data.data)
                    }
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        deleteComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `social/comment`, {
                    headers: {},
                    data: {
                        id: payload.id,
                    }
                }).then(res => {
                    commit("deleteComment", payload.id)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        deleteReplyComment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `social/comment/reply`, {
                    headers: {},
                    data: {
                        id: payload.id,
                    }
                }).then(res => {
                    commit("deleteReplyComment", payload)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        countView({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/view?${helper.q(payload)}`).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        viewVideo({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/view/video?${helper.q(payload)}`).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getFavorite({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `favorite/social?${helper.q(payload)}`).then(res => {
                    commit("getFavorite", res.data.data)
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        addFavorite({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `favorite/social`, payload).then(res => {
                    resolve(res.data.data)
                    commit("addFavorite", payload)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        deleteFavorite({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `favorite/social`, {
                    headers: {},
                    data: {
                        id: payload.id,
                    }
                }).then(res => {
                    resolve(res.data)
                    commit("deleteFavorite", payload)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getLiker({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/like?${helper.q(payload)}`).then(res => {
                    commit("getLiker", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        geMoretLiker({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/like?${helper.q(payload)}`).then(res => {
                    commit("geMoretLiker", res.data.data)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        copyLink({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/share?${helper.q(payload)}`).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getRecomment({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `social/recomment-course?${helper.q(payload)}`).then(res => {
                    resolve(res.data)
                    commit("getRecomment", res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },


    }

}