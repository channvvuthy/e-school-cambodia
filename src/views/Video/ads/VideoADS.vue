<template>
    <div class="fixed inset-0 overflow-y-auto font-khmer_os" style="z-index:53">
        <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-black" @click="closeAds"  @mouseover="()=>{this.showToolbar = false}"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-opacity-0  overflow-hidden  transform transition-all  sm:align-middle  w-7/12"
                 role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="flex justify-center items-center text-center py-10">
                    <div>
                        <div class="relative">
                            <div class="p-1 w-8 h-8 opacity-60 absolute rounded-full cursor-pointer right-0 -top-10 flex justify-center items-center"
                                 @click="closeAds">
                                <CloseIcon fill="#ffffff"></CloseIcon>
                            </div>
                            <div class="w-11/12 relative m-auto">
                                <div class="flex justify-center items-center bg-black bg-opacity-70 rounded py-1 px-2 absolute top-5 cursor-pointer z-50" v-if="showToolbar" @click="toggleFullScreen">
                                    <div class="border border-white opacity-80 m-1">
                                        <EnlargeIcon></EnlargeIcon>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute w-full h-full flex justify-center items-center" v-if="loading"><LoadingWhite></LoadingWhite></div>
                            <video autoplay  controlsList="nodownload" id="eVideo" class="m-auto w-full" ref="eVideo" @click="playPause()" poster="/poster-home.png"
                                   @timeupdate="timeUpdate()"
                                    @pause="pause()"
                                   @mouseover="()=>{this.showSound = false,this.showToolbar = true}"
                                   >
                                <source :src="url"/>
                            </video>
                            <div class="bg-black text-white rounded-md text-sm bg-opacity-70 h-10 flex justify-between px-5 items-center w-11/12 relative -top-14 m-auto" :class="showToolbar?'visible':'invisible'">
                                <button id="playPauseBtn" class="bg-transparent focus:outline-none opacity-80"
                                        @click="playPause()">
                                    <div v-if="showPlay"><PlayIcon ></PlayIcon></div>
                                    <PauseIcon v-else></PauseIcon>
                                </button>
                                <div class="px-5 opacity-80">
                                    <span id="currentTime"></span>
                                    <span id="currentDuration"></span>
                                </div>
                                <div class="flex-1 opacity-80 relative">
                                    <input type="range" min="0" max="100" id="seekSlider" value="0" step="1"
                                           ref="seekSlider"
                                           class="w-full seekSlider z-50"/>
                                    <div class="absolute w-full bg-white left-0" id="range"
                                         :style="{width:rangeSliderWidth+'%',top:10+'px',zIndex:'-1',height:'4px'}"></div>
                                </div>

                                <div class="px-5 0 cursor-pointer relative">
                                    <div class="opacity-80" @click="showSettingModal">
                                        <SettingIcon></SettingIcon>
                                    </div>
                                    <!--Setting-->
                                    <div class="bg-black absolute bottom-8 w-48 right-5 px-3 bg-opacity-70 rounded-md py-2"
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
                                    <div class="bg-black absolute bottom-8 w-48 right-5 bg-opacity-70 rounded-md pt-2 overflow-hidden"
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
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===0.25">&#10003;</span>0.25
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(0.5)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===0.5">&#10003;</span>
                                                0.5
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(0.75)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===0.75">&#10003;</span>
                                                0.75
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(1)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===1">&#10003;</span>
                                                {{$t('normal')}}
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(1.25)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===1.25">&#10003;</span>
                                                1.25
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(1.5)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===1.5">&#10003;</span>
                                                1.5
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(1.75)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===1.75">&#10003;</span>
                                                1.75
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                                                 @click="playbackRate(2)">
                                                <span class="text-base absolute left-5" v-if="defaultSpeed ===2">&#10003;</span>
                                                2
                                            </div>
                                        </div>
                                    </div>
                                    <!--End playback speed-->
                                    <!--Quality-->
                                    <div class="bg-black absolute bottom-8 w-48 right-5 bg-opacity-70 rounded-md pt-2 overflow-hidden"
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
                                                <span class="text-base absolute left-5" v-if="defaultQuality ===1">&#10003;</span>{{$t('auto')}}
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative" @click="changeVideoQuality(360)">
                                                <span class="text-base absolute left-5" v-if="defaultQuality ===360">&#10003;</span>360p
                                            </div>
                                            <div class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative" @click="changeVideoQuality(720)">
                                                <span class="text-base absolute left-5" v-if="defaultQuality ===720">&#10003;</span>720p
                                            </div>
                                        </div>
                                    </div>
                                    <!--End quality-->
                                </div>
                                <div class="relative">
                                    <div class="absolute h-40 w-16 bottom-0 -right-8 z-2" 
                                        @mouseover="()=>{ (this.showSetting || this.showQuality || this.showPlayback)?this.showSound= false:this.showSound= true}"
                                        @mouseout="()=>{this.showSound= false}"
                                        >
                                    </div>
                                    <div class="opacity-80 cursor-pointer z-40" @click="showSoundModal" @mouseover="()=>{this.showSound= true,this.showSetting= false}">
                                        <SoundIcon v-if="!muted"></SoundIcon>
                                        <MutedIcon :size="20" v-else></MutedIcon>
                                    </div>
                                    <div class="range-slider absolute -left-7 bottom-16 opacity-80"
                                         :class="showSound?'visible':'invisible'"
                                         @mouseover="()=>{this.showSound= true}">
                                        <input type="range" min="0" max="100" step="1" :value="defaultVolumeRange"
                                               id="volumn"
                                               class="cursor-pointer"
                                               @change="setVolume($event)">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CloseIcon from "./../../../components/CloseIcon";
