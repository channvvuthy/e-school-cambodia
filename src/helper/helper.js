import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

Vue.use(VueToast);
import i18n from "./../i18n";
import { machineIdSync } from "node-machine-id";
import config from "@/config";

const os = require("os");
const crypto = require("crypto");

// Validate only number
const isNumber = (evt) => {
  evt = evt ? evt : window.event;
  let charCode = evt.which ? evt.which : evt.keyCode;

  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    return true;
  }
};
// Cut string with dot
const cutString = function (text, limit) {
  if (text && text.length > limit)
    for (let i = limit; i > 0; i--) {
      return text.substring(0, i) + "...";
    }
  else return text;
};
// Format display view like Facebook (1k)
const kFormatter = (num) => {
  if (!num) {
    return 0;
  }
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};
// Get device id
const deviceId = () => {
  return machineIdSync();
};
// Get os of platform
const deviceOs = () => {
  if (process.platform === `darwin`) {
    return "macos";
  } else if (process.platform === `win32`) {
    return "windows";
  } else {
    return "linux";
  }
};

// Get device name

const deviceName = () => {
  return os.hostname();
};

// Os version
const osVersion = () => {
  return os.release();
};
// Calculate price in duration
const durationCalculate = (duration, pricePerMonth, pricePerYear) => {
  if (duration === 12) {
    return "$" + pricePerYear + "/" + `1 ${i18n.t(`year`)}`;
  }
  return (
    "$" + pricePerMonth * duration + "/" + duration + ` ${i18n.t(`month`)}`
  );
};
const gender = () => {
  let stProfile = localStorage.getItem("stProfile");

  if (stProfile) {
    stProfile = JSON.parse(stProfile);
    return stProfile.gender;
  }
  return "F";
};

const numDay = (oldDate, currentDate) => {
  let date1 = new Date(oldDate);
  let date2 = new Date(currentDate);

  // To calculate the time difference of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  return Math.round(Difference_In_Time / (1000 * 3600 * 24));
};
const clearDevice = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("stProfile");
  localStorage.removeItem("provinces");
};
const errorMessage = (message) => {
  Vue.$toast.error(i18n.t(message), {
    position: "top-right",
  });
};
const success = (message) => {
  Vue.$toast.success(i18n.t(message), {
    position: "top-right",
  });
};

const q = (payload) => {
  if (!payload) {
    return "";
  }
  return Object.keys(payload)
    .map((key) => `${key}=${payload[key]}`)
    .join("&");
};
const linkify = (inputText) => {
  let replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank" class="text-fb">$1</a>'
  );

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank" class="text-fb">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
};

const dataURLtoBlob = (dataurl) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const khmerNumber = (str) => {
  let string = str.toString();
  return string
    .replace(/1/g, "១")
    .replace(/2/g, "២")
    .replace(/3/g, "៣")
    .replace(/4/g, "៤")
    .replace(/5/g, "៥")
    .replace(/6/g, "៦")
    .replace(/7/g, "៧")
    .replace(/8/g, "៨")
    .replace(/9/g, "៩")
    .replace(/0/g, "០");
};

const encrypt = (text) => {
  let iv = Buffer.from(config.secretKey);
  let key = Buffer.from(config.secretKey.toString("base64"));
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  return encrypted + cipher.final("base64");
};

const decrypt = (text) => {
  let iv = Buffer.from(config.secretKey);
  let key = Buffer.from(config.secretKey.toString("base64"));
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(text, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};

export default {
  encrypt,
  decrypt,
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
  osVersion,
  khmerNumber,
  linkify,
  dataURLtoBlob,
};
