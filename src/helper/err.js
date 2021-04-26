import Vue from 'vue'
import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);
import i18n from "./../i18n"
import store from "./../store"
import router from "./../router/"
const {ipcRenderer} = require('electron')

const err = (msg, type = 1) => {
    Vue.swal.fire({
        title: msg,
        confirmButtonText: i18n.t('1008'),
    }).then((result) => {
        if (result.isConfirmed) {
            if (type === 1) {
                store.dispatch("auth/logout").then(() => {
                    router.push({
                        name: 'login'
                    })
                })
            }
        }
    })
}
const connectionErr = (msg) => {
    Vue.swal.fire({
        title: msg,
        confirmButtonText: i18n.t('1008'),
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("connectionError")
        }
    })
}
const congratulation = (msg, url) => {
    Vue.swal.fire({
        title: msg,
        confirmButtonText: i18n.t('1008'),
    }).then((result) => {
        if (result.isConfirmed) {
            ipcRenderer.send("openLink", url)
        }
    })
}
const success = (msg, width = 300) => {
    Vue.swal.fire({
        width: width,
        title: i18n.t(msg),
        confirmButtonText: i18n.t('1008'),
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(result)
        }
    })
}

const forgotPassword = (msg) => {
    Vue.swal.fire({
        title: msg,
        confirmButtonText: i18n.t('1008'),
    })
}


export default {
    err,
    forgotPassword,
    connectionErr,
    congratulation,
    success
}