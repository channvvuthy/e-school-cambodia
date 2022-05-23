<template>
    <div>
        <div :class="downloaded.length<=0?`flex flex-col p-5`:`p-5`">
            <div class="h-screen flex justify-center items-center pb-40"
                 v-if="downloaded.length <= 0 || active ===2">
                <Empty/>
            </div>
            <div class="flex justify-start font-siemreap h-screen overflow-y-scroll pb-40" v-else>
                <div class="grid gap-4" :class="isHide?`md:grid-cols-4 2xl:grid-cols-5`:`md:grid-cols-3 2xl:grid-cols-4`">
                    <div class="flex-col mb-5 relative" v-for="(video, key) in downloaded" :key="key">
                        <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow-md`" class="rounded-xl">
                            <div class="relative">
                                <img :src="video.thumbnail" class="rounded-t-xl cursor-pointer" @click="gotToPlayList(video)">
                                <div class="flex justify-center items-center absolute left-0 w-full -bottom-5 cursor-pointer">
                                    <div class="w-14 h-14 rounded-md bg-gray-300 bg-cover" :style="{backgroundImage:`url(${video.teacher.photo})`}"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-center mt-8 px-5" @click="gotToPlayList(video)">
                                <div class="text-sm font-semibold mt-2">{{video.teacher.name}} ({{ cutString(video.title,30) }})</div>
                            </div>
                            <div class="flex items-end w-full justify-between mt-4 text-center text-sm px-5" @click="gotToPlayList(video)">
                                <div class="cursor-pointer">
                                    <YoutubeIcon :fill="darkMode?`#909090`:`#000000`"/>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                        {{ video.total_video?video.total_video: 0}}
                                    </div>
                                </div>
                                <div class="cursor-pointer">
                                    <PdfIcon :fill="darkMode?`#909090`:`#000000`"/>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                        {{ video.total_pdf?video.total_pdf:0 }}
                                </div>
                                </div>
                                <div class="cursor-pointer">
                                    <ChatIcon :fill="darkMode?`#909090`:`#000000`"/>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center" :class="darkMode?`text-skyBlue`:`text-primary`">
                                        {{ video.has_support?$t('1008'):$t('1009') }}
                                    </div>   
                                </div>
                                <div class="cursor-pointer">
                                    <TestIcon :fill="darkMode?`#909090`:`#000000`"/>
                                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center" :class="darkMode?`text-skyBlue`:`text-primary`">
                                        {{ video.has_quiz?$t('1008'):$t('1009') }}
                                    </div>
                                </div>
                                <div class="cursor-pointer">
                                    <CertificateIcon :fill="darkMode?`#909090`:`#000000`"/>
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
                                    {{$t('date_expired')}} : .. .. ..
                                </div>
                                <div class="cursor-pointer" @click="confrimDelete(video)">
                                    <DeleteIcon :fill="darkMode?`#909090`:`#c0272d`"/>
                                </div>
                            </div>
                            <div class="h-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BuyMsg
                v-if="isConfrim"
                :msg="`delete`"
                @cancelModal="() => {this.isConfrim = false}"
                @yes="yes"/>
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
    import BuyMsg from "./../Component/BuyMsg.vue"
    import Empty from "./../Component/Empty.vue"
    export default{
        components:{
            CertificateIcon,
            TestIcon,
            PdfIcon,
            ChatIcon,
            YoutubeIcon,
            DeleteIcon,
            BuyMsg,
            Empty
        },
        data(){
            return {
                downloaded: [],
                active: 1,
                window: {
                    width: 0,
                },
                isConfrim: false,
                video:{},
            }
        },
        computed:{
            ...mapState('setting', ['darkMode', 'isHide'])
        },
        methods: {
            yes(){
                this.isConfrim = false
                let videos = JSON.parse(localStorage.getItem('videos'));
                videos = videos.filter(item => item.course._id != this.video.course._id);
                this.downloaded = videos.filter((value, index, self) => self.findIndex((m) => m.course._id === value.course._id) === index);
                localStorage.setItem("videos", JSON.stringify(videos))
            },
            confrimDelete(video){
                this.video = video
                this.isConfrim = true
            },
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
                 this.$router.push({name: 'download-detail',params:{course: videoCourse}})
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