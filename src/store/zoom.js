import axios from "axios"
import config from "./../config"
import helper from "@/helper/helper";

export default {
    namespaced: true,
    state: {
        loading: false,
        courses: {},
        packages: [],
        playlist: [],
        zooms: [],
        loadingMyZoom: false,
    },
    mutations: {
        loadingMyZoom(state, payload) {
            state.loadingMyZoom = payload
        },
        pushtMyZoom(state, payload) {
            for (let i = 0; i < payload.list.length; i++) {
                state.zooms.list.push(payload.list[i])
            }
        },
        getMyZoom(state, payload) {
            state.zooms = payload
        },
        getPagingMyZoom(state, payload) {
            for (let i = 0; i < payload.length; i++) {
                state.zooms.push(payload[i])
            }
        },
        addToCart(state, payload) {
            state.courses.list = state.courses.list.filter(item => {
                if (item._id === payload) {
                    item.is_in_cart = 1
                }
                return item
            })
        },
        gettingVideo(state, payload) {
            state.loading = payload
        },
        gettingPlaylist(state, payload) {
            state.playlist = payload
        },
        getZoomPackage(state, payload) {
            state.packages = payload
        },
        gettingZoom(state, payload) {
            state.loading = payload
        },
        getZoomCourse(state, payload) {
            state.courses = payload
        },
        getZoomCourseWidthPagination(state, payload) {
            for (let i = 0; i < payload.length; i++) {
                state.courses.list.push(payload[i]);
            }
        },
    },

    actions: {
        getZoomCourse({commit}, payload) {
            commit("gettingZoom", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `zoom/course?${helper.q(payload)}`).then(res => {
                    resolve(res.data)
                    commit("getZoomCourse", res.data.data)
                }).catch(err => {
                    reject(err)
                }).finally(() => {
                    commit("gettingZoom", false)
                })
            })
        },
        getZoomCourseWithPagination({commit}, payload) {
            let qs = Object.keys(payload)
                .map(key => `${key}=${payload[key]}`)
                .join('&');
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `zoom/course?${qs}`).then(res => {
                    commit("getZoomCourseWidthPagination", res.data.data.list);
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getZoomPackage({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `zoom/package?${helper.q(payload)}`).then(res => {
                    resolve(res.data)
                    commit("getZoomPackage", res.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getPlaylist({commit}, payload) {
            commit("gettingVideo", true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `zoom/course-detail?${helper.q(payload)}`).then(res => {
                    commit("gettingPlaylist", res.data.data)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                }).finally(() => {
                    commit("gettingVideo", false)
                })
            })
        },
        getMyZoom({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('loadingMyZoom', true);
                axios.get(config.apiUrl + `me/zoom?${helper.q(payload)}`).then(res => {
                    commit('loadingMyZoom', false);
                    resolve(res.data)
                    if (res.data.status && res.data.status === 2) {
                        helper.errorMessage(res.data.msg)
                    } else {
                        if (payload.p > 1) {
                            commit('pushtMyZoom', res.data.data)
                        } else {
                            commit("getMyZoom", res.data.data)
                        }
                    }
                }).catch(err => {
                    commit('loadingMyZoom', true);
                    reject(err)
                })
            })
        },
        getZoomAttendant({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `zoom/attendance?${helper.q(payload)}`).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    },

}