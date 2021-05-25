<template>
    <div class="fixed w-full h-48 bottom-0 right-0 z-50 justify-center items-center flex t-shadow" :class="darkMode?`bg-secondary border-t border-button text-gray-300`:`bg-white`" :style="isHide?`width:100%`:`width:${mainWidth}px`">
        <div class="flex items-center justify-between w-full px-10">
            <div>
                <img :src="defaultAudio.thumbnail" class="max-h-36 rounded-xl shadow-md">
            </div>
            <div class="text-base ml-8" :class="darkMode?`text-gray-300`:``">
                {{defaultAudio.title}}
            </div>
            <div class="flex items-center justify-between w-48 ml-8 cursor-pointer">
                <div><input type="range" id="volumn" class="absolute invisible"/></div>
                <div class="transform rotate-180"><PreviousIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></PreviousIcon></div>
                <div v-if="!showPlay" @click="playPause"><PlayIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></PlayIcon></div>
                <div  v-else @click="playPause"><PauseIcon :fill="darkMode?`#909090`:`#0f3c7a`"></PauseIcon></div>
                <div><NextIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></NextIcon></div>
                <div><RoundUpIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></RoundUpIcon></div>
            </div>
            <div class="flex-1 w-full ml-8 relative">
                <div class="absolute h-1 absolute left-0 top-4 z-10" :style="`width:${valueSlider}%`" :class="darkMode?`bg-pass`:`bg-primary`"></div>
                <input type="range" class="w-full slider z-50" min="0" max="100" value="10" step="1" v-model="valueSlider" :class="darkMode?`bg-gray-300 slider-dark`:`slider-none-dark bg-secondary`" id="seekSlider">
                <div class="flex justify-between absolute w-full mt-2 ">
                    <span id="currentTime"></span>
                    <span id="currentDuration"></span>
                </div>
            </div>
            <div class="ml-8">
                <SoundIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></SoundIcon>
            </div>
            <div class="ml-8">
                <FavoriteIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"/>
            </div>
        </div>
        <!-- Audio -->
        <audio id="audio-library" class="hidden" controls autoplay @timeupdate="timeUpdate()" @ended="onEnded()">
            <source :src="audioUrl" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import PlayIcon from "./components/PlayIcon.vue"
import NextIcon from "./components/NextIcon.vue"
import PreviousIcon from "./components/NextIcon.vue"
import PauseIcon from "./components/PauseIcon.vue"
import RoundUpIcon from "./components/RoundUpIcon.vue"
import SoundIcon from "./../../views/MyCourse/components/media/SoundIcon.vue"
import FavoriteIcon from "./../../components/FavoriteIcon.vue";
import FavoriteFill from "./../../components/FavoriteFill.vue";


