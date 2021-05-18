<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1127')}}
        </div>
        <div class="px-3 my-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/chat.png" class="h-5 m-auto"> -->
                        <div><ChatIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ChatIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1128')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/policy.png" class="h-5 m-auto"> -->
                        <div><PolicyIcon :fill="darkMode?`#909090`:`#0f3c7a`"></PolicyIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1129')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/help.png" class="h-5 m-auto"> -->
                        <div><HelpIcon :fill="darkMode?`#909090`:`#0f3c7a`"></HelpIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1130')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/about.png" class="h-5 m-auto"> -->
                        <div><AboutIcon :fill="darkMode?`#909090`:`#0f3c7a`"></AboutIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1131')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/share.png" class="h-5 m-auto"> -->
                        <div><ShareIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ShareIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1132')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="setDarkMode(darkMode)">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md`">
                        <!-- <img src="/icon/icon/mode.png" class="h-5 m-auto"> -->
                        <div><ModeIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ModeIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{darkMode?$t('light_mode'):$t('1133')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 w-full cursor-pointer" :class="darkMode?``:`bg-gray-100 shadow-md `"
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
    import KhIcon from "./../../../components/KhIcon"
    import EnIcon from "./../../../components/EnIcon"

    export default{
        components:{
            ChatIcon,
            PolicyIcon,
            HelpIcon,
            AboutIcon,
            ShareIcon,
            ModeIcon,
            KhIcon,
            EnIcon
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
            }
        }
    }
</script>