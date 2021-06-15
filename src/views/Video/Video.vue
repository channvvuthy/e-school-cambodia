<template>
    <div class="mt-3 overflow-y-scroll h-screen pb-40" @scroll="onScroll">
        <BoxFilter @enableUserScroll="enableUserScroll($event)"></BoxFilter>
        <div class="mt-10 px-5">
            <div v-if="loading">
                <Loading></Loading>
            </div>
            <div v-else>
                <div class="grid gap-4" :class="isHide?`grid-cols-4`:`md:grid-cols-3 2xl:grid-cols-5`">
                    <div v-for="(video, index) in videos.list" :key="index">
                        <div class="relative rounded-xl cursor-pointer view" :class="darkMode?`bg-secondary text-white`:`bg-white shadow`" :style="minHeight?{minHeight:`${minHeight}px`}:{}">
                            <div class="absolute left-3 top-3" v-if="video.is_new"><NewIcon></NewIcon></div>
                            <div class="absolute top-3 left-3" v-if="video.is_buy">
                                <div class="h-6 w-6 rounded-full flex justify-center items-center text-white text-base" :class="darkMode?`bg-primary`:`bg-primary border border-textSecondary`">
                                    <span>&#10003;</span>
                                </div>
                            </div>
                            <img :src="video.thumbnail" @click="gotToPlayList(video)" class="rounded-t-xl" onerror="this.onerror=null; this.src='/poster.png'"/>
                            <div v-if="video.last_watch" class="h-1 absolute bg-red-600 -mt-1" :style="{width:`${video.last_watch.percentage}%`}"></div>
                            <div class="flex flex-col relative w-full justify-center items-center -top-10 px-5">
                            <div @click="gotToPlayList(video)" class="flex flex-col relative w-full justify-center items-center">
                                <div class="w-14 h-14 rounded-md bg-gray-300 bg-cover" :style="{backgroundImage:`url(${video.teacher.photo})`}"></div>
                                <div class="text-sm font-semibold mt-3">{{video.teacher.name}} ({{ cutString(video.title,30) }})</div>
                                <div class="flex items-end w-full justify-between mt-3 text-center text-sm">
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
                            </div>
                               <div class="flex w-full justify-between items-center relative top-5 mt-5 text-xs">
                                   <template v-if="video.price.year">
                                        <div  :class="darkMode?`text-gray-300`:``">{{$t('1006')}} : <del>{{video.price.highlight}} USD</del>&nbsp; <span :class="darkMode?`text-gray-300`:`text-red-700`">{{video.price.year}} USD</span></div>
                                        <div @click="addToCart(video)">
                                            <div v-if="!video.is_in_cart">
                                                <CartIcon :fill="darkMode?`#909090`:`#000000`"></CartIcon>
                                            </div>
                                        </div>
                                   </template>
                                   <template v-else>
                                        <div  :class="darkMode?`text-gray-300`:`text-red-700`">{{$t('1007')}}</div>
                                   </template>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="loadingMore">
                <Loading></Loading>
            </div>
            <template v-if="videos.list && videos.list.length <= 0">
                <Empty></Empty>
             </template>
            <BuyMsg v-if="showMsg" :msg="msg" @cancelModal="() => {this.showMsg = false}" @yes="yes"></BuyMsg>
        </div>
    </div>
</template>

<script>
import BoxFilter from "./components/Filter.vue"
import Loading from "./../../components/Loading.vue"
import CertificateIcon from "./../../components/CertificateIcon.vue"
import TestIcon from "./../../components/TestIcon.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import ChatIcon from "./../../components/ChatIcon.vue"
import CartIcon from "./../../components/CartIcon.vue"
import YoutubeIcon from "./../../components/YoutubeIcon.vue"
import NewIcon from "./../../components/NewIcon.vue"
import {mapState, mapActions} from "vuex"
import helper from "./../../helper/helper"
import Empty from "./../Component/Empty.vue";
import BuyMsg from "./../Component/BuyMsg.vue"

const { ipcRenderer } = require('electron')

export default {
    components:{
        BoxFilter,
        Loading,
        CertificateIcon,
        YoutubeIcon,
        TestIcon,
        PdfIcon,
        ChatIcon,
        CartIcon,
        NewIcon,
        Empty,
        BuyMsg
    },
    data(){
        return{
            page: 1,
            enableScroll: true,
            minHeight: 0,
            showMsg: false,
            msg: "2006"
        }
    },
    computed:{
        ...mapState("video", ["videos", "loading","loadingMore"]),
        ...mapState("setting", ["darkMode","isHide"]),
        ...mapState('home', ['filter', 'selectedFilterName', 'filter_id', 's'])
    },
    methods:{
        ...mapActions('video', ['getVideo','getVideoWithPagination']),
        ...mapActions('cart', ['addCart', 'getCart']),
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        gotToPlayList(videoCourse){
            if(localStorage.getItem('token') === null){
                this.showMsg = true
                return;
            }
            this.$router.push({ name: 'video-detail', params: { course: videoCourse } })
        },
        enableUserScroll(){
            this.enableScroll = true
            this.page = 1
        },
        matchHeight(){
            let arr = []
            let interval = setInterval(() => {
                let box = document.getElementsByClassName('view')
                if (box) {
                    for(let i = 0; i < box.length; i++){
                        arr.push(box[i].clientHeight)
                    }
                    this.minHeight = Math.max(...arr)
                    clearInterval(interval)
                }
            }, 1000)
        },
         addToCart(video){
            if(localStorage.getItem('token') === null){
                this.showMsg = true
                return;
            }
            let payload = {}
            payload.id = video._id
            this.addCart(payload).then(() =>{
                this.getCart()
            })
            this.$store.commit("video/addToCart",video._id)
        },
        yes(){
            this.$router.push('login');
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= scrollHeight) {
                this.page ++ 

                let payload = {}

                if(this.s.length){
                    payload.s = this.s
                }

                if(this.filter_id !== "all"){
                    payload.filter_id = this.filter_id
                }

                payload.p = this.page

                if(this.enableScroll){
                    this.getVideoWithPagination(payload).then(res =>{
                        if(res.data.data.list.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
    },
    mounted(){

        this.$nextTick(() => {
            this.matchHeight()
        })
        ipcRenderer.send('downloadLocation', '')
        ipcRenderer.on("getDownloadLocation", (event, arg) =>{
            this.$store.commit("playVideo/downloadLocation", arg)
        })
    },
    created(){
        this.getVideo({filter_id:""});
    }

}
</script>

<style>

</style>
