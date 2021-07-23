<template>
    <div class="fixed w-full h-full left-0 top-0 flex justify-center items-center" :class="darkMode?`bg-youtube`:`bg-white`">
        <div class="flex-col rounded-3xl w-100 p-6 shadow-2xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex justify-between items-center">
                <div class="transform rotate-90 cursor-pointer" @click="()=>{$router.go(-1)}">
                    <ChevronIcon :fill="darkMode?`#D1D5DB`:`#000000`"></ChevronIcon>
                </div>
            </div>
            <div class="h-10"></div>
            <div class="flex justify-center text-base font-semibold">
                {{$t('new_password')}}
            </div>
            <div class="h-5"></div>
            <div class="h-5"></div>
            <form class="flex-col text-sm font-khmer_os w-full">
                <div class="relative">
                    <input type="password" :placeholder="$t('old_password')" autocomplete="off" v-model="payload.old_password"
                        ref="old_password"
                        :class="darkMode?`pl-3 caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border border-youtube`:`border border-solid border-1 border-gray-400 border-t-0 border-r-0 border-l-0`" 
                        class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4"/>
                </div>
                <div class="relative">
                    
                    <input type="password" :placeholder="$t('new_password')" autocomplete="off" v-model="payload.password"
                        ref="password"
                        :class="darkMode?`pl-3 caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border border-youtube`:`border border-solid border-1 border-gray-400 border-t-0 border-r-0 border-l-0`" 
                        class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4"/>
                </div>
                <div class="relative">
                    <input type="password" :placeholder="$t('2017')" autocomplete="off" v-model="payload.confirm_password"
                        ref="confirmPassword"
                        :class="darkMode?`pl-3 caret-white text-gray-300 rounded-md bg-black  bg-opacity-40 border border-youtube`:`border border-solid border-1 border-gray-400 border-t-0 border-r-0 border-l-0`" 
                        class="py-3 placeholder-gray-500 w-full focus:outline-none mb-4"/>
                </div>
            </form>
            <button class="relative focus:outline-none p-3 mt-4 text-center text-white rounded-lg h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os" :class="darkMode?`bg-button`:`bg-primary`" @click="modifyPassword" :disabled="loadingRegister" v-if="!showReset">
                <span v-if="!loadingRegister">{{$t('set_password')}}</span>
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
                    confirm_password: null,
                    old_password: null
                }
            }
        },
        computed: {
            ...mapState('auth', ['loadingRegister']),
            ...mapState('setting', ['darkMode'])
        },
        mounted(){
            this.$refs.old_password.focus()
            this.payload.device_id = helper.deviceId()
            this.payload.device_os = helper.deviceOs()
            this.payload.device_name = helper.deviceName()
            this.payload.app_version = process.env.VUE_APP_VERSION
        },
        methods: {
            ...mapActions('auth', ['userChangePassword','changeForgotPassword','getToken']),
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
                if(!this.payload.old_password){
                    helper.errorMessage('please_enter_old_password')
                    this.$refs.forgetPassword.focus()
                    return false
                }

                if (!this.payload.password) {
                    helper.errorMessage('please_enter_password')
                    this.$refs.forgetPassword.focus()
                    return false
                }
                if (this.payload.confirm_password != this.payload.password) {
                    helper.errorMessage('4104')
                    this.$refs.confirmPassword.focus()
                    return false
                }
                
                this.resetingPassword = true

                this.userChangePassword(this.payload).then(response =>{
                    if(response.status && response.status === 1){
                        helper.errorMessage(response.msg)
                    }else{
                        helper.success('password_updated')
                        this.$router.go(-1)

                    }
                })
            }
        }
    }
</script>
