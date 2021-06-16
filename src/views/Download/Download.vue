<template>
    <div>
        <div :class="downloaded.length<=0?`flex flex-col p-5`:`p-5`">
            <div class="h-screen flex justify-center items-center" v-if="downloaded.length <= 0 || active ===2">
                <img src="/icon/Empty/Empty.svg" class="w-64  mb-5 relative -top-28"/>
            </div>
            <div class="flex justify-start font-siemreap h-screen overflow-y-scroll pb-40" v-else>
                <div class="grid gap-4" :class="isHide?`md:grid-cols-4 2xl:grid-cols-5`:`md:grid-cols-3 2xl:grid-cols-4`">
                    <div class="flex-col mb-5 relative cursor-pointer" v-for="(video, key) in downloaded" :key="key">
                        <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow-md`" class="rounded-xl" @click="gotToPlayList(video)">
                            <div class="relative">
                                <img :src="video.thumbnail" class="rounded-t-xl">
                                <div class="flex justify-center items-center absolute left-0 w-full -bottom-5">
                                    <div class="w-14 h-14 rounded-md bg-gray-300 bg-cover" :style="{backgroundImage:`url(${video.teacher.photo})`}"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-center mt-8 px-5">
                                <div class="text-sm font-semibold mt-2">{{video.teacher.name}} ({{ cutString(video.title,30) }})</div>
                            </div>
                            <div class="flex items-end w-full justify-between mt-4 text-center text-sm px-5">
                                <div class="cursor-pointer">
                                    <YoutubeIcon :fill="darkMode?`#909090`:`#000000`"></YoutubeIcon>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                        {{ video.total_video?video.total_video: 0}}
                                    </div>
                                </div>
                                <div class="cursor-pointer">
                                    <PdfIcon :fill="darkMode?`#909090`:`#000000`"></PdfIcon>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                        {{ video.total_pdf?video.total_pdf:0 }}
                                </div>
                                </div>
                                <div class="cursor-pointer">
                                    <ChatIcon :fill="darkMode?`#909090`:`#000000`"></ChatIcon>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center" :class="darkMode?`text-skyBlue`:`text-primary`">
                                        {{ video.has_support?$t('1008'):$t('1009') }}
                                    </div>   
                                </div>
                                <div class="cursor-pointer">
                                    <TestIcon :fill="darkMode?`#909090`:`#000000`"></TestIcon>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center" :class="darkMode?`text-skyBlue`:`text-primary`">
                                        {{ video.has_quiz?$t('1008'):$t('1009') }}
                                    </div>
                                </div>
                                <div class="cursor-pointer">
                                    <CertificateIcon :fill="darkMode?`#909090`:`#000000`"></CertificateIcon>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center" :class="darkMode?`text-skyBlue`:`text-primary`">
                                        {{ video.has_certificate?$t('1008'):$t('1009') }}
                                    </div>
                                </div>
                            </div>
                            <div class="h-3"></div>
                            <div class="w-full h-1 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                            <div class="h-4"></div>
                            <div class="flex justify-between items-center px-5">
                                <div class="text-xs">
                                    {{$t('date_expired')}} : 11-05-2022
                                </div>
                                <div class="cursor-pointer">
                                    <DeleteIcon :fill="darkMode?`#909090`:`#000000`"></DeleteIcon>
                                </div>
                            </div>
                            <div class="h-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import helper from "./../../helper/helper"
    import CertificateIcon from "./../../components/CertificateIcon.vue"
    import DeleteIcon from "./../MyCourse/components/DeleteIcon.vue"
    import TestIcon from "./../../components/TestIcon.vue"
    import PdfIcon from "./../../components/PdfIcon.vue"
    import ChatIcon from "./../../components/ChatIcon.vue"
    import YoutubeIcon from "./../../components/YoutubeIcon.vue"
    import {mapState} from "vuex"
    export default{
        name: "Download",
        components:{
            CertificateIcon,
            TestIcon,
            PdfIcon,
            ChatIcon,
            YoutubeIcon,
            DeleteIcon
        },
        data(){
            return {
                downloaded: [],
                active: 1,
                window: {
                    width: 0,
                },
            }
        },
        computed:{
            ...mapState('setting', ['darkMode', 'isHide'])
        },
        methods: {
            getPathFromUrl(url) {
                return url.split("?")[0];
            },
            cutString(text, limit){
                return helper.cutString(text, limit)
            },
           
            handleResize() {
                this.window.width = window.innerWidth;
            },
             gotToPlayList(videoCourse){
                 this.$router.push('download')
            },
            downloadDetail(video){
                let downloadDetail = JSON.parse(localStorage.getItem('videos'))
                downloadDetail = downloadDetail.filter(item => item.course._id === video.course._id)
                this.$store.commit('course/getDownloadDetail', downloadDetail)
                this.$router.push('download-detail')
            },
            filtterDocument(active){
                this.active = active
            }
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        created(){
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            if (localStorage.getItem("videos")!==null) {
                let downloaded = JSON.parse(localStorage.getItem('videos'))
                downloaded = downloaded.filter((value, index, self) => self.findIndex((m) => m.course._id === value.course._id) === index)
                this.downloaded = downloaded
            }
        }

    }
</script>