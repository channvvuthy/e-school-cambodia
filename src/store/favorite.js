import axios from "axios"
import config from "./../config"
import helper from "./../helper/helper"

export default {
    namespaced: true,

    state: {
        loading: false,
        favorites: [],
        paginationLoading: false,
        temporaryFavorites: [],
        favoritedVideo: [],
        favoritedBook: [],
    },

    mutations: {
        addToCart(state, payload) {
            state.favoritedBook = state.favoritedBook.filter(item => {
                if (item._id === payload) {
                    item.is_in_cart = 1
                }
                return item
            })
        },
        removeFavoriteBook(state, payload) {
            state.favoritedBook = state.favoritedBook.filter(item => item._id != payload)
        },
        addTemporaryFavorite(state, payload) {
            state.temporaryFavorites.push(payload)
        },
        removeTemporaryFavorite(state, payload) {
            state.temporaryFavorites = state.temporaryFavorites.filter(item => item != payload)
        },
        loading(state, status) {
            state.loading = status
        },

        getAddedFavorite(state, favorite) {
            state.favorites = favorite
        },

        removeFav(state, lesson_id) {
            state.favorites = state.favorites.filter(favorite => favorite._id !== lesson_id)
        },

        pagesLoading(state, status) {
            state.paginationLoading = status
        },
        loadMoreFavorite(state, favorites) {
            if (favorites.length) {
                for (let i = 0; i < favorites.length; i++) {
                    state.favorites.push(favorites[i])
                }
            }

        },
        addFavoriteBook() {

        },
        getVideoFavorite(state, payload) {
            state.favoritedVideo = payload
        },
        getBookFavorite(state, payload) {
            state.favoritedBook = payload
        },
        paginateBookFavorite(state, payload) {
            for (let i = 0; i < payload.length; i++) {
                state.favoritedBook.push(payload[i])
            }

        },
        paginateVideoFavorite(state, payload) {
            for (let i = 0; i < payload.length; i++) {
                state.favoritedVideo.push(payload[i])
            }
        },
        removeFavoriteVideo(state, payload) {
            state.favoritedVideo = state.favoritedVideo.filter(item => item._id != payload)
        }
    },

    actions: {
        removeFavoriteBook({commit}, payload) {
            commit("addFavoriteBook")
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + 'favorite/book', {
                    headers: {},
                    data: {
                        id: payload
                    }
                }).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        addFavoriteBook({commit}, payload) {
            commit("addFavoriteBook")
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'favorite/book', {id: payload}).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        async add({commit}, payload) {
            commit("loading", true)
            await axios.post(config.apiUrl + 'favorite/video', {
                id: payload
            }).then(() => {
                commit("loading", false)
            }).catch(() => {
                commit("loading", false);
            })
        },
        getVideoFavorite({commit}, payload) {
            if (!payload.paginate) {
                commit("loading", true)
            }
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `favorite/video?${helper.q(payload)}`).then(response => {
                    commit("loading", false)
                    if (payload.p <= 1) {
                        commit("getVideoFavorite", response.data.data)
                    } else {
                        commit("paginateVideoFavorite", response.data.data)
                    }
                    resolve(response)
                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })

        },
        removeFavoriteVideo({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.delete(config.apiUrl + 'favorite/video', {
                    headers: {},
                    data: {
                        id: payload
                    }
                }).then(response => {
                    resolve(response)
                    commit("removeFavoriteVideo", payload)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        getBookFavorite({commit}, payload) {
            if (!payload.paginate) {
                commit("loading", true)
            }
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `favorite/book?${helper.q(payload)}`).then(response => {
                    commit("loading", false)
                    if (payload.p <= 1) {
                        commit("getBookFavorite", response.data.data)
                    } else {
                        commit("paginateBookFavorite", response.data.data)
                    }
                    resolve(response)

                }).catch(err => {
                    commit("loading", false)
                    reject(err)
                })
            })
        },


        // General favorite
        favoritePagination({commit, dispatch}, page = 1) {
            commit("pagesLoading", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + 'favorite?p=' + page).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        helper.errorMessage(response.data.msg)
                    }

                    resolve(response.data.data)

                    commit("pagesLoading", false)
                    dispatch("loadMoreFavorite", response.data.data)
                }).catch(err => {
                    commit("pagesLoading", false)
                    reject(err)
                })
            })

        },
        loadMoreFavorite({commit}, favorite) {
            commit("loadMoreFavorite", favorite)
        },


        async removeFavorite({commit}, payload) {
            commit("loading", true)
            await axios.delete(config.apiUrl + 'favorite/video',
                {
                    headers: {},
                    data: {
                        id: payload
                    }
                }
            ).then(() => {
                commit("loading", false)
                commit("removeFav", payload)

            }).catch(() => {
                commit("loading", false)
            })
        },


    }
}