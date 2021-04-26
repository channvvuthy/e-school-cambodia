<template>
    <div class="flex justify-center items-center min-h-screen bg-white">
        <div class="flex-col rounded-3xl w-96 p-6 shadow-2xl bg-white">
            <div class="flex justify-between items-center">
                <div class="transform rotate-90 cursor-pointer" @click="()=>{$router.go(-1)}">
                    <ChevronIcon></ChevronIcon>
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
                    <span class="absolute left-0 mt-2 text-sm font-medium opacity-40">
                        <PhoneIcon size="22"></PhoneIcon>
                    </span>
                    <input type="text" :placeholder="$t('2009')"
                           v-model="phone"
                           @keypress="isNumber($event)"
                           class="h-10 placeholder-gray-500 p-2 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8"/>
                </div>
            </form>
            <button class="focus:outline-none p-3 mt-4 text-center text-white rounded-lg bg-primary h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os"
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

    import config from "./../../config"
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
            ...mapState('auth', ['loadingRegister'])
        },
        methods: {
            ...mapActions('auth', ['checkPhoneExist']),
            checkPhoneNumber(){
                if (!this.phone) {
                    this.message = "please_enter_phone_number"
                    this.err = true
                    return false
                }
                this.checkPhoneExist(this.phone).then(response=>{
                    console.log(response)
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