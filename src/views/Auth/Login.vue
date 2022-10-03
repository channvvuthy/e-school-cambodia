<template>
    <div class="flex flex-col justify-between h-screen" :class="darkMode?`bg-youtube`:`bg-white`">
        <a href="#" class="absolute left-2 top-2 text-xs uppercase font-black" @click="()=>{this.$router.push('/')}">
            {{$t('1101')}}
        </a>
        <div class="flex justify-center items-center h-full flex-1">
            <div class="flex-col rounded-3xl w-100 p-6 e-shadow" :class="darkMode?`bg-secondary`:`bg-white`">
                <div class="flex flex-col justify-center items-center">
                    <div class="border border-primary w-20 h-20 leading-20 flex justify-center items-center rounded-full bg-white">
                        <img src="/e-school-logo.png" class="w-12"/>
                    </div>
                </div>
                <div class="mt-10">
                    <form class="flex-col text-sm font-khmer_os" v-if="tap == 'login'">
                        <div class="relative">
                            <span class="absolute mt-2 text-sm font-medium opacity-30"
                                  :class="darkMode?`left-2`:`left-0`">
                                <PhoneIcon :fill="darkMode?`#e4e7eb`:`#000000`"/>
                            </span>
                            <input type="text" :placeholder="$t('2009')" v-model="auth.phone"
                                   @keypress="isNumber($event)" ref="phone"
                                   :class="darkMode?`caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border
                                   border-youtube`:`border-borderGray`"
                                   class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4 pl-10 border-b"/>
                        </div>
                        <div class="h-5"></div>
                        <div class="relative">
                            <span class="absolute mt-2 text-sm font-medium opacity-40"
                                  :class="darkMode?`left-2`:`left-0`">
                                <lock-icon :fill="darkMode?`#e4e7eb`:`#000000`"/>
                            </span>
                            <input type="password" :placeholder="$t('2010')" autocomplete="off" v-model="auth.password"
                                   v-on:keyup.enter="studentLogin"
                                   ref="password"
                                   :class="darkMode?`caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border
                                   border-youtube`:`border-borderGray`"
                                   class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4 pl-10 border-b"/>
                        </div>
                        <div class="h-3"></div>
                        <div class="text-right cursor-pointer mb-4" @click="goTo('forgot-password')"
                             :class="darkMode?`text-white`:`text-gray-500 `">
                            {{$t('2011')}}?
                        </div>
                        <div class="h-3"></div>
                    </form>

                    <button
                            class="relative focus:outline-none h-11 p-3 text-center flex
                            justify-center items-center text-white rounded-lg w-full
                            text-sm outline-none cursor-pointer font-khmer_os"
                            :class="darkMode?`bg-button`:`bg-primary`"
                            @click="studentLogin" :disabled="loginLoading">
                        <div class="pl-2">
                            <span v-if="!loginLoading">{{$t('2007')}}</span>
                            <div class="absolute flex justify-center items-center -top-2" v-else>
                                <div class="loader"></div>
                            </div>
                        </div>
                    </button>
                    <div class="h-10"></div>
                    <div class="flex justify-end text-sm">
                        <div class="mr-3" :class="darkMode?`text-white`:`text-gray-500`">{{$t('2012')}}</div>
                        <div class="underline cursor-pointer" @click="goTo('register')"
                             :class="darkMode?`text-white`:`text-primary`">{{$t('2008')}}
                        </div>
                    </div>
                </div>
            </div>
            <template>
                <Message
                        v-if="errorMessage"
                        :message="errorMessage"
                        @closeMessage="closeMessage"/>
            </template>
        </div>
        <img src="e-footer.png"
             class="w-full"
             v-if="!darkMode"/>
    </div>
</template>

<script>
    import Message from "./components/Message"
    import helper from "./../../helper/helper"
    import {mapActions, mapState} from "vuex"
    import config from "./../../config"
    import studentProfileData from "./../../data/student"
    import PhoneIcon from "./../../components/PhoneIcon.vue"
    import LockIcon from "./../../components/LockIcon.vue"


    export default {
        components: {
            PhoneIcon,
            Message,
            LockIcon
        },
        data() {
            return {
                tap: "login",
                forgotPassword: false,
                loading: false,
                errorMessage: null,
                auth: {
                    phone: null,
                    password: null,
                    device_id: helper.deviceId(),
                    device_os: helper.deviceOs(),
                    app_version: config.appVersion
                }
            }
        },

        computed: {
            ...mapState('auth', ['loginLoading']),
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            ...mapActions('auth', ['login', 'getStudentProfile', 'getToken']),

            changePasswordSuccess() {
                this.forgotPassword = false
            },
            cancel() {
                this.forgotPassword = false;
            },

            agree() {
                this.forgotPassword = false;
            },

            closeMessage() {
                this.errorMessage = null;
            },

            isNumber(evt) {
                return helper.isNumber(evt)
            },
            goTo(page) {
                this.$router.push({name: page})
            },
            studentLogin() {
                if (this.loginLoading) {
                    return
                }

                if (this.auth.phone && this.auth.password) {
                    this.login(this.auth).then(res => {
                        if (res.data.status !== 0) {
                            helper.errorMessage(res.data.msg)
                            return;
                        }
                        if (res.data.data && res.data.data.story) {
                            let currentStory = {
                                photo: {
                                    url: res.data.data.story
                                }
                            }
                            this.$store.commit("story/setStory", currentStory)
                        }
                        let data = res.data.data;
                        localStorage.setItem('token', data.token);
                        let stProfile = studentProfileData.studentProfileData
                        stProfile._id = data._id
                        stProfile.first_name = data.first_name
                        stProfile.gender = data.gender
                        stProfile.grade_id = data.grade_id ? data.grade_id : ""
                        stProfile.group_type = data.group_type ? data.group_type : ""
                        stProfile.is_login = data.is_login ? data.is_login : ""
                        stProfile.last_name = data.last_name ? data.last_name : ""
                        stProfile.my_cart = data.my_cart ? data.my_cart : ""
                        stProfile.phone = data.phone ? data.phone : ""
                        stProfile['photo'] = data.photo ? data.photo : ""
                        stProfile.photo_cover = data.photo_cover ? data.photo_cover : ""

                        if(data.pin){
                            localStorage.setItem('pin', data.pin);
                        }

                        if(data.is_merchant){
                            localStorage.setItem('isMerchant', data.is_merchant)
                            this.$store.commit("auth/checkIsMerchant", 1)
                        }else{
                            this.$store.commit("auth/checkIsMerchant", 0)
                        }

                        if (data.province) {
                            stProfile.province = data.province
                        } else {
                            stProfile.province = {
                                _id: "",
                                name: "E-School"
                            }
                        }
                        if (data.school) {
                            stProfile.school = data.school
                        } else {
                            stProfile.school = {
                                _id: "",
                                name: "E-School"
                            }
                        }
                        localStorage.setItem('stProfile', JSON.stringify(stProfile));
                        this.getStudentProfile(stProfile)
                        this.getToken(data.token)
                        this.$store.commit('auth/receivingToken', data.token)
                        this.$store.commit("setting/toggleSidebar", false)
                        this.$router.push({
                            name: "home"
                        })
                    }).catch(err => {
                        helper.errorMessage(err.res.data.msg)
                    });

                    return;
                }

                if (!this.auth.phone) {
                    helper.errorMessage('please_enter_phone_number')
                    this.$refs.phone.focus()
                    return;
                }

                if (!this.auth.password) {
                    helper.errorMessage('please_enter_password')
                    this.$refs.password.focus()

                }
            }
        },
        mounted() {
            this.$refs.phone.focus()
        }
    }
</script>