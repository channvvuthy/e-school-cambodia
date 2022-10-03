import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/tailwind.css";
import axios from "axios";
import config from "./config";
import helper from "./helper/helper";
import VueSweetalert2 from "vue-sweetalert2";
import i18n from "./i18n";
import "tw-elements";
import "sweetalert2/dist/sweetalert2.min.css";

Vue.use(VueSweetalert2);
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["xtoken"] = token;
      config.headers["device-id"] = helper.deviceId();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.data && response.data.status == 1) {
      helper.errorMessage(response.data.msg);
    }

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["app-version"] = config.appVersion;
axios.defaults.headers.common["device-os"] = helper.deviceOs();
axios.defaults.headers.common["device-id"] = helper.deviceId();
axios.defaults.headers.common["device-name"] = helper.deviceName();

axios.defaults.headers.common["Authorization"] = config.auth;

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  // use the language from the routing param or default language
  let language = localStorage.getItem("localize");
  if (!language) {
    language = "en";
  }

  // set the current language for i18n.
  i18n.locale = language;
  next();
});
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  created() {
    if (localStorage.getItem("token")) {
      store.commit(
        "auth/studentProfile",
        JSON.parse(localStorage.getItem("stProfile"))
      );
    }

    let darkMode = localStorage.getItem("darkMode");

    if (darkMode) {
      if (
        darkMode == "null" ||
        darkMode == null ||
        darkMode == "false" ||
        darkMode == false
      ) {
        store.commit("setting/setDarkMode", false);
      } else {
        store.commit("setting/setDarkMode", true);
      }
    } else {
      store.commit(
        "setting/setDarkMode",
        localStorage.setItem("darkMode", false)
      );
    }

    if (!localStorage.getItem("localize")) {
      localStorage.setItem("localize", "en");
    }
    
    if (localStorage.getItem("isMerchant") == 1) {
      this.$store.commit("auth/checkIsMerchant", 1);
    } else {
      this.$store.commit("auth/checkIsMerchant", 0);
    }
  },
}).$mount("#app");
