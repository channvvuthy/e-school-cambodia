import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);
import i18n from "./../i18n"
import {machineIdSync} from 'node-machine-id'
const os = require('os')


// Validate only number
const isNumber = (evt) => {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
    } else {
        return true;
    }
};
// Cut string with dot
const cutString = function (text, limit) {
    if (text.length > limit)
        for (let i = limit; i > 0; i--) {
            return text.substring(0, i) + '...';
        }
    else
        return text;
};
// Format display view like Facebook (1k)
const kFormatter = (num) => {
    if (!num) {
        return 0
    }
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
};
// Get device id
const deviceId = () => {
    return machineIdSync()
}
// Get os of platform
const deviceOs = () => {
    if(process.platform === `darwin`){
        return 'mac'
    }else if(process.platform === `win32`){
        return 'window'
    }else{
        return 'linux'
    }
}

// Get device name 

const deviceName = () =>{
    return os.hostname()
}
// Calculate price in duration
const durationCalculate = (duration, pricePerMonth, pricePerYear) => {
    if (duration === 12) {
        return "$" + pricePerYear + "/" + `1 ${i18n.t(`year`)}`
    }
    return "$" + (pricePerMonth * duration) + "/" + duration + ` ${i18n.t(`month`)}`
}
const gender = () => {
    let stProfile = localStorage.getItem('stProfile')

    if (stProfile) {
        stProfile = JSON.parse(stProfile)
        return stProfile.gender
    }
    return "F"
}
const timeAgo = (time) =>{
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
    
    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
        return;
    
    return day_diff == 0 && (
            diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        day_diff == 1 && "Yesterday" ||
        day_diff < 7 && day_diff + " days ago" ||
        day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
    }
const numDay = (oldDate, currentDate) => {
    let date1 = new Date(oldDate);
    let date2 = new Date(currentDate);

// To calculate the time difference of two dates
    let Difference_In_Time = date2.getTime() - date1.getTime();

// To calculate the no. of days between two dates
    return Math.round(Difference_In_Time / (1000 * 3600 * 24));
}
const clearDevice = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('stProfile');
    localStorage.removeItem('provinces');
}
const errorMessage = (message) => {
    Vue.$toast.error(i18n.t(message), {
        position: "top-right",
    })
}
const success = (message) => {
    Vue.$toast.success(i18n.t(message), {
        position: "top-right",
    })
}

const q = (payload) => {
    if (!payload) {
        return ""
    }
    return Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');
}
export default{
    isNumber,
    cutString,
    kFormatter,
    deviceId,
    deviceOs,
    durationCalculate,
    gender,
    numDay,
    clearDevice,
    errorMessage,
    q,
    deviceName,
    success,
    timeAgo
}