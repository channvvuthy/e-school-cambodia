<template>
    <div>
        <VideoHeader></VideoHeader>
        <div class="flex mt-3 px-5">
            <div class="w-3/5">
                <div :class="darkMode?`bg-youtube text-gray-300`:`bg-white pb-5 shadow rounded-b-lg text-sm`">
                    <div class="relative" @mouseover="() => {this.fullScreenBtn = true}" @mouseleave="() =>{this.fullScreenBtn = false}">
                        <div class="flex justify-center items-center bg-black bg-opacity-70 rounded absolute top-5 left-5 cursor-pointer z-50 h-8 w-8" v-if="fullScreenBtn" @click="toggleFullScreen">
                        <div class="border border-gray-300 opacity-60 m-1" style="padding:1px;">
                            <EnlargeIcon :size="16"></EnlargeIcon>
                        </div>
                        </div>
                        <div class="absolute w-full h-full flex justify-center items-center" v-if="loading"><LoadingWhite></LoadingWhite></div>
                        <video controlsList="nodownload" autoplay class="m-auto w-full outline-none" id="vid" ref="eVideo" poster="/poster-home.png"
                            @waiting ="() => {this.loading = true}"
                            @pause="pause()"
                            @click="playPause()"
                            @timeupdate="timeUpdate"
                            @ended="endedVideo"
                            @canplay ="() => {this.loading = false}">
                            <source :src="videoUrl"/>
                        </video>
                        <div class="absolute w-full bottom-0 flex justify-end items-end px-10">
                            <div class="bg-black bg-opacity-80 w-full rounded-md flex items-center justify-between h-10 text-gray-300 mb-10 px-5">
                                <!-- Play & pause -->
                                <div v-if="showPlay" @click="playPause"><PlayIcon fill="#ffffff"></PlayIcon></div>
                                <div v-else @click="playPause"><PauseIcon fill="#ffffff"></PauseIcon></div>
                                <!-- Duration -->
                                <div class="px-5 opacity-80">
                                    <span id="currentTime"></span>
                                </div>
                                <!-- Slider -->
                                <div class="flex-1 relative">
                                    <input type="range" min="0" max="100" id="seekSlider" value="0" step="1"
                                    v-model="rangeSliderWidth"
                                            ref="seekSlider"
                                            class="w-full seekSlider videoSeekSlider z-50 relative z-50"/>
                                    <div class="bg-white absolute" style="height:4px;bottom:6px;z-index:1" :style="{width:`${rangeSliderWidth}%`}"></div>
                                </div>
                                <!-- Duration -->
                                <div class="px-5 opacity-80">
                                    <span id="currentDuration"></span>
                                </div>
                                <!-- Setting -->
                                <div class="mr-5 cursor-pointer relative">
                                    <div @click="showSettingModal">
                                        <SettingIcon></SettingIcon>
                                    </div>
                                        <!--Setting-->
                                        <div class="bg-black absolute bottom-8 w-48 right-0 px-3 bg-opacity-70 rounded-md py-2"
                                            v-if="showSetting">
                                            <div class="flex justify-between items-center h-10 leading-10"
                                                @click="showPlaybackModal">
                                                <div>{{$t('playback_speed')}}</div>
                                                <div class="transform -rotate-90">
                                                    <ChevronIcon fill="#ffffff" :size="16"></ChevronIcon>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center h-10 leading-10"
                                                @click="showQualityModal">
                                                <div>{{$t('quality')}}</div>
                                                <div class="transform -rotate-90">
                                                    <ChevronIcon fill="#ffffff" :size="16"></ChevronIcon>
                                                </div>
                                            </div>
                                        </div>
                                        <!--End setting-->
                                        <!--Playback speed-->
                                        <div class="bg-black absolute bottom-8 w-48 right-0 bg-opacity-70 rounded-md pt-2 overflow-hidden"
                                            v-if="showPlayback">
                                            <div class="flex items-center h-10 leading-10 px-3" @click="playbackBack">
                                                <div class="transform rotate-90 mr-3">
                                                    <ChevronIcon fill="#ffffff" :size="16"></ChevronIcon>
                                                </div>
                                                <div>{{$t('playback_speed')}}</div>
                                            </div>
                                            <hr class="opacity-30">
                                            <div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(0.25)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===0.25">&#10003;</span>0.25
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(0.5)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===0.5">&#10003;</span>
                                                    0.5
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(0.75)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===0.75">&#10003;</span>
                                                    0.75
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(1)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===1">&#10003;</span>
                                                    {{$t('normal')}}
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(1.25)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===1.25">&#10003;</span>
                                                    1.25
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(1.5)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===1.5">&#10003;</span>
                                                    1.5
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(1.75)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===1.75">&#10003;</span>
                                                    1.75
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                    @click="playbackRate(2)">
                                                    <span class="text-sm absolute left-5" v-if="defaultSpeed ===2">&#10003;</span>
                                                    2
                                                </div>
                                            </div>
                                        </div>
                                        <!--End playback speed-->
                                        <!--Quality-->
                                        <div class="bg-black absolute bottom-8 w-48 right-0 bg-opacity-70 rounded-md pt-2 overflow-hidden"
                                            v-if="showQuality">
                                            <div class="flex items-center h-10 leading-10 px-3" @click="backQuality">
                                                <div class="transform rotate-90 mr-3">
                                                    <ChevronIcon fill="#ffffff" :size="16"></ChevronIcon>
                                                </div>
                                                <div>{{$t('quality')}}</div>
                                            </div>
                                            <hr class="opacity-30">
                                            <div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative" @click="changeVideoQuality(1)">
                                                    <span class="text-sm absolute left-5" v-if="defaultQuality ===1">&#10003;</span>{{$t('auto')}}
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative" @click="changeVideoQuality(360)">
                                                    <span class="text-sm absolute left-5" v-if="defaultQuality ===360">&#10003;</span>360p
                                                </div>
                                                <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative" @click="changeVideoQuality(720)">
                                                    <span class="text-sm absolute left-5" v-if="defaultQuality ===720">&#10003;</span>720p
                                                </div>
                                            </div>
                                        </div>
                                        <!--End quality-->
                                </div>
                                <!-- Sound -->
                                <div class="relative">
                                    <div v-if="muted"><MutedIcon :size="20"></MutedIcon></div>
                                    <div @mouseover="() =>{this.showSound = true}" v-else><SoundIcon></SoundIcon></div>
                                    <div class="range-slider absolute w-14 h-12 flex items-center justify-center transform -rotate-90 -top-14 -left-5" @mouseleave="() =>{this.showSound = false}" @mouseover="() =>{this.showSound = true}">
                                        <input type="range" min="0" max="100" step="1" v-model="defaultVolumeRange" id="volumeSlider" class="w-full cursor-pointer slider relative left-2" @change="setVolume" :class="showSound?`visible`:`invisible`"/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="px-5 text-sm mt-5">
                            <div>{{order + 1}}. {{videos.title}}</div>
                            <div class="mt-3 flex">
                                <div>
                                    <Eye :fill="darkMode?`#D1D5DB`:`#000000`"></Eye>
                                </div>
                                <div class="ml-3">{{kFormatter(videos.view)}} {{$t('1003')}}</div>
                            
                            </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 ml-5" :class="darkMode?`text-gray-300`:`text-black`">
                <div>
                    <div :class="darkMode?`bg-secondary border-b border-button text-gray-300`:`bg-white text-primary`" class="h-12 px-5 flex items-center font-bold text-sm">
                        <span>{{$t('more_video')}}</span>
                    </div>
                </div>
                <div class="h-screen overflow-y-scroll pb-60 mt-3">
                    <div v-for="(list, index) in details.list" :key="index" class="text-sm cursor-pointer" @click="nextVideo(list, index)">
                        <div class="flex rounded-md p-3" :class="darkMode?`${order === index?`bg-white text-black`:`bg-secondary`} mb-3`:`${order  === index?`bg-gray-300`:`bg-white`} shadow-md mb-3`">
                            <div class="relative w-2/5 mr-3 cursor-pointer relative">
                                <img :src="list.thumbnail" class="rounded-md">
                                <div class="absolute h-1 bg-red-600 bottom-0 left-0" v-if="list.last_watch"  :style="{width:`${list.last_watch.percentage}%`}"></div>
                            </div>
                            <div class="flex flex-col justify-between py-2 w-full flex-1">
                                <div>{{index + 1}}. {{cutString(list.title,40)}}</div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div>
                                        <Eye :fill="darkMode?`#000000`:`#000000`" v-if="order === index"></Eye>
                                        <Eye :fill="darkMode?`#D1D5DB`:`#000000`" v-else></Eye>
                                        </div> 
                                        <div class="ml-3">{{kFormatter(list.view)}} {{$t('1003')}}</div>
                                    </div>
                                    <template v-if="!canWatch(list)">
                                        <LockIcon :width="20" :height="20" :fill="darkMode?`#fff`:`#000`"></LockIcon>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Message -->
        <BuyMsg v-if="isPayment" @cancelModal="() => {this.isPayment = false}" @yes="yes"></BuyMsg>
        <Cart v-if="showCart" @closeCart="()=>{this.showCart = false}" @showInvoice="(data) =>{ this.showCart = false; this.showReceipt = true;this.receiptDetail = data}"></Cart>
        <ReceiptInfo v-if="showReceipt" :receiptDetail="receiptDetail" @closeInfo="() =>{this.showReceipt = false}"></ReceiptInfo>
    </div>
