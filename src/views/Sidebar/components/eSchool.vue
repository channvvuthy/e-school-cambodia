<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1127')}}
        </div>
        <div class="px-3 my-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('chat')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `chat`?`bg-byline`:`bg-button`}`:`${$route.name === `chat`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <ChatIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `chat`"></ChatIcon>
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
                <div class="text-center flex flex-col justify-center items-center">
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
            },
            goTo(page) {
                this.$router.push({ name: page });
            },
        }
    }
</script>