<template>
    <div class="flex justify-center items-center min-h-screen bg-white">
        <div class="flex-col rounded-3xl w-96 p-6 shadow-2xl bg-white">
            <div class="flex flex-col justify-center items-center">
                <div class="border border-primary w-20 h-20 leading-20 flex justify-center items-center rounded-full">
                    <img src="/e-school-logo.png" class="w-12"/>
                </div>
            </div>
            <div class="mt-10">
                <form class="flex-col text-sm font-khmer_os" v-if="tap == 'login'">
                    <div class="relative">
                        <span class="absolute left-0 mt-2 text-sm font-medium opacity-30">
                            <PhoneIcon></PhoneIcon>
                        </span>
                        <input type="text" :placeholder="$t('2009')" v-model="auth.phone" @keypress="isNumber($event)"
                               ref="phone"
                               class="py-3 placeholder-gray-500 border border-solid border-1 border-gray-400 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-10"/>
                    </div>
                    <div class="h-5"></div>
                    <div class="relative">
                         <span class="absolute left-0 mt-2 text-sm font-medium opacity-50">
                            <img src="/icon/icon/lock.png">
                        </span>
                        <input type="password" :placeholder="$t('2010')" autocomplete="off" v-model="auth.password"
                               v-on:keyup.enter="studentLogin"
                               ref="password"
                               class="py-3 placeholder-gray-500 border border-solid border-1 border-gray-400 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-10"/>
                    </div>
                    <div class="h-3"></div>
                    <div class="text-right text-gray-500 cursor-pointer mb-4" @click="goTo('forgot-password')">
                        {{$t('2011')}}?
                    </div>
                    <div class="h-3"></div>
                </form>

                <div class="bg-primary h-11 p-3 text-center flex justify-center items-center text-white rounded-lg w-full text-sm outline-none text-sm cursor-pointer font-khmer_os"
                     @click="studentLogin" :disabled="loginLoading" :class="loginLoading?'bg-opacity-70':''">
                    <div class="pl-2">
                        <span v-if="!loginLoading">{{$t('2007')}}</span>
                        <span v-else>{{$t('2007')}} &nbsp;<Loader :size="10"/></span>
                    </div>
                </div>
                <div class="h-10"></div>
                <div class="flex justify-end text-sm">
                    <div class="text-gray-500 mr-3">{{$t('2012')}}</div>
                    <div class="text-primary underline cursor-pointer" @click="goTo('register')">{{$t('2008')}}</div>
                </div>
            </div>
        </div>
        <template>
            <Message v-if="errorMessage" :message="errorMessage" @closeMessage="closeMessage"></Message>
        </template>
    </div>
</template>

<script>
    import Loader from "./../../components/Loader"
    import Message from "./components/Message"
    import helper from "./../../helper/helper"
    import {mapActions, mapState} from "vuex"
    import config from "./../../config"
    import studentProfileData from "./../../data/student"
    import PhoneIcon from "./../../components/PhoneIcon.vue"

    export default{
        components: {
            Loader,
            PhoneIcon,
            Message
        },
        data(){
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
        },
        methods: {
            ...mapActions('auth', ['login', 'getStudentProfile', 'getToken']),

            changePasswordSuccess(){
                this.forgotPassword = false
            },
            cancel(){
                this.forgotPassword = false;
            },

            agree(){
                this.forgotPassword = false;
            },

            closeMessage(){
                this.errorMessage = null;
            },

            isNumber(evt){
                return helper.isNumber(evt)
            },
            goTo(page){
                this.$router.push({name: page})
            },
            studentLogin(){
                if (this.loginLoading) {
                    return
                }

                if (this.auth.phone && this.auth.password) {
                    this.login(this.auth).then(response => {

                        if (response.data.status !== 0) {
                            helper.errorMessage(response.data.msg)
                            return;
                        }
                        let data = response.data.data;
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
                        stProfile.photo = data.photo ? data.photo : ""

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
                    return;
                }
            }
        }
    }
</script>