export default {
    components:{
        PlayIcon,
        PauseIcon,
        NextIcon,
        PreviousIcon,
        RoundUpIcon,
        SoundIcon,
        FavoriteIcon,
        FavoriteFill
    },
    data(){
        return{
            mainWidth: 0,
            myInterval: null,
            defaultAudio: null,
            order: 0,
            audioUrl: "",
            muted: false,
            audio: null,
            btn: null,
            currentWatch: "",
            seekSlider: null,
            currentTime: null,
            currentDuration: null,
            muteBtn: null,
            volumeSlider: null,
            showSound: false,
            showPlay: true,
            valueSlider: 0,
         
        }
    },
    computed:{
        ...mapState('library', ['details']),
        ...mapState('setting', ['darkMode', 'isHide'])
    },
    methods:{
        initialWidth(){
            this.myInterval = setInterval(() =>{
            let el = document.getElementById("main")
                if(el.clientWidth){
                    this.mainWidth = el.clientWidth
                    clearInterval(this.myInterval)
                }
            },100)
        },
        playPause() {
            if (this.audio.paused) {
                this.audio.play();
                this.showPlay = true;
            } else {
                this.audio.pause();
                this.showPlay = false;
            }
        },
        pause() {
            this.showPlay = true;
        },
        onEnded(){
            this.showPlay = false
            // let color = `linear-gradient(90deg, rgb(15, 60, 122) 100%, rgb(214,214,214) 100%)`
            // if(this.darkMode){
            //     color = `linear-gradient(90deg, rgb(90, 162, 10) 100%, rgb(214,214,214) 100%)`
            // }
            // this.seekSlider.style.background = color
            // this.showOption = false
            // this.lastWatchVideo()
            this.$emit("onPlayerEnded")

            // this.audio = ""
            // this.currentDuration = ""
            // this.currentWatch = ""

        },
        timeUpdate(){
            let nt = Math.floor(this.audio.currentTime * (100 / this.audio.duration));
            let color = `linear-gradient(90deg, rgb(15, 60, 122) ${nt}%, rgb(214,214,214) ${nt}%)`
            if(this.darkMode){
                color = `linear-gradient(90deg, rgb(90, 162, 10) ${nt}%, rgb(214,214,214) ${nt}%)`
            }
            this.valueSlider = nt
            this.seekSlider.style.background = color
            this.currentWatch = this.audio.currentTime

            let curmins = Math.floor(this.audio.currentTime / 60);
            let cursecs = Math.floor(this.audio.currentTime - curmins * 60);
            let durmins = Math.floor(this.audio.duration / 60);
            let dursecs = Math.floor(this.audio.duration - durmins * 60);

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

            // this.currentMinute = curmins

        },
        getVideo() {
            let interval = setInterval(() => {
                if (document.getElementById("audio-library") !== null) {
                clearInterval(interval);
                this.audio = document.getElementById("audio-library");
                // this.audio.currentTime = this.lastWatched;
                this.currentTime = document.getElementById("currentTime");
                this.currentDuration = document.getElementById("currentDuration");
                this.seekSlider = document.getElementById("seekSlider");
                // this.volumeSlider = document.getElementById("volumn");
                
                // this.audio.addEventListener('loadstart', () => {
                //     this.loading = true
                // })
                // this.audio.addEventListener('canplaythrough', () => {
                //     this.loading = false
                // })
                // this.audio.addEventListener('waiting', () => {
                //     this.loading = true
                // })

                this.seekSlider.addEventListener(
                    "input",
                    event => {
                    let seekTo = this.audio.duration * (event.target.value / 100);
                    let color = `linear-gradient(90deg, rgb(15, 60, 122) ${
                        event.target.value
                    }%, rgb(151, 151, 151) ${event.target.value}%)`;

                    if(this.darkMode){
                        color = `linear-gradient(90deg, rgb(90, 162, 10) ${event.target.value}%, rgb(214,214,214) ${event.target.value}%)`
                    }
                    
                    this.seekSlider.style.background = color;
                    this.audio.currentTime = seekTo;
                    // this.showSound = false;
                    },
                    true
                );

                // this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
                //     this.defaultVolumeRange
                // }%, rgba(0, 0, 0, 0.5) ${this.defaultVolumeRange}%)`;
                // this.audio.volume = this.volumeSlider.value / 100;
                // this.setMute(this.volumeSlider.value);
                }
            }, 200);
        },
    },
    mounted(){
        this.getVideo()
    },
    created(){
        this.initialWidth()
        this.defaultAudio = this.details.list[this.order]
        this.audioUrl = this.defaultAudio.filename
        window.addEventListener('click',()=>{
            if(this.audio != null){
                this.seekSlider.value
                // console.log(this.seekSlider.value)
                let color = `linear-gradient(90deg, rgb(15, 60, 122) ${
                        this.seekSlider.value
                    }%, rgb(151, 151, 151) ${this.seekSlider.value}%)`;

                if(this.darkMode){
                    color = `linear-gradient(90deg, rgb(90, 162, 10) ${this.seekSlider.value}%, rgb(214,214,214) ${this.seekSlider.value}%)`
                }

                console.log(color)
                    
                this.seekSlider.style.background = color;
            }
        },false)
        

    },
}
</script>
<style>
    .t-shadow{
        box-shadow: 0px -4px 3px rgba(0, 0, 0, 0.1);
    }
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 1px;
        outline: none;
        -webkit-transition: .2s;
        transition: opacity .2s;

    }
    .slider-dark{
        background: linear-gradient(90deg, rgb(90, 162, 10) 10%, rgb(214, 214, 214) 0%);
    }
    .slider-none-dark{
        background: linear-gradient(90deg, rgb(15, 60, 122) 10%, rgb(214, 214, 214) 0%);
    }
    .slider-none-dark::-webkit-slider-thumb {
    -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #0f3c7a;
        cursor: pointer;
        border-radius: 50%;
    }
    .slider-dark::-webkit-slider-thumb {
    -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background:#5aa20a;
        cursor: pointer;
        border-radius: 50%;
    }
</style>