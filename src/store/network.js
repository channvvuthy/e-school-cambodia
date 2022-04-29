import axios from "axios"
import helper from "../helper/helper"
import config from "./../config"

export default {
    namespaced: true,
    state: {
        active: "friend",
        friends: {},
        friendRequest: [],
        myRequest: [],
        loading: false,
        friendNotInContact: [],
        loadingMore: false,
        adding: false
    },
    mutations: {
        cancelRequest(state, payload) {
            if (state.myRequest.length > 0) {
                state.myRequest.list = state.myRequest.list.filter(item => item._id != payload)
            }
        },
        unFriend(state, payload) {
            state.friends.list = state.friends.list.filter(item => item._id != payload.id)

        },
        removeRequest(state, payload) {
            state.friendRequest.list = state.friendRequest.list.filter(item => item._id != payload)
        },
        getRequestTo(state, payload) {
            state.myRequest = payload
        },
        getMoreRequestTo(state, payload) {
            for (let i = 0; i < payload.list.length; i++) {
                state.myRequest.list.push(payload.list[i])
            }
        },
        switchTab(state, payload) {
            state.active = payload
        },
        loading(state, payload) {
            state.loading = payload
        },
        gettingFriend(state, payload) {
            state.friends = payload
        },
        loadingMore(state, payload) {
            state.loadingMore = payload
        },
        moreFriendNotInContact(state, payload) {
            for (let i = 0; i < payload.list.length; i++) {
                state.friendNotInContact.list.push(payload.list[i])
            }
        },
        addingFriend(state, payload) {
            state.adding = payload
        },
        gettingMoreFriend(state, payload) {
            for (let i = 0; i < payload.list.length; i++) {
                state.friends.list.push(payload.list[i])
            }
        },
        loadingMoreFriend(state, payload) {
            state.loadingMore = payload
        },
        acceptedFriendRequest() {

        },
        gettingMoreFriendRequest(state, payload) {
            for (let i = 0; i < payload.list.length; i++) {
                state.friendRequest.list.push(payload.list[i])
            }
        },
        gettingFriendRequest(state, payload) {
            state.friendRequest = payload
        },
        friendNotInContact(state, payload) {
            state.friendNotInContact = payload
        }
    },
    actions: {
        getFriend({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `friend?${helper.q(payload)}`).then(response => {
                    resolve(response)
                    if (payload.p !== undefined && payload.p > 1) {
                        commit("gettingMoreFriend", response.data.data)
                    } else {
                        commit("gettingFriend", response.data.data)
                    }
                    commit("loading", false)
                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                })
            })
        },

        getFriendRequest({commit}, payload) {
            commit("loading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `friend/request-from?${helper.q(payload)}`).then(response => {
                    resolve(response)
                    if (payload.p !== undefined && payload.p > 1) {
                        commit("gettingMoreFriendRequest", response.data.data)
                    } else {
                        commit("gettingFriendRequest", response.data.data)
                    }
                    commit("loading", false)
                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                })
            })
        },
        getFriendNotInContact({commit}, payload) {
            if (payload.p !== 'undefined' && payload.p > 1) {
                commit("loadingMore", true)
            } else {
                commit("loading", true)
            }
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `friend/add?${helper.q(payload)}`).then(response => {
                    resolve(response)
                    if (payload.p !== 'undefined' && payload.p > 1) {
                        commit("moreFriendNotInContact", response.data.data)
                        commit("loadingMore", false)
                    } else {
                        commit("friendNotInContact", response.data.data)
                        commit("loading", false)
                    }

                }).catch(err => {
                    reject(err)
                    commit("loading", false)
                    commit("loadingMore", false)
                })
            })
        },
        addFriend({commit}, payload) {
            commit("addingFriend", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `friend/add`, payload).then(response => {
                    resolve(response)
                    commit("addingFriend", false)

                }).catch(err => {
                    reject(err)
                    commit("addingFriend", false)

                })
            })
        },
        requestTo({commit}, payload) {
            if (payload.p !== 'undefined' && payload.p > 1) {
                commit("loadingMoreFriend", true)
            } else {
                commit("loading", true)
            }
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `friend/request-to?${helper.q(payload)}`).then(response => {
                    if (payload.p !== 'undefined' && payload.p > 1) {
                        commit("getMoreRequestTo", response.data.data)
                    } else {
                        commit("getRequestTo", response.data.data)
                    }
                    commit("loadingMoreFriend", false)
                    commit("loading", false)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    commit("loadingMoreFriend", false)
                    commit("loading", false)
                })
            })
        },
        cancelRequest({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `friend/request-to`, {
                    headers: {},
                    data: {
                        id: payload
                    }
                }).then(response => {
                    commit("cancelRequest", payload)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        removeRequestUser({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + `friend/request-from`, {
                    headers: {},
                    data: {
                        id: payload
                    }
                }).then(response => {
                    commit("removeRequest", payload)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        acceptFriendRequest({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'friend/request-from', payload).then(response => {
                    commit("acceptedFriendRequest")
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        unFriend({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'unfriend', payload).then(response => {
                    commit("unFriend", payload)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }

}