import EnlargeIcon from "./../../../components/EnlargeIcon.vue";
import ChevronIcon from "./../../../components/ChevronIcon.vue";
import LoadingWhite from "./../../../components/LoadingWhite.vue"
import PlayIcon from "./../../MyCourse/components/media/PlayIcon.vue";
import PauseIcon from "./../../MyCourse/components/media/PauseIcon.vue";
import SettingIcon from "./../../MyCourse/components/media/SettingIcon.vue";
import SoundIcon from "./../../MyCourse/components/media/SoundIcon.vue";
import MutedIcon from "./../../MyCourse/components/media/MutedIcon.vue";
import helper from "./../../../helper/helper"
import { mapActions, mapState } from "vuex";
export default {
  components: {
    CloseIcon,
    LoadingWhite,
    PlayIcon,
    PauseIcon,
    SettingIcon,
    EnlargeIcon,
    SoundIcon,
    ChevronIcon,
    MutedIcon
  },
  props:{
    _id:{
      default:()=>{
        return ""
      }
    }
  },
  data() {
    return {
      loading: true,
      url: "",
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
      fullScreenBtn: null,
      showSetting: false,
      showPlayback: false,
      showQuality: false,
      defaultSpeed: 1,
      showSound: false,
      oldVolume: 0,
      showToolbar: false,
      defaultQuality: 720,
      deviceInfo:{
        deviceId:"",
        deviceName:"", 
        deviceOs:"",
        osVersion:"",
        appVersion:"",
        networkCode:"",
        internetSignal:"",
        lat:"",
        long:"",
        url:"",
        msg:"video_interrupting",
        _id:"",
      }
    };
  },
  computed: {
    ...mapState("playVideo", ["videoUrl", "defaultVolumeRange", "lastWatched"])
  },
  methods: {
    ...mapActions('video',['getWarning']),
    showQualityModal() {
      this.showQuality = true;
      this.showSetting = false;
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
    closeAds() {
      this.$emit("closeAds");
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
    addDeviceInfo(){
      this.deviceInfo.deviceId = helper.deviceId()
      this.deviceInfo.deviceName = helper.deviceName()
      this.deviceInfo.deviceOs = helper.deviceOs()
      this.deviceInfo.osVersion = helper.osVersion()
      this.deviceInfo.appVersion = process.env.VUE_APP_VERSION
      var networkInformation = navigator.connection
      this.deviceInfo.internetSignal = networkInformation.effectiveType
      this.deviceInfo.url = this.url
      this.deviceInfo._id = this._id
    },
    pause() {
      this.showPlay = true;
      this.lastWatchVideo();
    },

    lastWatchVideo() {
      let last_watch = {
        mark: this.vid.currentTime,
        duration: Math.round(this.vid.duration)
      };

      this.$emit("lastWatchVideo", last_watch);
    },
    playbackRate(rate) {
      this.defaultSpeed = rate;
      this.showPlayback = false;
      this.vid.playbackRate = rate;
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
        this.currentDuration.innerHTML = "/&nbsp;" + durmins + ":" + dursecs;
      }
    },
    getVideo() {
      let interval = setInterval(() => {
        if (document.getElementById("eVideo") !== null) {
          clearInterval(interval);
          this.vid = document.getElementById("eVideo");

          setTimeout(()=>{
            if(this.vid.readyState != 4){
              this.addDeviceInfo()
              this.getWarning(this.deviceInfo).then(()=>{
                alert(this.$i18n.t('video_interrupting'))
              })
              
            }
          },5000)
          
          this.vid.currentTime = this.lastWatched;
          this.currentTime = document.getElementById("currentTime");
          this.currentDuration = document.getElementById("currentDuration");
          this.seekSlider = document.getElementById("seekSlider");
          this.volumeSlider = document.getElementById("volumn");
          
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
              this.lastWatchVideo();
            },
            true
          );

          this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
            this.defaultVolumeRange
          }%, rgba(0, 0, 0, 0.5) ${this.defaultVolumeRange}%)`;
          this.vid.volume = this.volumeSlider.value / 100;
          this.setMute(this.volumeSlider.value);
        }
      }, 200);
    },
    changeVideoQuality(quality) {

      let refreshVideoQuality;
      if (quality === 1) {
        refreshVideoQuality = this.videoUrl
          .filter(item => item.quality === "auto")
          .map(item => item.url)[0];
      } else {
        refreshVideoQuality = this.videoUrl
          .filter(item => item.quality === `${quality}p`)
          .map(item => item.url)[0];
      }

      this.defaultQuality = quality;
      this.showQuality = false;
      this.url = refreshVideoQuality;
      
      if(this.vid.currentTime != 0){
          this.$store.commit("playVideo/setLastWatched",this.vid.currentTime)
      }

      this.vid.src = this.url
      this.vid.currentTime = this.lastWatched
    },
    setVolume(event) {
      this.vid.volume = this.volumeSlider.value / 100;
      this.oldVolume = this.volumeSlider.value;
      this.$store.commit(
        "playVideo/setDefaultVolumeRange",
        this.volumeSlider.value
      );
      this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
        event.target.value
      }%, rgba(0, 0, 0, 0.5) ${event.target.value}%)`;
      this.setMute(event.target.value);
    },
    setMute(value) {
      if (value === "0") {
        this.vid.muted = true;
        this.muted = true;
      } else {
        this.muted = false;
        this.vid.muted = false;
      }
    },
    showSoundModal() {
      if (this.oldVolume == 0) {
        return false;
      }
      if (this.muted) {
        this.vid.muted = false;
        this.muted = false;
        this.$store.commit("playVideo/setDefaultVolumeRange", this.oldVolume);
        this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
          this.oldVolume
        }%, rgba(0, 0, 0, 0.5) ${this.oldVolume}%)`;
      } else {
        this.vid.muted = true;
        this.muted = true;
        this.$store.commit("playVideo/setDefaultVolumeRange", 0);
        this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${0}%, rgba(0, 0, 0, 0.5) ${0}%)`;
      }
      // this.showSound = !this.showSound
    },
    singleVideo(video) {
      if (typeof video === "object") {
        let len = video.length - 1;
        return video[len]["url"];
      }
      return false;
    }
  },
  mounted() {
    this.getVideo();
  },
  created() {
    this.oldVolume = this.defaultVolumeRange;
    this.url = this.singleVideo(this.videoUrl);
  }
};
</script>
<style>
.seekSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2px;
  height: 2px;
  background: #ffffff;
}

.seekSlider {
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgb(255, 255, 255) 0%,
    rgb(151, 151, 151) 0%
  );
  outline: none;
  cursor: pointer;
}

#range:after {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  right: -3px;
  top: -4px;
}

#volumn {
  margin-top: 100px;
  transform: rotate(-90deg);
  -webkit-appearance: none;
  background: linear-gradient(
    90deg,
    rgb(33, 111, 219) 100%,
    rgba(0, 0, 0, 0.5) 100%
  );
  border-radius: 50px;
  outline: none;
  cursor: pointer;
  width: 70px;
}

#volumn::-webkit-slider-runnable-track {
  height: 8px;
}

#volumn::-webkit-slider-thumb {
  background: #ffffff;
  width: 16px;
  height: 16px;
  margin-top: -4px;
  -webkit-appearance: none;
  border-radius: 100%;
  
}
</style>