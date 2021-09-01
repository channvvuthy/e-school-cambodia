<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1127')}}
        </div>
        <div class="px-3 my-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('hot-chat')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `hot-chat`?`bg-byline`:`bg-button`}`:`${$route.name === `hot-chat`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <ChatIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `hot-chat`"></ChatIcon>
                            <ChatIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></ChatIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1128')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('policy')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `policy`?`bg-byline`:`bg-button`}`:`${$route.name === `policy`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <PolicyIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `policy`"></PolicyIcon>
                            <PolicyIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></PolicyIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1129')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center"  @click="goTo('help')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `help`?`bg-byline`:`bg-button`}`:`${$route.name === `help`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <HelpIcon :fill="darkMode?`#212121`:`#FFFFFF`"  v-if="$route.name === `help`"></HelpIcon>
                            <HelpIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></HelpIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1130')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('about')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `about`?`bg-byline`:`bg-button`}`:`${$route.name === `about`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <AboutIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `about`"></AboutIcon>
                            <AboutIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></AboutIcon>

                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1131')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="shareApp">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md`">
                        <div><ShareIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ShareIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1132')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="setDarkMode(darkMode)">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md`">
                        <div><ModeIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ModeIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{darkMode?$t('light_mode'):$t('1133')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 w-full cursor-pointer" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `"
                         @click="setLocalization(localize==='kh'?'en':'kh')">
                        <div v-if="localize==='en'"><KhIcon :fill="darkMode?`#909090`:`#0f3c7a`" ></KhIcon></div>
                        <div v-else><EnIcon :fill="darkMode?`#909090`:`#0f3c7a`" ></EnIcon></div>


                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1134')}}
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed w-full h-full left-0 top-0 flex items-center justify-center bg-black bg-opacity-95" v-if="share">
            <div class="w-80 rounded-xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <div class="flex items-center px-5 py-3 justify-between">
                    <div class="text-sm">{{$t('1132')}}</div>
                    <div class="cursor-pointer" @click="() => {this.share = false}">
                        <CloseIcon :width="24" :fill="darkMode?`#909090`:`#000`"></CloseIcon>
                    </div>
                </div>
                <div class="border-t " :class="darkMode?`border-button`:``"></div>
                <div class="flex px-5 pb-5">
                    <div class="mt-5 flex justify-center items-center">
                            <div class="cursor-pointer" @click="openLink(facebookUrl)">
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" height="45" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 112.196 112.196" style="enable-background:new 0 0 112.196 112.196" xml:space="preserve">
                                    <g>
                                        <circle style="fill:#3B5998" cx="56.098" cy="56.098" r="56.098"/>
                                        <path style="fill:#FFFFFF" d="M70.201,58.294h-10.01v36.672H45.025V58.294h-7.213V45.406h7.213v-8.34
                                            c0-5.964,2.833-15.303,15.301-15.303L71.56,21.81v12.51h-8.151c-1.337,0-3.217,0.668-3.217,3.513v7.585h11.334L70.201,58.294z"/>
                                    </g>
                                    <g/>
                                </svg>

                            </div>
                            <div class="mx-7 cursor-pointer" @click="openLink(linkedinUrl)">
                                <InIcon></InIcon>
                            </div>
                            <div @click="openLink(telegramUrl)" class="cursor-pointer">
                                <svg enable-background="new 0 0 24 24" height="45" viewBox="0 0 24 24" width="45" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" fill="#039be5" r="12"/>
                                    <path d="m5.491 11.74 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z" fill="#fff"/>
                                </svg>
                            </div>
                    </div>
                </div>
                <div class="flex px-5 mb-5 items-center relative">
                    <input type="text" class="w-full h-10 border focus:outline-none rounded-md pl-2 " v-model="link" id="link" :class="darkMode?`bg-button border-youtube`:``"/>
                    <div class="absolute right-7 cursor-pointer" @click="copyText">
                        <CopyIcon :fill="darkMode?`#909090`:`#000`"></CopyIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import ChatIcon from "./../../../components/ChatIcon"
    import PolicyIcon from "./../../../components/PolicyIcon"
    import HelpIcon from "./../../../components/HelpIcon"
    import AboutIcon from "./../../../components/AboutIcon"
    import ShareIcon from "./../../../components/ShareIcon"
    import ModeIcon from "./../../../components/ModeIcon"
    import KhIcon from "./../../../components/KhIcon.vue"
    import CloseIcon from "./../../../components/CloseIcon"
    import EnIcon from "./../../../components/EnIcon.vue"
    import FacebookIcon from "./../../../components/FacebookIcon.vue"
    import InIcon from "./../../../components/InIcon.vue"
    import CopyIcon from "./../../../components/CopyIcon.vue"
    import helper from "./../../../helper/helper"
    const {ipcRenderer} = require('electron')


    export default{
        components:{
            ChatIcon,
            PolicyIcon,
            HelpIcon,
            AboutIcon,
            ShareIcon,
            ModeIcon,
            KhIcon,
            EnIcon,
            CloseIcon,
            FacebookIcon,
            InIcon,
            CopyIcon
        },
        data(){
            return{
                share: false,
                facebookUrl:"https://www.facebook.com/sharer/sharer.php?u=https://azetech.page.link/eNh4",
                linkedinUrl: "https://www.linkedin.com/sharing/share-offsite/?url=https://azetech.page.link/eNh4",
                telegramUrl: "https://t.me/share/url?url=https://azetech.page.link/eNh4",
                link: "https://azetech.page.link/eNh4"
            }
        },
        computed: {
            ...mapState('setting', ['localize','darkMode'])
        },
        methods: {
            setLocalization(lang){
                this.$store.commit('setting/setLocalize', lang)
            },
            setDarkMode(mode){
                let darkMode = !mode
                this.$store.commit('setting/setDarkMode',darkMode)
            },
            shareApp(){
                this.share = true
            },
            goTo(page) {
                this.$router.push({ name: page }).catch((err)=>{err});
            },
            openLink(link){
                ipcRenderer.send('openLink', link)
            },
            copyText() {
                var copyText = document.getElementById("link");
                copyText.select();
                copyText.setSelectionRange(0, 99999)
                document.execCommand("copy");
                helper.success("Copied the text: " + copyText.value)
            }
        }
    }
</script>