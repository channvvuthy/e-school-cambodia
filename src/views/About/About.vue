<template>
    <div>
        <eHeader></eHeader>
        <div class="h-screen py-4 overflow-y-scroll pb-40" :class="darkMode?`bg-youtube text-gray-300`:`bg-transparent text-youtube`">
            <div class="px-5 py-1 font-khmer_os">
                <div v-if="loading" class="flex justify-center items-center h-screen relative -top-5">
                    <h1 class="text-sm font-semibold font-khmer_os relative -top-20">
                        <loading></loading>
                    </h1>
                </div>
                <div class="text-14px" v-else>
                    <div class="w-1/2">
                        <iframe :src="src" width="100%" height="270" frameborder="0" style="border:0"></iframe>
                        <div class="flex my-5 items-center">
                            <div class="mr-3">
                                <div class="h-10 w-10 bg-primary flex items-center justify-center rounded-full">
                                    <HomeIcon fill="#ffffff"></HomeIcon>
                                </div>
                            </div>
                            <div class="py-2 border-b flex-1" :class="darkMode?`border-button`:`border-gray-300`">
                                {{company.address?company.address:`អគារលេខ ១៩១ ផ្លូវទន្លេសាប សង្កាត់ជ្រោយចង្វា ខណ្ឌជ្រោយចង្វា រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា`}}
                            </div>
                        </div>
                        <div class="flex my-3">
                            <div class="mr-3">
                                <div class="h-10 w-10 bg-primary flex items-center justify-center rounded-full">
                                    <PhoneIcon></PhoneIcon>
                                </div>
                            </div>
                            <div class="py-3 border-b flex-1" :class="darkMode?`border-button`:`border-gray-300`">
                                {{company.phone?company.phone:`089 80 22 66 / 090 787 999`}}
                            </div>
                        </div>
                        <div class="flex my-3">
                            <div class="mr-3">
                                <div class="h-10 w-10 bg-primary flex items-center justify-center rounded-full">
                                    <WebIcon fill="#ffffff"></WebIcon>
                                </div>
                            </div>
                            <div class="cursor-pointer py-2  border-b flex-1"
                                @click="openLink(company.website)" :class="darkMode?`border-button`:`border-gray-300`">
                                {{company.website?company.website:`https://e-schoolcambodia.com`}}
                            </div>
                        </div>
                        <div class="flex my-2 border-b pb-3 items-center" :class="darkMode?`border-button`:`border-gray-300`">
                            <div class="mr-3 ">
                                <div class="h-10 w-10 bg-primary flex items-center justify-center rounded-full">
                                    <ShareIcon fill="#ffffff"></ShareIcon>
                                </div>
                            </div>
                            <div>{{$t('4120')}}</div>
                        </div>
                        <div class="mt-5 flex justify-center items-center">
                            <div class="mr-2 cursor-pointer" @click="openLink(facebookUrl)">
                                <FacebookIcon></FacebookIcon>
                            </div>
                            <div class="mr-3 cursor-pointer" @click="openLink(youtubeUrl)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24">
                                    <g :fill="darkMode?`#0e76a8`:`#0e76a8`">
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                                    </g>
                                </svg>
                            </div>
                            <div class="mr-3 cursor-pointer" @click="openLink(linkedinUrl)">
                                <InIcon></InIcon>
                            </div>
                            <div @click="openLink(instagramUrl)" class="cursor-pointer">
                                <InstagramIcon></InstagramIcon>
                            </div>
                        </div>
                        <div class="mt-5 flex justify-center items-center">
                            <div>Version: {{appVersion}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from "vuex"
    import HomeIcon from "./../../components/HomeIcon"
    import PhoneIcon from "./../../components/PhoneCallIcon.vue"
    import WebIcon from "./../../components/WebIcon"
    import ShareIcon from "./../../components/ShareIcon"
    import FacebookIcon from "./../../components/FacebookIcon.vue"
    import YoutubeIcon from "./../../components/YoutubeIcon.vue"
    import InIcon from "./../../components/InIcon.vue"
    import InstagramIcon from "./../../components/InstagramIcon.vue"
    const {ipcRenderer} = require('electron')
    import config from "./../../config"
    import Loading from  "./../../components/Loading"
    import eHeader from "./../Video/components/Header.vue"

    export default{
        name: "About",
        components: {
            HomeIcon,
            PhoneIcon,
            WebIcon,
            ShareIcon,
            FacebookIcon,
            YoutubeIcon,
            InIcon,
            InstagramIcon,
            Loading,
            eHeader
        },
        data(){
            return {
                loading: false,
                company: null,
                instagramUrl: "https://www.instagram.com/eschoolcambodia/?igshid=atnyxttmibf1",
                facebookUrl: "https://facebook.com/196770961113954",
                youtubeUrl: "https://www.youtube.com/channel/UCXAVs_YRUwsnx5I-Toy-7Dg",
                linkedinUrl: "https://www.linkedin.com/in/eschoolcambodia/",
                src: ""
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            appVersion(){
                return config.appVersion
            }
        },
        methods: {
            ...mapActions('setting', ['companyInfo']),
            openLink(link){
                ipcRenderer.send('openLink', link)
            }
        },
        created(){
            this.loading = true
            this.companyInfo().then(response => {
                this.loading = false
                this.company = response
                this.src = "https://maps.google.com/maps?q=" + response.latitude + "," + response.longitude + "&z=15&output=embed"
            }).catch(() => {
                this.loading = false
            })
        }
    }
</script>