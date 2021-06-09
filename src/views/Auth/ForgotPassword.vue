<template>
    <div class="flex justify-center items-center min-h-screen" :class="darkMode?`bg-youtube`:`bg-white`">
        <div class="flex-col rounded-3xl w-96 p-6 shadow-2xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex justify-between items-center">
                <div class="transform rotate-90 cursor-pointer" @click="()=>{$router.go(-1)}">
                    <ChevronIcon :fill="darkMode?`#D1D5DB`:`#000000`"></ChevronIcon>
                </div>
            </div>
            <div class="h-10"></div>
            <div class="flex justify-center text-base font-semibold">
                {{$t('2011')}}
            </div>
            <div class="h-5"></div>
            <div class="text-center text-gray-600 px-11 text-sm">
               <span v-if="!showReset">{{$t('reset_password_des')}}</span>
               <span v-else> {{$t('reset_password')}}</span>
            </div>
            <div class="h-5"></div>
            <form class="flex-col text-sm font-khmer_os w-full">
                <div class="relative" v-if="!showReset">
                    <span class="absolute mt-3 text-sm font-medium opacity-40" :class="darkMode?`left-2`:`left-0`">
                        <PhoneIcon size="22" :fill="darkMode?`#e4e7eb`:`#000000`"></PhoneIcon>
                    </span>
                    <input type="text" :placeholder="$t('2009')" v-model="phone" @keypress="isNumber($event)" 
                    ref="forgetPassword"
                    :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black bg-opacity-40 border border-youtube`:`border-b border-solid  border-gray-500`" 
                    class="h-10 placeholder-gray-500 p-2 px-0 w-full focus:outline-none mb-4 pl-8"/>
                </div>
                <template v-if="showReset">
                    <div class="relative">
                        <span class="absolute mt-2 text-sm font-medium opacity-40" :class="darkMode?`left-2`:`left-0`">
                        <lock-icon :fill="darkMode?`#e4e7eb`:`#000000`"></lock-icon>
                        </span>
                        <input type="password" :placeholder="$t('2010')" autocomplete="off" v-model="payload.password"
                            ref="password"
                            :class="darkMode?`caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border border-youtube`:`border border-solid border-1 border-gray-400 border-t-0 border-r-0 border-l-0`" 
                            class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4 pl-10"/>
                    </div>
                    <div class="relative">
                            <span class="absolute mt-2 text-sm font-medium opacity-40" :class="darkMode?`left-2`:`left-0`">
                            <lock-icon :fill="darkMode?`#e4e7eb`:`#000000`"></lock-icon>
                        </span>
                        <input type="password" :placeholder="$t('2017')" autocomplete="off" v-model="payload.confirm_password"
                            ref="confirmPassword"
                            :class="darkMode?`caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border border-youtube`:`border border-solid border-1 border-gray-400 border-t-0 border-r-0 border-l-0`" 
                            class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4 pl-10"/>
                    </div>
                </template>
            </form>
            <button class="relative focus:outline-none p-3 mt-4 text-center text-white rounded-lg h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os" :class="darkMode?`bg-button`:`bg-primary`" @click="checkPhoneNumber" :disabled="loadingRegister" v-if="!showReset">
                <span v-if="!loadingRegister">{{$t('2007')}}</span>
                <div class="absolute flex justify-center items-center -top-2 w-full" v-else>
                    <div class="loader"></div>
                </div>
            </button>

            <button class="relative focus:outline-none p-3 mt-4 justify-center items-center text-white rounded-lg h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os" :class="darkMode?`bg-button`:`bg-primary`" @click="modifyPassword" :disabled="resetingPassword" v-else>
                <span v-if="!resetingPassword">{{$t('1122')}}</span>
                <div class="absolute flex justify-center items-center -top-2 w-full" v-else>
                    <div class="loader"></div>
                </div>
            </button>
        </div>
        <ErrMessage v-if="err" :message="message" @closeErr="closeErr"></ErrMessage>

    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import ErrMessage from "./components/ErrMessage"
    import helper from "./../../helper/helper"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import PhoneIcon from "./../../components/PhoneIcon.vue"
    import LockIcon from "./../../components/LockIcon.vue"
    import axios from "axios"

    export default{
        name: "Create",
        components: {
            ErrMessage,
            PhoneIcon,
            ChevronIcon,
            LockIcon
        },
        data(){
            return {
                err: false,
                message: null,
                phone:null,
                showReset: false,
                resetingPassword: false,
                payload: {
                    password: null,
                    confirm_password: null
                }
            }
        },
        computed: {
            ...mapState('auth', ['loadingRegister']),
            ...mapState('setting', ['darkMode'])
        },
        mounted(){
            this.$refs.forgetPassword.focus()
            this.payload.device_id = helper.deviceId()
            this.payload.device_os = helper.deviceOs()
            this.payload.device_name = helper.deviceName()
            this.payload.app_version = process.env.VUE_APP_VERSION
        },
        methods: {
            ...mapActions('auth', ['checkPhoneExist', 'changeForgotPassword','getToken']),
            checkPhoneNumber(){
                if (!this.phone) {
                    helper.errorMessage('please_enter_phone_number')
                    this.$refs.forgetPassword.focus()
                    return false
                }
                
                this.payload.phone = this.phone
            
                this.checkPhoneExist(this.payload).then(response=>{
                    if(response.status === 1 || response.status === 2){
                        helper.errorMessage(response.msg)
                    }else{
                        this.showReset = true                    
                        axios.interceptors.request.use(
                            (config) => {
                                config.headers['xtoken'] = response.data.token
                                return config;
                            },

                            (error) => {
                                return Promise.reject(error);
                            }
                        );

                    }
                })
            },
            isNumber(evt){
                return helper.isNumber(evt)
            },
            closeErr(){
                this.err = false
            },
            storeUserData(data){
                localStorage.setItem('token', data.token)
                this.$store.commit('auth/studentProfile',data)
                this.getToken(data.token)
                this.$store.commit('auth/receivingToken', data.token)
                this.$store.commit("setting/toggleSidebar", false)
                this.$router.push({
                    name: "home"
                })
            },
            modifyPassword(){
                if (!this.payload.password) {
                    helper.errorMessage('please_enter_phone_number')
                    this.$refs.forgetPassword.focus()
                    return false
                }
                if (this.payload.confirm_password != this.payload.password) {
                    helper.errorMessage('4104')
                    this.$refs.confirmPassword.focus()
                    return false
                }
                
                this.resetingPassword = true

                this.changeForgotPassword(this.payload).then(result =>{
                    let data = result.data
                    let stProfile = data

                    localStorage.setItem('stProfile', JSON.stringify(stProfile));
                    this.storeUserData(data)

                })
            }
        }
    }
</script>