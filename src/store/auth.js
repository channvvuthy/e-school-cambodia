import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from "./../config"
import studentProfileData from "./../data/student"
import err from "./../helper/err"
import helper from "./../helper/helper"

Vue.use(Vuex);

export default {
    namespaced: true,
    state: {
        loginLoading: false,
        checking: false,
        changing: false,
        phone: null,
        loadingRegister: false,
        updatingPhoto: false,
        logout: false,
        ifUpdate: false,
        userChangingPassword: false,
        stProfile: studentProfileData,
        notifications: [],
        notificationDetail: {},
        loadingNotification: false,
        loadingNotificationPagination: false,
        readingNotice: false,
        token: localStorage.getItem('token'),
        story: [],
        loadingStory: false,
        storyDetail: "",
        storyIndex: 0,
        imgUrl: "",
        addingStory: false,
        userDetails: {},
        isMerchant: 0,
        notify: {
            notifications: 0,
            carts: 0,
        },

    },

    mutations: {
        checkIsMerchant(state, payload){
            state.isMerchant =payload
        },
        getNotify(state, payload) {
            state.notify = payload
        },
        getUserDetail(state, payload) {
            state.userDetails = payload
        },
        getNotificationDetail(state, payload) {
            state.notificationDetail = payload
        },
        addedStory() {

        },
        addingStory(state, payload) {
            state.addingStory = payload
        },
        setImgUrl(state, payload) {
            state.imgUrl = payload
        },
        setStoryIndex(state, payload) {
            state.storyIndex = payload
        },
        loadingStory(state, status) {
            state.loadingStory = status
        },
        receivingStory(state, payload) {
            state.story = payload
        },
        receiveMoreStory(state, payload) {
            if (payload.length) {
                for (let i = 0; i < payload.length; i++) {
                    state.story.push(payload[i])
                }
            }
        },
        receivingMoreStoryDetail(state, payload) {
            for (let i = 0; i < payload.viewer.length; i++) {
                state.storyDetail.viewer.push(payload.viewer[i])
            }

        },
        gettingStoryDetail(state, payload) {
            state.loadingStory = payload
        },
        receivingStoryDetail(state, payload) {
            state.storyDetail = payload
        },
        receivingToken(state, token) {
            state.token = token
        },
        readingNotification(state, status) {
            state.readingNotice = status
        },
        loadingNotification(state, status) {
            state.loadingNotification = status
        },
        loadingNotificationPagination(state, status) {
            state.loadingNotificationPagination = status
        },
        receiveNotification(state, notifications) {
            state.notifications = notifications
        },
        receiveNotificationPagination(state, notifications) {
            for (let index = 0; index < notifications.length; index++) {
                state.notifications.push(notifications[index])
            }
        },

        loging(state, payload) {
            state.loginLoading = payload
        },
        changingForgotPassword(state, status) {
            state.changing = status
        },
        studentProfile(state, stProfile) {
            state.stProfile = stProfile
        },
        checkingPhone(state, status) {
            state.checking = status
        },
        getPhoneNumber(state, phone) {
            state.phone = phone
        },
        registering(state, status) {
            state.loadingRegister = status
        },
        userLogout(state, status) {
            state.logout = status
        },
        changingProfile(state, status) {
            state.updatingPhoto = status
        },
        userChangingProfile(state, status) {
            state.ifUpdate = status
        },
        userChangePassword(state, status) {
            state.userChangingPassword = status
        },
    },

    actions: {
        getUser({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `user/detail?${helper.q(payload)}`).then((response) => {
                    commit("getUserDetail", response.data)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        login({commit}, auth) {
            let instance = axios.create();
            delete instance.defaults.headers.common['xtoken'];
            commit("loging", true);
            return new Promise((resolve, reject) => {
                instance.post(config.apiUrl + 'user/login', auth).then(response => {
                    if (response.data.status === 0) {
                        axios.defaults.headers.common['xtoken'] = response.data.data.token;
                    } else {
                        delete axios.defaults.headers.common['xtoken']
                    }
                    commit("loging", false);
                    resolve(response)
                }).catch(error => {
                    commit("loging", false);

                    reject(error)
                })
            })
        },
        getStory({commit}, page = 1) {
            commit("loadingStory", true)
            return new Promise((resolve, reject) => {
                if (page == 1) {
                    page = "";
                }
                axios.get(config.apiUrl + `story?p=${page}`).then(response => {
                    commit("loadingStory", false);
                    if (page > 1) {
                        commit("receiveMoreStory", response.data.data);
                    } else {
                        commit("receivingStory", response.data.data);
                    }
                    resolve(response);
                }).catch(err => {
                    commit("loadingStory", false)
                    reject(err)
                })
            })
        },
        viewStory({commit}, payload) {
            let qs = Object.keys(payload)
                .map(key => `${key}=${payload[key]}`)
                .join('&');
            commit("gettingStoryDetail", true);
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `story/view?${qs}`).then(response => {
                    resolve(response)
                    commit("gettingStoryDetail", false);
                    if (payload.p > 1) {
                        commit("receivingMoreStoryDetail", response.data.data)
                    } else {
                        commit("receivingStoryDetail", response.data.data)
                    }
                }).catch(err => {
                    reject(err)
                    commit("gettingStoryDetail", false);
                })
            })
        },
        addMyStory({commit}, payload) {
            commit("addingStory", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + "story", payload).then(response => {
                    resolve(response)
                    commit("addingStory", false)
                    commit("addedStory", response.data.data)
                }).catch(err => {
                    commit("addingStory", false)
                    reject(err)
                })
            });

        },
        checkPhoneExist({commit}, payload) {
            let instance = axios.create();
            delete instance.defaults.headers.common['xtoken'];
            commit("checkingPhone", true)
            return new Promise((resolve, reject) => {
                instance.get(config.apiUrl + `user/forget-password?${helper.q(payload)}`).then(response => {
                    commit("checkingPhone", false)
                    resolve(response.data)
                }).catch(error => {
                    commit("checkingPhone", false)
                    reject(error)
                })
            })
        },
        changeForgotPassword({commit}, params) {
            let instance = axios.create();
            delete instance.defaults.headers.common['xtoken'];
            instance.defaults.headers.common['xtoken'] = params.xtoken;
            commit("changingForgotPassword", true)
            return new Promise((resolve, reject) => {
                instance.post(config.apiUrl + 'user/forget-password', params).then(response => {
                    commit("changingForgotPassword", false)
                    resolve(response.data)
                }).catch(err => {
                    commit("changingForgotPassword", false)
                    reject(err)
                })
            })
        },

        getPhone({commit}, phone) {
            commit("getPhoneNumber", phone)
        },

        getStudentProfile({commit}, stProfile) {
            commit("studentProfile", stProfile)
        },

        register({
                     commit
                 }, params) {
            commit("registering", true)
            return new Promise((resolve, reject) => {
                delete axios.defaults.headers.common["xtoken"];

                axios.post(config.apiUrl + 'user/register', params).then(response => {
                    commit("registering", false)
                    resolve(response.data)
                }).catch(err => {
                    commit("registering", false)
                    reject(err)
                })
            })
        },

        logout({}) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + 'me/logout').then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        clearLogout({commit}) {
            localStorage.clear()
            commit("receivingToken", null)
        },

        changeProfilePhotoPhoto({commit}, formData) {
            commit('changingProfile', true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'me/update-photo',
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                        return
                    }

                    commit('changingProfile', false)
                    resolve(response.data)
                }).catch(err => {
                    commit('changingProfile', false)
                    reject(err)
                })
            })
        },

        changeProfile({commit}, params) {
            commit("userChangingProfile", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + 'me/update-profile', params).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                        commit("userChangingProfile", false)
                        return
                    }

                    commit("userChangingProfile", false)
                    resolve(response.data)
                }).catch(err => {
                    commit("userChangingProfile", false)
                    reject(err)
                })
            })
        },
        userChangePassword({commit}, params) {
            commit("userChangePassword", true)
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + "me/update-password", params).then(response => {

                    if (response.data.status && response.data.status === 2) {
                        err.err(response.data.msg)
                        commit('userChangePassword', false)
                        return
                    }

                    commit('userChangePassword', false)
                    resolve(response.data)
                }).catch(err => {
                    commit('userChangePassword', false)
                    reject(err)
                })
            })
        },

        getNotification({commit}, page = 1) {
            if (page === 1) {
                commit("loadingNotification", true)
                return new Promise((resolve, reject) => {
                    axios.get(config.apiUrl + 'notification?p=' + page).then(response => {

                        if (response.data.status && response.data.status === 2) {
                            err.err(response.data.msg)
                        }


                        commit("loadingNotification", false)
                        commit("receiveNotification", response.data.data)
                        resolve(response.data.data)
                    }).catch(err => {
                        reject(err)
                    })
                })
            } else {
                commit("loadingNotificationPagination", true)
                return new Promise((resolve, reject) => {
                    axios.get(config.apiUrl + 'notification?p=' + page).then(response => {

                        if (response.data.status && response.data.status === 2) {
                            err.err(response.data.msg)
                        }


                        commit("loadingNotificationPagination", false)
                        commit("receiveNotificationPagination", response.data.data)
                        resolve(response.data.data)
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        },

        readingNotification({commit}, id) {
            commit('readingNotification', true)
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + 'notification/read?id=' + id).then(response => {
                    commit('readingNotification', false)
                    commit("getNotificationDetail", response.data.data)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    commit('readingNotification', false)
                })
            })

        },

        getToken({commit}, token) {
            commit("receivingToken", token)
        },
        getRelative() {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `me/relative`).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                    helper.errorMessage(err.response.data.msg)
                })
            })
        },
        getQr() {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `me/qrcode`).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getNotify({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `me/notify`).then(response => {
                    resolve(response)
                    commit("getNotify", response.data.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        updateCover({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `me/update-photo-cover`, payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        updateName({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `me/update-name`, payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        updatePhone({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(config.apiUrl + `me/update-phone`, payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getNames({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `me/update-name`).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getPhoneUpdate({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(config.apiUrl + `me/update-phone`).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}

