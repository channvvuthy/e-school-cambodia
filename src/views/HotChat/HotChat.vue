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
                <div class="mt-10 px-10 h-full overflow-y-scroll pb-40" style="position:relative;z-index:1">
                    <!-- User -->
                    <div class="w-72 relative rounded-3xl py-5 e-shadow flex items-center px-5 text-black mb-5" :class="darkMode?`bg-button text-gray-300`:`bg-white`" v-for="i in 10" :key="i">
                        <div class="chevron absolute bottom-5 z-10" style="left:-2.51rem;">
                            <img :src="darkMode?`chevron-dark.png`:`chevron.png`">
                        </div>
                        <div class="relative z-50">
                            សួស្តី! តើមានបញ្ហាអ្វីចង់អោយ ខាង 
                            E-School ជួយ?   
                        </div>
                    </div>
                    <!-- Owner -->
                </div>
            </div>
            <div class="h-40 flex items-center mb-32 px-5" :class="darkMode?`bg-secondary`:`bg-white e-shadow`" style="position:relative;z-index:10">
                <div class="cursor-pointer">
                    <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                </div>
                <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                <div class="w-14 flex justify-end">
                    <div class="cursor-pointer h-12 w-12 rounded-full flex items-center justify-center transform rotate-90" :class="darkMode?``:``">
                        <ChevronIcon :fill="darkMode?`#909090`:`#979797`" :size="50"></ChevronIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "../Video/components/Header.vue"
import MessagerIcon from "./components/MessagerIcon.vue"
import TelegramIcon from "./components/TelegramIcon.vue"
import ImageIcon from "../../components/ImageIcon.vue"
import ChevronIcon from "./components/ChevronIcon.vue"
import VideoIcon from "./components/VideoIcon.vue"
import {mapState} from "vuex"
export default {
    components:{
        eHeader,
        MessagerIcon,
        TelegramIcon,
        VideoIcon,
        ImageIcon,
        ChevronIcon
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    }
}
</script>