</template>
<script>
import VideoHeader from "./../../views/Video/components/Header"
import {mapState, mapActions} from "vuex"
import LoadingWhite from "./../../components/LoadingWhite.vue"
import EnlargeIcon from "./../../components/EnlargeIcon.vue";
import ChevronIcon from "./../../components/ChevronIcon.vue";
import PlayIcon from "./../MyCourse/components/media/PlayIcon.vue";
import PauseIcon from "./../MyCourse/components/media/PauseIcon.vue";
import SettingIcon from "./../MyCourse/components/media/SettingIcon.vue";
import SoundIcon from "./../MyCourse/components/media/SoundIcon.vue";
import MutedIcon from "./../MyCourse/components/media/MutedIcon.vue";
import Eye from "./../../components/Eye.vue"
import helper from "./../../helper/helper"
import BuyMsg from "./../Component/BuyMsg.vue"
import Cart from "./../Component/Cart.vue"
import ReceiptInfo from "./../MyCourse/components/ReceiptInfo.vue"
import LockIcon from "./../../components/LockIcon.vue"
export default {
    components:{
        VideoHeader,
        LoadingWhite,
        EnlargeIcon,
        ChevronIcon,
        PlayIcon,
        PauseIcon,
        SettingIcon,
        SoundIcon,
        MutedIcon,
        Eye,
        BuyMsg,
        Cart,
        ReceiptInfo,
        LockIcon
    },
    computed:{
        ...mapState('library', ['details']),
        ...mapState('setting', ['darkMode']),
        defaultVolumeRange: {
            get() {
                return this.$store.state.playVideo.defaultVolumeRange;
            },
            set(value) {
                this.$store.commit("playVideo/setDefaultVolumeRange", value);
            }
        }
    },
    data(){
        return{
            loading: true,
            videos: [],
            videoUrl: "",
            order: 0,
            showPlay: false,
            rangeSliderWidth: 0,
            muted: false,
            vid: null,
            btn: null,
            currentWatch: "",
            seekSlider: null,
            currentTime: null,
            currentDuration: null,
            muteBtn: null,
            volumeSlider: null,
            fullScreenBtn: false,
            showSetting: false,
            showPlayback: false,
            showQuality: false,
            defaultSpeed: 1,
            showSound: false,
            oldVolume: 0,
            showToolbar: false,
            defaultQuality: 360,
            lastWatch: 0,
            isPayment: false,
            course:{},
            showCart: false,
            showReceipt:false,
            receiptDetail: {},

            
        }
        
    },
    methods:{
        ...mapActions('library', ['stopWatch']),
        ...mapActions('cart', ['addCart', 'getCart']),
        kFormatter(num){
            return helper.kFormatter(num)
        },
        showQualityModal() {
            this.showQuality = true;
            this.showSetting = false;
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        backQuality() {
            this.showSetting = true;
            this.showQuality = false;
        },
        showPlaybackModal() {
            this.showPlayback = !this.showPlayback;
            this.showSetting = false;
        },
        playbackBack() {
            this.showPlayback = false;
            this.showSetting = true;
        },
        showSettingModal() {
            this.showSetting = !this.showSetting;
            this.showPlayback = false;
            this.showSound = false;
            this.showQuality = false;
        },
        playbackRate(rate) {
            this.defaultSpeed = rate;
            this.showPlayback = false;
            this.vid.playbackRate = rate;
        },
        changeVideoQuality(quality) {
            let refreshVideoQuality;
            if (quality === 1) {
                refreshVideoQuality = this.videos.video
                .filter(item => item.quality === "auto")
                .map(item => item.url)[0];
            } else {
                refreshVideoQuality = this.videos.video
                .filter(item => item.quality === `${quality}p`)
                .map(item => item.url)[0];
            }

            this.defaultQuality = quality;
            this.showQuality = false;
            this.videoUrl = refreshVideoQuality;
            this.vid.src = this.videoUrl
            this.vid.currentTime = this.lastWatch
        },
        defaultVideo(){
            this.videos = this.details.list[this.order]
            this.videoUrl = this.videos.video.filter(items => items.quality == `${this.defaultQuality}p`)[0]['url']
            if(this.videos.last_watch){
                this.lastWatch = this.videos.last_watch.mark
            }else{
                this.lastWatch = 0
            }
        },
        toggleFullScreen() {
            if (this.vid.requestFullScreen) {
                this.vid.requestFullScreen();
            } else if (this.vid.webkitRequestFullScreen) {
                this.vid.webkitRequestFullScreen();
            } else if (this.vid.mozRequestFullScreen) {
                this.vid.mozRequestFullScreen();
            }
        },
        canWatch(videos){
            if((this.details.is_buy == 1 ||  videos.free_watch == 1)){
                return true
            }
            return false
        },
        yes(){
            let payload = new FormData();
            payload.append("id", this.course._id)
            this.addCart(payload).then(() =>{
                this.getCart().then(()=>{
                    this.isPayment = false
                    this.showCart = true
                })
            })
        },
        nextVideo(videos, index){
            if(!this.canWatch(videos)){
                this.isPayment = true
                this.course = videos.course
                return;
            }
            this.videos =  videos
            this.videoUrl = this.videos.video.filter(items => items.quality == `${this.defaultQuality}p`)[0]['url']
            this.order = index
            this.vid.src = this.videoUrl
            
                
        },
        playPause() {
            this.showSetting = false;
            this.showSound = false;
            if (this.vid.paused) {
                this.vid.play();
                this.showPlay = false;
            } else {
                this.vid.pause();
                this.showPlay = true;
            }
        },
        endedVideo(){
            this.showPlay = false
            if(this.order < (this.details.list.length - 1)){
                this.videos = this.details.list[this.order + 1]
                if(!this.canWatch(this.videos)){
                    return;
                }
                this.order ++
                this.videoUrl = this.videos.video.filter(items => items.quality == `${this.defaultQuality}p`)[0]['url']
                this.vid.src = this.videoUrl
                if(this.videos.last_watch){
                    this.lastWatch = this.videos.last_watch.mark
                }else{
                    this.lastWatch = 0
                }
            }
        },
        addStopWatch(){
            let payload = {}

            payload.mark = this.vid.currentTime
            payload.duration = this.vid.duration
            payload.id = this.videos._id

            this.lastWatch = this.vid.currentTime
            this.stopWatch(payload)
        },
        pause() {
            this.showPlay = true;
            this.addStopWatch()
        },
        setVolume(event) {
            this.vid.volume = event.target.value / 100;

            if(this.vid.volume === 0){
                this.muted = true
            }else{
                this.muted = false
            }

            this.$store.commit("playVideo/setDefaultVolumeRange",event.target.value);
            event.target.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
                this.defaultVolumeRange
            }%, rgba(0, 0, 0, 0.5) ${this.defaultVolumeRange}%)`;
        },
        getVideo() {
            let interval = setInterval(() => {
                if (document.getElementById("vid") !== null) {
                clearInterval(interval);
                this.vid = document.getElementById("vid");
                if(this.lastWatch){
                    this.vid.currentTime = this.lastWatch
                }

                this.currentTime = document.getElementById("currentTime");
                this.currentDuration = document.getElementById("currentDuration");
                this.seekSlider = document.getElementById("seekSlider");
                this.volumeSlider = document.getElementById("volumeSlider");
                
                this.vid.addEventListener('loadstart', () => {
                    this.loading = true
                })
                this.vid.addEventListener('canplaythrough', () => {
                    this.loading = false
                })
                this.vid.addEventListener('waiting', () => {
                    this.loading = true
                })

                this.seekSlider.addEventListener(
                    "input",
                    event => {
                    let seekTo = this.vid.duration * (event.target.value / 100);
                    let color = `linear-gradient(90deg, rgb(255, 255, 255) ${
                        event.target.value
                    }%, rgb(151, 151, 151) ${event.target.value}%)`;
                    this.seekSlider.style.background = color;
                    this.vid.currentTime = seekTo;
                    this.showSound = false;
                    // this.addStopWatch()
                    },
                    true
                );

                this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
                    this.defaultVolumeRange
                }%, rgba(0, 0, 0, 0.5) ${this.defaultVolumeRange}%)`;
                this.vid.volume = this.volumeSlider.value / 100;
                }
            }, 100);
        },
        timeUpdate() {
            let nt = Math.floor(this.vid.currentTime * (100 / this.vid.duration));
            this.rangeSliderWidth = nt;
            let color = `linear-gradient(90deg, rgb(255, 255, 255) ${nt}%, rgb(151, 151, 151) ${nt}%)`;
            this.seekSlider.style.background = color;
            //                this.currentWatch = this.vid.currentTime

            let curmins = Math.floor(this.vid.currentTime / 60);
            let cursecs = Math.floor(this.vid.currentTime - curmins * 60);
            let durmins = Math.floor(this.vid.duration / 60);
            let dursecs = Math.floor(this.vid.duration - durmins * 60);
            if (cursecs < 10) {
                cursecs = "0" + cursecs;
            }
            if (dursecs < 10) {
                dursecs = "0" + dursecs;
            }
            if (curmins < 10) {
                curmins = "0" + curmins;
            }
            if (durmins < 10) {
                durmins = "0" + durmins;
            }
            if (curmins && cursecs) {
                this.currentTime.innerHTML = curmins + ":" + cursecs + "&nbsp;";
            }
            if (durmins && dursecs) {
                this.currentDuration.innerHTML = durmins + ":" + dursecs;
            }
        },
    },
   
    created(){
        this.defaultVideo()
        this.getVideo()
    }
    
}
</script>
<style>

    .videoSeekSlider::-webkit-slider-thumb {
        width: 14px;
        height: 14px;
        background: #FFFFFF;
        border-radius: 50px;

    }
    #volumeSlider{
         -webkit-appearance: none;
        height: 7px;
        outline: none;
        -webkit-transition: .2s;
        transition: opacity .2s;
        border-radius: 50px;
        background: linear-gradient(90deg, rgb(33, 111, 219)0%, rgba(0, 0, 0, 0.5)0%);
    }
    #volumeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background: #fff;
        cursor: pointer;
        border-radius: 50%;
    }
        
</style>