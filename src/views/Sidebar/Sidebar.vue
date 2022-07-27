<template>
    <div class="fixed font-khmer_os z-50" style="width: 350px;"
         :style="isHide?{marginLeft:'-350px'}:{marginLeft:'0px'}"
         :class="darkMode?'bg-secondary text-gray-300':'bg-white text-black'"

    >
        <div class="sidebar relative h-screen shadow">
            <div class="toggle absolute rounded py-4 top-8 cursor-pointer"
                 :class="!isHide?`pl-5 pr-2 -right-8 ${darkMode?`bg-darkBlue`:`bg-primary`}`:`pl-2 pr-6 -right-12 ${darkMode?`bg-darkBlue`:`bg-primary`}`"
                 @click="switchSidebar">
                <template v-if="!isHide">
                    <div class="bg-white rounded-full absolute h-3 w-3 left-0 top-5 flex justify-center items-center">
                        <BackIcon :width="8" :height="8"/>
                    </div>
                    <img src="/icon/Menu/menu.png" class="h-5">
                </template>
                <template v-else>
                    <div
                            class="bg-white rounded-full absolute h-3 w-3 right-2 top-5 flex justify-center items-center transform rotate-180">
                        <BackIcon :width="8" :height="8"/>
                    </div>
                    <img src="/icon/Menu/menu-rotate.png" class="h-5">
                </template>
            </div>
            <div class="profile px-10 py-8 flex items-end text-white justify-between"
                 :class="darkMode?`bg-darkBlue`:`bg-primary`">
                <div style="padding: 1px 0;" class="flex flex-col justify-center items-center">
                    <div class="w-20 h-20 rounded-full bg-cover bg-center m-auto bg-white cursor-pointer relative"
                         :style="{backgroundImage:`url(${token?stProfile['photo']:'/profile.png'})`}"
                         @click="() => {token? this.$router.push('/profile').catch(err=>{}):``}">
                    </div>
                    <div class="flex justify-between items-end mt-3  cursor-pointer"
                         :class="localize==='en'?'text-xs':'text-xs'">
                        <p class="name font-PoppinsMedium">
                            {{ token ? stProfile.first_name + " " + stProfile.last_name : $t('unname') }}
                        </p>
                    </div>
                </div>
                <div class="cursor-pointer" @click="getMyQr()" v-if="token">
                    <div>
                        <QRIcon/>
                    </div>
                    <div class="text-sm mt-2 font-PoppinsMedium">
                        My QR
                    </div>
                </div>
            </div>
            <div class="py-3 overflow-y-scroll h-screen pb-40 flex flex-col justify-between">
                <div class="px-5 flex-1">
                    <template v-if="token">
                        <Study/>
                        <div class="h-10"></div>
                        <Report/>
                        <div class="h-10"></div>
                        <Privacy/>
                        <div class="h-10"></div>
                    </template>
                    <eSchool/>
                    <div class="h-5"></div>
                </div>
                <div v-if="ads">
                    <div v-if="ads.banner" class="relative max-w-full">
                        <div
                                class="absolute right-2 top-2 ads z-50 bg-primary flex items-center justify-center w-8 h-6 text-white bg-opacity-70 rounded text-xs">
                            Ads
                        </div>
                        <img :src="ads.banner" @click="openLink(ads.link)" class="cursor-pointer max-h-full"/>
                    </div>
                </div>
            </div>
        </div>
        <!-- QR -->
        <div class="fixed w-full h-full top-0 z-50 left-0 bg-black bg-opacity-95 flex items-center justify-center"
             v-if="showQr">
            <div class="absolute right-5 top-5 cursor-pointer" @click="()=>{this.showQr = false}">
                <CloseIcon fill="#9CA3AF"></CloseIcon>
            </div>
            <div class="w-80">
                <img :src="qrUrl" class="max-w-full rounded-t">
                <input type="text" id="qrCode" class="absolute focus:outline-none" :value="profile_url"
                       style="z-index:-10">
                <div class="bg-primary h-12 flex items-center justify-center px-3 rounded-b">
                    <div class="cursor-pointer text-white" @click="copyText">{{ $t('copy_link') }}</div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import BackIcon from "./../../components/BackIcon"
    import CloseIcon from "./../../components/CloseIcon.vue"
    import QRIcon from "./../../components/QRIcon.vue"
    import Study from "./components/Study.vue"
    import Report from "./components/Report.vue"
    import Privacy from "./components/Privacy.vue"
    import CameraIcon from "./../../components/CameraIcon.vue"
    import eSchool from "./components/eSchool.vue"
    import {mapActions, mapState} from "vuex"
    import helper from "./../../helper/helper"

    const {ipcRenderer} = require('electron')
    export default {
        components: {
            BackIcon,
            Privacy,
            Report,
            Study,
            eSchool,
            CameraIcon,
            QRIcon,
            CloseIcon
        },
        data() {
            return {
                showQr: false,
                loading: false,
                qrUrl: "",
                profile_url: ""
            }
        },
        computed: {
            ...mapState('auth', ['token', 'stProfile']),
            ...mapState('setting', ['localize', 'darkMode', 'isHide']),
            ...mapState('home', ['ads'])
        },

        methods: {
            ...mapActions('auth', ['changeProfilePhotoPhoto', 'getQr']),
            ...mapActions('upload', ['singleUpload']),
            switchSidebar() {
                if (this.isHide) {
                    this.$store.commit('setting/toggleSidebar', false)
                } else {
                    this.$store.commit('setting/toggleSidebar', true)

                }
            },
            openLink(link) {
                ipcRenderer.send('openLink', link)
            },
            getMyQr() {
                this.getQr().then(response => {
                    if (response.data.msg) {
                        helper.errorMessage(response.data.msg)
                        return;
                    }
                    this.qrUrl = response.data.data.qrcode_url
                    this.profile_url = response.data.data.profile_url
                    this.showQr = true
                })
            },
            copyText() {
                let copyText = document.getElementById("qrCode");
                copyText.select();
                copyText.setSelectionRange(0, 99999)
                document.execCommand("copy");
                helper.success("Copied the text: " + copyText.value)
            },
            onSelectedPhoto(event) {
                if (event.target.value) {
                    this.loading = true
                    const file = event.target.files[0];
                    let formData = new FormData();
                    formData.append("photo", file)
                    this.singleUpload(formData).then(res => {
                        if (res.data) {
                            let photo = new FormData()
                            photo.append("photo", res.data.url)
                            this.changeProfilePhotoPhoto(photo).then(response => {
                                if (res.data) {
                                    let stProfile = localStorage.getItem("stProfile")
                                    stProfile = JSON.parse(stProfile)
                                    stProfile.photo = response.data.photo
                                    this.$store.commit("auth/studentProfile", stProfile)
                                    localStorage.setItem("stProfile", JSON.stringify(stProfile))
                                }
                                this.loading = false
                            })
                        }
                        this.loading = false

                    })


                }
            },
        },


    }
</script>