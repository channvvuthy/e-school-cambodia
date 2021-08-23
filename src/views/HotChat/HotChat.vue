<template>
    <div class="h-screen">
        <eHeader :title="`1128`"></eHeader>
        <div :class="darkMode?`bg-youtube text-gray-300`:`bg-img-primary`" class="rounded-xl bg-repeat m-5 h-full flex flex-col">
            <div class="flex items-center px-5 py-3 rounded-t-xl e-shadow" :class="darkMode?`bg-secondary`:`bg-white`">
                <div class="rounded-full h-16 w-16 bg-gray-300 bg-cover bg-no-repeat" 
                style="background-image:url('e-school-logo.png');background-size:70% 70%;background-position:center center"></div>
                <div class="flex flex-col ml-3">
                    <div>
                        {{$t('eschool')}}
                    </div>
                    <div class="text-xs" :class="darkMode?``:`text-gray-400`">{{$t('official_page')}}</div>
                </div>
            </div>
            <div class="px-5 flex-1 h-screen">
                <div class="flex items-center justify-center w-full my-5">
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`">
                        <div class="mr-3">
                            <MessagerIcon></MessagerIcon>
                        </div>
                        <div>
                            Messager
                        </div>
                    </div>
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`">
                        <div class="mr-3">
                            <TelegramIcon></TelegramIcon>
                        </div>
                        <div>
                            Telegram
                        </div>
                    </div>
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`">
                        <div class="mr-3">
                            <VideoIcon></VideoIcon>
                        </div>
                        <div>
                            Video
                        </div>
                    </div>
                </div>
                <div class="mt-10 h-full overflow-y-scroll pb-40" style="position:relative;z-index:1">
                    <!-- User -->
                    <ul>
                        <li v-for="(message, index) in messages" :key="index">
                            {{message}}
                        </li>
                    </ul>
                    <!-- Owner -->
                </div>
            </div>
            <div class="h-40 flex items-center mb-32 px-5" :class="darkMode?`bg-secondary`:`bg-white e-shadow`" style="position:relative;z-index:10">
                <div class="cursor-pointer">
                    <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                </div>
                <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                <div class="w-14 flex justify-end">
                    <div class="cursor-pointer  rounded-full ml-5 mt-2">
                        <vue-record-audio @result="onResult" @stream="onStream"/>
                    </div>
                </div>
            </div>
        </div>
        <!-- Register if no account -->
        <div class="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-90" v-if="isInfo">
            <div class="w-96 rounded-md text-sm" :class="darkMode?`bg-secondary text-gray-400`:`bg-white e-shadow`">
                <div class="h-14 px-4 flex items-center justify-between">
                    <div class="text-lg flext-1 text-center w-full">
                        {{$t('please_enter_your_info')}}
                    </div>
                    <div class="cursor-pointer" @click="() => {this.isInfo = false}">
                        <CloseIcon :width="20" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                    </div>
                </div>
                <div class="border-t" :class="darkMode?`border-youtube`:``"></div>
                <div class="px-5 mt-4">
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        ref="firstName"
                         v-model="user.first_name" :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2013')">
                    </div>
                    <div class="h-3"></div>
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        ref="lastName"
                         v-model="user.last_name"  :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2014')">
                    </div>
                    <div class="h-3"></div>
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        @keypress="isNumber($event)" 
                        ref="phone"
                         v-model="user.phone" :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2009')">
                    </div>
                    <div class="h-4"></div>
                    <div class="flex justify-end items-center">
                        <button class="focus:outline-none bg-primary px-14 h-12 rounded-md relative" :disabled="loading" @click="onSubmit">
                            <div class="absoloute" v-if="loading">
                                <div class="loader -mt-7"></div>
                            </div>
                             <span v-else>{{$t('submit')}}</span>
                        </button>
                    </div>
                     <div class="h-4"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue"
import eHeader from "../Video/components/Header.vue"
import MessagerIcon from "./components/MessagerIcon.vue"
import TelegramIcon from "./components/TelegramIcon.vue"
import ImageIcon from "./../Chat/components/LinkIcon.vue"
import ChevronIcon from "./components/ChevronIcon.vue"
import VideoIcon from "./components/VideoIcon.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import {mapState,mapActions} from "vuex"
import helper from "./../../helper/helper"
import config from "./../../config"
import VueRecord from '@codekraft-studio/vue-record'
Vue.use(VueRecord)
export default {
    components:{
        eHeader,
        MessagerIcon,
        TelegramIcon,
        VideoIcon,
        ImageIcon,
        ChevronIcon,
        CloseIcon
    },
    data(){
        return{
            auth: "",
            isInfo: false,
            loading: false,
            password: "",
            user:{
                first_name: "",
                last_name: "",
                phone: "",
                app_version: "",
                device_os: "",
                device_name:"",
                device_id:""
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('etalk', ['messages'])
    },
    methods:{
        ...mapActions('etalk', ['getMessage', 'hotChat']),
        ...mapActions('auth', ['getStudentProfile', 'getToken']),
        isNumber(evt){
            return helper.isNumber(evt)
        },
        onStream(){

        },
        onResult(){

        },
        onSubmit(){
            if(!this.user.first_name.trim()){
                helper.errorMessage('please_enter_first_name')
                this.$refs.firstName.focus()
                return;
            }
            if(!this.user.last_name.trim()){
                helper.errorMessage('please_enter_last_name')
                this.$refs.lastName.focus()
                return;
            }
            if(!this.user.phone.trim()){
                helper.errorMessage('please_enter_phone_number')
                this.$refs.phone.focus()
                return;
            }
            this.user.device_id = helper.deviceId
            this.user.device_os = helper.deviceOs
            this.user.device_name = helper.deviceName
            this.user.app_version = config.appVersion
            this.loading = true
            this.hotChat(this.user).then(response =>{
                this.loading = false
                if(response.data.msg != undefined){
                    if(response.data.msg == 4105){
                        this.$router.push('/login')
                    }else{
                        helper.errorMessage(response.data.msg)
                        return;
                    }
                }else{
                    this.isInfo = false
                    localStorage.setItem('stProfile', JSON.stringify(response.data.data.user));
                    this.getStudentProfile(response.data.data.user)
                    this.getToken(response.data.data.user.token)
                    this.$store.commit('auth/receivingToken', response.data.data.user.token)
                    this.$store.commit("setting/toggleSidebar", false)
                    localStorage.setItem('token', response.data.data.user.token)
                    this.$store.commit('etalk/getMessage',response.data.data)
                   
                }               
            })
        },
        chat(){
            if(!this.auth){
                this.isInfo = true
            }else{
                this.$router.push('chat')
            }
        }
    },
    mounted(){
        if(this.auth){
            let payload = {
                p: 1,
                id: this.stProfile._id,
                type: 0
            }
            this.getMessage(payload)
        }else{
            this.isInfo = true
        }
    },
    created(){
        if(localStorage.getItem('token') != undefined && localStorage.getItem('token') != null){
            this.auth = localStorage.getItem('token')
        }
        
    }
}
</script>
<style>
    .vue-audio-recorder {
        background-color: #00a0e4 !important;;
        width: 55px !important;
        height: 55px !important;
    }

    .vue-audio-recorder:hover {
        background-color: #0f3c7a !important;
    }  
</style>