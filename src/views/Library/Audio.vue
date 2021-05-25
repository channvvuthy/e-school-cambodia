<template>
    <div class="fixed w-full h-48 bottom-0 right-0 z-50 justify-center items-center flex t-shadow" :class="darkMode?`bg-secondary border-t border-button`:`bg-white`" :style="isHide?`width:100%`:`width:${mainWidth}px`">
        <div class="flex items-center justify-between w-full px-10">
            <div>
                <img :src="defaultAudio.thumbnail" class="max-h-36 rounded-xl shadow-md">
            </div>
            <div class="text-base ml-8" :class="darkMode?`text-gray-300`:``">
                {{defaultAudio.title}}
            </div>
            <div class="flex items-center justify-between w-48 ml-8 cursor-pointer">
                <div class="transform rotate-180"><PreviousIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></PreviousIcon></div>
                <div><PlayIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></PlayIcon></div>
                <!-- <div><PauseIcon :fill="darkMode?`#909090`:`#0f3c7a`"></PauseIcon></div> -->
                <div><NextIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></NextIcon></div>
                <div><RoundUpIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></RoundUpIcon></div>
            </div>
            <div class="flex-1 w-full ml-8">
                <input type="range" class="w-full slider" :class="darkMode?`bg-gray-300`:`bg-secondary`">
            </div>
            <div class="ml-8">
                <SoundIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"></SoundIcon>
            </div>
            <div class="ml-8">
                <FavoriteIcon :fill="darkMode?`#E5E7EB`:`#0f3c7a`"/>
            </div>
        </div>
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
        }
    },
    created(){
        this.initialWidth()
        this.defaultAudio = this.details.list[this.order]
    }
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
    .slider:hover {
    opacity: 1;
    }
    .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #0f3c7a;
        cursor: pointer;
        border-radius: 50%;
    }
</style>