<template>
    <div class="m-5 flex flex-col" :class="list.length <=0?'h-full':''">
        <div v-if="homeLoading">
            <Loading></Loading>
        </div>
        <div class="grid gap-4" :class="isHide?'grid-cols-4':'grid-cols-3'" v-else>
            <div v-for="(view,index) in list" class="cursor-pointer" :key="index" :class="darkMode?'bg-secondary text-textSecondary':'bg-white shadow'">
                <!--Vdo-->
                <div v-if="view.type ==='vdo'" @mouseover="hideAndShowDuration(view.vdo._id)"
                     @mouseleave="hideAndShowDuration('')">
                    <div class="relative" @click="viewVideo(view)">
                        <div class="absolute z-30 w-full h-full flex justify-center items-center">
                            <video :src="playWhenOver(view.vdo.video)" autoplay="autoplay"
                                   class="flex justify-center items-center"
                                   controlsList="nodownload" v-if="hideDuration===view.vdo._id" muted></video>
                        </div>
                        <div class="absolute right-3 bottom-2 rounded px-2 py-1 bg-black text-white bg-opacity-60 text-xs"
                             v-if="millisToMinutesAndSeconds(view.vdo.duration) && hideDuration!==view.vdo._id">
                            {{millisToMinutesAndSeconds(view.vdo.duration)}}
                        </div>
                        <img :src="view.vdo.thumbnail" alt="">
                        <div class="absolute bottom-0 left-0 bg-red-600 h-1" v-if="view.vdo.last_watch" :style="{width:Math.round(view.vdo.last_watch.percentage) + `%`}"></div>
                    </div>
                   
                    <div class="flex p-3 items-center justify-start cursor-text">
                        <img :src="view.vdo.teacher.photo" class="h-10 rounded mr-3">
                        <div>
                            <div class="text-primary text-sm" :class="darkMode?'text-textSecondary':''">{{cutString(view.vdo.title,20)}}</div>
                            <div class="flex font-khmer_os text-xs opacity-50">
                                <div>{{view.vdo.teacher.name}}</div>
                                <div class="ml-7">{{ kFormatter(view.vdo.view) }} view</div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="float-right cursor-pointer">
                        
                                <div v-if="(view.vdo.is_favorite || isFavorite(view.vdo._id))" @click="removeMyFavorite(view.vdo._id)">
                                    <HeartIcon :fill="darkMode?`#ff3333`:`#c1272d`"/>
                                </div>
                                <div @click="addFavorite(view.vdo._id)" v-else>
                                    <HeartIcon fill="#D1D5DB"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End vdo-->
                <!--Ads-->
                <div class="relative" v-if="view.type ==='ads'" @click="viewAds(view)"
                     @mouseover="hideAndShowDuration(view.ads._id)"
                     @mouseleave="hideAndShowDuration('')">
                    <div class="absolute top-0 right-0 bg-white bg-opacity-50 p-1 text-sm">{{$t('1005')}}</div>
                    <div class="relative">
                        <div class="absolute z-30 w-full h-full flex justify-center items-center"
                             v-if="view.ads.banner.type ===1">
                            <video :src="playWhenOver(view.ads.banner.video)" autoplay="autoplay"
                                   class="flex justify-center items-center"
                                   controlsList="nodownload" v-if="hideDuration===view.ads._id" muted></video>
                        </div>
                        <img :src="view.ads.banner.thumbnail" alt="">
                    </div>
                    <div class="flex p-3 items-center justify-start">
                        <img :src="view.ads.logo" class="h-10 rounded mr-3">
                        <div>
                            <div class="text-primary text-sm" :class="darkMode?'text-textSecondary':''">{{view.ads.title}}</div>
                            <div class="flex font-khmer_os text-xs opacity-50">
                                <div>{{view.ads.company}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End ads-->
            </div>
        </div>
        <template v-if="list.length <= 0">
            <Empty></Empty>
        </template>
        <div v-if="showAds">
            <VideoADS :videoUrl="videoUrl" @closeAds="closeAds" @lastWatchVideo="lastWatchVideo($event)"></VideoADS>
        </div>
    </div>
</template>
<script>
import HeartIcon from "./../../components/HeartIcon.vue";
import Loading from "./../../components/Loading";
import Empty from "./../Component/Empty.vue";
import { mapState, mapActions } from "vuex";
import VideoADS from "./../Video/ads/VideoADS.vue";
import helper from "./../../helper/helper"
const {ipcRenderer} = require('electron')
export default {
  components: {
    HeartIcon,
    Loading,
    Empty,
    VideoADS
  },
  data() {
    return {
      showAds: false,
      hideDuration: "",
      videoUrl: "",
      id: ""
    };
  },
  computed: {
    ...mapState("setting", ["isHide","darkMode"]),
    ...mapState("home", ["list", "homeLoading"]),
    ...mapState('favorite', ['temporaryFavorites'])
  },
  methods: {
    ...mapActions("playVideo", ["stopWatch", "playVideo"]),
    ...mapActions('favorite', ['add','removeFavorite']),

    lastWatchVideo(event) {
      event.id = this.id;
      this.stopWatch(event);
    },
    cutString(text, limit){
      return helper.cutString(text, limit)
    },
    kFormatter(num){
      return helper.kFormatter(num)
    },
    isFavorite(id){
        return this.temporaryFavorites.filter(item => item === id).length
    },
    
    removeMyFavorite(id){
        this.removeFavorite(id).then(()=>{
            this.$store.commit('favorite/removeTemporaryFavorite',id)
            if(!this.isFavorite(id)){
                this.$store.commit("home/removeFavorite",id)
            }
           
        })
    },

    addFavorite(id){
        this.add(id).then(()=>{
            this.$store.commit('favorite/addTemporaryFavorite',id)
        })
    },

    hideAndShowDuration(id = "") {
      this.hideDuration = id;
    },
    millisToMinutesAndSeconds(millis) {
      if (millis !== undefined) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      }
      return false;
    },
    viewVideo(video) {
      this.id = video.vdo._id;
      this.playVideo(this.id);
      this.showAds = true;

      if(video.vdo.last_watch){
          this.$store.commit('playVideo/setLastWatched',video.vdo.last_watch.mark)
      }

      this.$store.commit("playVideo/getVideoUrl", video.vdo.video);
    },
    closeAds() {
      this.showAds = false;
    },
    playWhenOver(video) {
      if (typeof video === "object") {
        let len = video.length - 1;
        return video[len]["url"];
      }
      return false;
    },
    viewAds(video) {
      if(video.ads.banner.type ===1){
          this.id = video.ads._id;
          this.playVideo(this.id);
          this.showAds = true;
          this.$store.commit("playVideo/getVideoUrl", video.ads.banner.video);
          this.$store.commit('playVideo/setLastWatched',0)
      }else{
          ipcRenderer.send("openLink",video.ads.banner.url)
      }
    }
  }
};
</script>
<style>
.last-watch {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  outline: none;
  box-shadow: 0px 1px 10px black;
  cursor: pointer;
}
.last-watch::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 3px;
  height: 3px;
  background: #ff0e09;
  cursor: pointer;
}
</style>