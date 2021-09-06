<template>
    <div class="flex flex-col justify-between h-screen">
        <div class="flex justify-center items-center h-full flex-1" :class="darkMode?`bg-youtube text-gray-300`:`bg-white`">
            <div class="flex-col rounded-3xl w-100 p-6 e-shadow" :class="darkMode?`bg-secondary`:``">
                <div class="flex justify-between items-center">
                    <div class="transform rotate-90 cursor-pointer" @click="()=>{$router.go(-1)}">
                        <ChevronIcon :fill="darkMode?`#e4e7eb`:`#000000`"></ChevronIcon>
                    </div>
                    <div class="flex-1 text-center text-md">
                        {{$t('2008')}}
                    </div>
                </div>
                <div class="h-12"></div>
                <form class="flex-col text-sm font-khmer_os">
                    <div class="relative">
                        <div class="opacity-50 absolute top-3" :class="darkMode?`left-2`:`left-0`">
                        <UserIcon :fill="darkMode?`#e4e7eb`:`#000000`" :size="20"></UserIcon>
                        </div>
                        <input
                                type="text"
                                ref="first_name"
                                :placeholder="$t('2013')"
                                :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b border-borderGray`"
                                class="p-2 w-full focus:outline-none mb-4 pl-8 h-12 placeholder-gray-500"
                                v-model="studentInfo.first_name"
                        />
                    </div>
                    <div class="relative">
                        <div class="opacity-50 absolute top-3" :class="darkMode?`left-2`:`left-0`">
                            <UserIcon :fill="darkMode?`#e4e7eb`:`#000000`" :size="20"></UserIcon>
                        </div>
                        <input
                                type="text"
                                ref="last_name"
                                :placeholder="$t('2014')"
                                :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b border-borderGray`"

                                class="p-2 w-full focus:outline-none mb-4 pl-8 h-12 placeholder-gray-500"
                                v-model="studentInfo.last_name"
                        />
                    </div>
                </form>
                <div class="flex justify-start mt-3 items-center text-sm font-khmer_os">
                    <label class="flex mr-10">
                        <div @click="setGender('male')"
                            class="mr-4 flex justify-center items-center border border-borderGray w-4 h-4 rounded-full">
                            <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.gender==='M'"></div>
                        </div>
                        <input type="radio" class="mr-2 hidden" name="gender" value="M" v-model="studentInfo.gender"
                            ref="male"/>
                        <span>{{$t('2015')}}</span>
                    </label>
                    <label class="flex">
                        <div @click="setGender('female')"
                            class="mr-4 flex justify-center items-center border border-borderGray w-4 h-4 rounded-full">
                            <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.gender==='F'"></div>
                        </div>
                        <input type="radio" class="mr-2 hidden" name="gender" value="F" v-model="studentInfo.gender"
                            ref="female"/>
                        <span>{{$t('2016')}}</span>
                    </label>
                </div>
                <div class="h-5"></div>
                <form class="flex-col text-sm font-khmer_os w-full">
                    <div class="relative">
                        <span class="absolute mt-3 text-sm font-medium opacity-40" :class="darkMode?`left-2`:`left-0`">
                            <PhoneIcon size="20" :fill="darkMode?`#e4e7eb`:`#000000`"></PhoneIcon>
                        </span>
                        <input type="text" :placeholder="$t('2009')"
                            ref="phone"
                            v-model="studentInfo.phone"
                            @keypress="isNumber($event)"
                                :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b   border-borderGray`"

                            class="h-12 placeholder-gray-500 p-2 w-full focus:outline-none mb-4 pl-8"/>
                    </div>
                    <div class="relative">
                        <span class="absolute mt-3 text-sm font-medium opacity-50" :class="darkMode?`left-2`:`left-0`">
                                <lock-icon :size="20" :fill="darkMode?`#e4e7eb`:`#000000`"></lock-icon>
                            </span>
                        <input type="password" :placeholder="$t('2010')"
                            v-model="studentInfo.password"
                            ref="password"
                                :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b   border-borderGray`"

                            class="h-12 placeholder-gray-500 p-2 px-0 w-full focus:outline-none mb-4 pl-8"/>

                    </div>
                    <div class="relative">
                        <span class="absolute mt-3 text-sm font-medium opacity-50" :class="darkMode?`left-2`:`left-0`">
                                <lock-icon :size="20" :fill="darkMode?`#e4e7eb`:`#000000`"></lock-icon>
                            </span>
                        <input type="password" :placeholder="$t('2017')"
                            ref="confirm_password"
                            v-model="studentInfo.confirm_password"
                                :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b   border-borderGray`"
                            class="h-12 placeholder-gray-500 p-2 px-0  w-full focus:outline-none mb-4 pl-8"/>
                    </div>
                </form>
                <div class="flex justify-start items-center mt-4">
                    <label class="flex text-sm">
                        <div @click="()=>{studentInfo.accepted_term=true}"
                            class="mr-4 flex justify-center items-center border border-borderGray w-4 h-4 rounded-full">
                            <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.accepted_term"></div>
                        </div>
                        <input type="radio" class="mr-3 cursor-pointer hidden" v-model="studentInfo.accepted_term"
                            :checked="studentInfo.accepted_term"
                            value="1"
                            name="term"
                        >
                        <div class="flex"><span class="pr-1">{{$t('2018')}}</span><span
                                class="cursor-pointer"
                                :class="darkMode?`text-gray-300 underline`:`text-blue-700`"
                                @click="showTermAndCondition">{{$t('2019')}}</span>
                        </div>
                    </label>
                </div>
                <div class="h-5"></div>
                <button class="focus:outline-none p-3 mt-4 text-center relative text-white rounded-lg h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os"
                        @click="createAccount" :disabled="loadingRegister"
                        :class="darkMode?`bg-button`:`bg-primary`"
                        >
                    
                    <div class="absolute flex justify-center items-center w-full left-0 -top-3 " v-if="loadingRegister">
                        <div class="loader"></div>
                    </div>
                    <span v-else>{{$t('2008')}}</span>
                </button>
                <ErrMessage v-if="err" :message="message" @closeErr="closeErr"></ErrMessage>
                <TermAndCondition v-if="showTerm" @closeTermAndCondition="closeTermAndCondition"></TermAndCondition>
            </div>
        </div>
       <img src="e-footer.png" class="w-full" v-if="!darkMode">
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import ErrMessage from "./components/ErrMessage"
    import Loader from "./../../components/Loader"
    import helper from "./../../helper/helper"
    import TermAndCondition from "./components/TermAndCondition.vue"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import PhoneIcon from "./../../components/PhoneIcon.vue"
    import UserIcon from "./../../components/ProfileIcon.vue"
    import Vue from 'vue';
    import VueToast from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    Vue.use(VueToast);
    import config from "./../../config"
    import LockIcon from '../../components/LockIcon.vue'
    export default{
        name: "Create",
        components: {
            ErrMessage,
            PhoneIcon,
            ChevronIcon,
            Loader,
            TermAndCondition,
            UserIcon,
                LockIcon
        },
        data(){
            return {
                err: false,
                message: null,
                showTerm: false,
                studentInfo: {
                    first_name: null,
                    last_name: null,
                    phone: null,
                    password: null,
                    confirm_password: null,
                    gender: null,
                    device_id: null,
                    device_name: null,
                    device_os: null,
                    player_id: null,
                    app_version: config.appVersion,
                    accepted_term: false
                }
            }
        },
        computed: {
            ...mapState('auth', ['loadingRegister']),
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            ...mapActions('auth', ['register']),

            closeTermAndCondition(){
                this.showTerm = false
            },

            showTermAndCondition(){
                this.showTerm = true
            },

            closeErr(){
                this.err = false
            },

            isNumber(evt){
                return helper.isNumber(evt)
            },
            setGender(gender){
                if (gender === 'male') {
                    this.$refs.male.click()
                } else {
                    this.$refs.female.click()
                }

            },

            createAccount(){
                let device_id = helper.deviceId()
                this.studentInfo.device_id = device_id
                let platform = helper.deviceOs()
                this.studentInfo.device_os = platform

                if (!this.studentInfo.first_name) {
                    helper.errorMessage('please_enter_first_name');
                    this.$refs.first_name.focus();
                    return false
                }

                if (!this.studentInfo.last_name) {
                    helper.errorMessage('please_enter_last_name');
                    this.$refs.last_name.focus();
                    return false
                }

                if (!this.studentInfo.gender) {
                    helper.errorMessage('please_select_gender')
                    return false
                }

                if (!this.studentInfo.phone) {
                    helper.errorMessage('please_enter_phone_number')
                    this.$refs.phone.focus();
                    return false
                }

                if (!this.studentInfo.password) {
                    helper.errorMessage('please_enter_password');
                    this.$refs.password.focus();
                    return false
                }

                if (!this.studentInfo.confirm_password) {
                    helper.errorMessage('please_enter_confirm_password')
                    this.$refs.confirm_password.focus();
                    return false
                }


                if (this.studentInfo.confirm_password !== this.studentInfo.password) {
                    helper.errorMessage('confirm_password_no_match')
                    this.$refs.confirm_password.focus();
                    return false
                }
                if (!this.studentInfo.accepted_term) {
                    helper.errorMessage('please_check_term_and_condition')
                    return false
                }

                this.register(this.studentInfo).then(response => {
                    if (response.msg != undefined) {
                        helper.errorMessage(response.msg)
                        return false
                    } else {
                        Vue.$toast.success(this.$i18n.t('account_created'), {
                            position: "top-right"
                        })
                        this.$router.push({name: 'login'});
                    }
                }).catch(err => {
                    this.message = err
                    this.err = true
                })


            }
        }
    }
</script>
<style lang="scss">
    .swal2-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px;
    }
    @keyframes load7 {
        0%,80%,100% {
            box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
            box-shadow: 0 2.5em 0 0;
        }
    }
    .loader {
        border-radius: 50%;
        width: 1em;
        height: 1em;
        animation: load7 1s infinite ease-in-out;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        transform: translateZ(0);
        animation-delay: -0.16s;
        &:before {
            border-radius: 50%;
            width: 1em;
            height: 1em;
            animation: load7 1s infinite ease-in-out;
            content: '';
            position: absolute;
            top: 0;
            left: -2.5em;
            animation-delay: -0.32s;
        }
        &:after {
            border-radius: 50%;
            width: 1em;
            height: 1em;
            animation: load7 1s infinite ease-in-out;
            content: '';
            position: absolute;
            top: 0;
            left: 2.5em;
        }
    }
</style>