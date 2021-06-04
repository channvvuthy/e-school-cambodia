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
                {{$t('reset_password_des')}}
            </div>
            <div class="h-5"></div>
            <form class="flex-col text-sm font-khmer_os w-full">
                <div class="relative">
                    <span class="absolute mt-3 text-sm font-medium opacity-40" :class="darkMode?`left-2`:`left-0`">
                        <PhoneIcon size="22" :fill="darkMode?`#e4e7eb`:`#000000`"></PhoneIcon>
                    </span>
                    <input type="text" :placeholder="$t('2009')"
                           v-model="phone"
                           @keypress="isNumber($event)"
                            :class="darkMode?`h-12  caret-white text-gray-300 rounded-md bg-black border border-button`:`border-b border-solid  border-gray-500`"
                           class="h-10 placeholder-gray-500 p-2 px-0 w-full focus:outline-none mb-4 pl-8"/>
                </div>
            </form>
            <button class="focus:outline-none p-3 mt-4 text-center text-white rounded-lg h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os"
            :class="darkMode?`bg-button`:`bg-primary`"
                    @click="checkPhoneNumber" :disabled="loadingRegister">
                {{$t('2007')}}
                <Loader v-if="loadingRegister" :size="10"></Loader>
            </button>
        </div>
        <ErrMessage v-if="err" :message="message" @closeErr="closeErr"></ErrMessage>

    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import ErrMessage from "./components/ErrMessage"
    import Loader from "./../../components/Loader"
    import helper from "./../../helper/helper"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import PhoneIcon from "./../../components/PhoneIcon.vue"
import { platform } from 'os'
import playVideo from '../../store/playVideo'
    export default{
        name: "Create",
        components: {
            ErrMessage,
            PhoneIcon,
            ChevronIcon,
            Loader
        },
        data(){
            return {
                err: false,
                message: null,
                phone:null
            }
        },
        computed: {
            ...mapState('auth', ['loadingRegister']),
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            ...mapActions('auth', ['checkPhoneExist']),
            checkPhoneNumber(){
                if (!this.phone) {
                    helper.errorMessage('please_enter_phone_number')
                    return false
                }
                let payload = {}
                payload.phone = this.phone
                payload.device_id = helper.deviceId()
                payload.device_os = helper.deviceOs()
                payload.device_name = helper.deviceName()
                payload.app_version = process.env.VUE_APP_VERSION
                this.checkPhoneExist(payload).then(response=>{
                    if(response.status === 1){
                        helper.errorMessage(response.msg)
                    }
                })
            },
            isNumber(evt){
                return helper.isNumber(evt)
            },
            closeErr(){
                this.err = false
            },
        }
    }
</script>