import axios from "axios"
import config from "./../config"
import helper from "@/helper/helper";

export default {
    namespaced: true,
    state: {
        loading: false,
        courses: {},
        packages: [],
        playlist: []
    },
    mutations: {
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
    },

}