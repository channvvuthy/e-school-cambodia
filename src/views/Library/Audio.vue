<template>
  <div>
    <div class="fixed  h-48 bottom-0 right-0 z-50 justify-center items-center flex t-shadow"
         :class="darkMode?`bg-secondary border-t border-button text-gray-300`:`bg-white`"
         :style="isHide?`width:100%`:`width:${mainWidth}px`">
      <div class="flex items-center justify-between w-full px-10">
        <div>
          <img :src="defaultAudio.thumbnail" class="max-h-36 rounded-md shadow-md">
        </div>
        <div class="text-xl ml-8" :class="darkMode?`text-gray-300`:``">
          {{ defaultAudio.title }}
        </div>
        <!-- Toolbox -->
        <div class="flex items-center justify-between w-48 ml -8 cursor-pointer">
          <div><input type="range" id="volumn" class="absolute invisible"/></div>
          <div class="transform rotate-180" @click="previousAudio">
            <PreviousIcon :fill="darkMode?`#E5E7EB`:`#055174`"></PreviousIcon>
          </div>
          <div v-if="!showPlay" @click="playPause">
            <PlayIcon :fill="darkMode?`#E5E7EB`:`#055174`"></PlayIcon>
          </div>
          <div v-else @click="playPause">
            <PauseIcon :fill="darkMode?`#909090`:`#055174`"></PauseIcon>
          </div>
          <div @click="nextAudio">
            <NextIcon :fill="darkMode?`#E5E7EB`:`#055174`"></NextIcon>
          </div>
          <div @click="audioList" class="transform" :class="showAudioList?`rotate-180`:``">
            <RoundUpIcon :fill="darkMode?`#E5E7EB`:`#055174`"></RoundUpIcon>
          </div>
        </div>
        <div class="flex-1 w-full ml-8 relative">
          <div class="absolute h-1 absolute left-0 z-10" :style="`width:${valueSlider}%`"
               :class="darkMode?`bg-gray-300`:`bg-primary`" style="top:14px;"></div>
          <input type="range" class="w-full slider z-50" min="0" max="100" value="10" step="1" v-model="valueSlider"
                 :class="darkMode?`bg-gray-300 slider-dark`:`slider-none-dark bg-secondary`" id="seekSlider">
          <div class="flex justify-between absolute w-full mt-2 ">
            <span id="currentTime"></span>
            <span id="currentDuration"></span>
          </div>
        </div>

        <div class="ml-8 relative">
          <div v-if="(muted == false && defaultVolumeRange > 0)" class="cursor-pointer"
               @mouseover="() => {this.showVolume = true}"
               @mouseout="() => {this.showVolume = false}">
            <SoundIcon :fill="darkMode?`#E5E7EB`:`#055174`"></SoundIcon>
          </div>
          <div v-else :size="20" class="cursor-pointer"
               @mouseover="() => {this.showVolume = true}"
               @mouseout="() => {this.showVolume = false}">
            <MutedIcon :fill="darkMode?`#E5E7EB`:`#055174`"></MutedIcon>
          </div>
          <div class="w-20 h-20  absolute -left-8 flex justify-start items-center -top-20 transform -rotate-90"
               @mouseover="()=>{this.showVolume = true}"
               @mouseout="()=>{this.showVolume = false}">
            <input type="range" min="0" max="100" step="1" id="volumeSlider"
                   v-model="defaultVolumeRange"
                   class="volumeSlider w-14 relative left-5"
                   :class="showVolume?`visible ${darkMode?`volume-slider-dark`:`volume-slider-light`}`:`invisible`"
                   @change="setVolume">
          </div>

        </div>
        <div class="ml-8 cursor-pointer" v-if="is_favorite">
          <div v-if="details.is_favorite" @click="removeFavorite(details.book._id)">
            <FavoriteFill :fill="darkMode?`#E5E7EB`:`#c0272d`"/>
          </div>
          <div @click="addFavorite(details.book._id)" v-else>
            <FavoriteIcon :fill="darkMode?`#E5E7EB`:`#055174`"/>
          </div>
        </div>
      </div>
      <!-- Audio -->
      <audio id="audio-library" class="hidden" controls autoplay @timeupdate="timeUpdate()" @ended="onEnded()">
        <source :src="audioUrl" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>
    <!-- List -->
    <div
        class="fixed w-full h-full right-0 bottom-0 z-50 flex flex-col px-10 items-center bg-black bg-opacity-90 justify-center"
        v-if="showAudioList">
      <div class="w-2/5 rounded-2xl shadow px-3" :class="darkMode?`bg-secondary text-gray-300`:`bg-white `">
        <div class="flex  py-7 flex justify-center items-center relative text-sm">
          <div>{{ details.book.title }}</div>
          <div class="absolute top-3 right-1 cursor-pointer" @click="()=>{this.showAudioList = false}">
            <CloseIcon :fill="darkMode?`#ffffff`:`#000000`"></CloseIcon>
          </div>
        </div>
        <div class="max-h-96 overflow-y-scroll">
          <div class="flex items-center justify-between py-4 px-5 cursor-pointer border-t"
               :class="darkMode?`border-button`:``" v-for="(ad, index) in details.list" :key="index"
               @click="selectingAudio(ad,index)">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full flex justify-center items-center"
                   :class="darkMode?`bg-pass`:`bg-primary`">
                <HeadphoneIcon fill="#ffffff" :size="20"></HeadphoneIcon>
              </div>
              <div class="ml-5">{{ ad.title }}</div>
            </div>
            <div class="h-5 w-5 rounded-full flex justify-center items-center border"
                 :class="order !== index?`border ${darkMode?``:`border-button`}`:``">
              <div class="w-5 h-5 rounded-full flex items-center justify-center" v-if="!canWatch(ad)">
                <CloseIcon :width="15" :fill="darkMode?`#FFF`:`#000`"></CloseIcon>
              </div>
              <template v-else>
                <div class="w-5 h-5">
                  <div class="w-5 h-5 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"
                       v-if="order === index"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
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
import MutedIcon from "./../../views/MyCourse/components/media/MutedIcon.vue"
import FavoriteIcon from "./../../components/FavoriteIcon.vue";
import FavoriteFill from "./../../components/FavoriteFill.vue";
import CloseIcon from "./../../components/CloseIcon.vue"
import VueHorizontal from 'vue-horizontal';
import Play from "./../../views/MyCourse/components/media/PlayIcon.vue"
import HeadphoneIcon from "./../../components/HeadphoneIcon.vue"


export default {
  components: {
    PlayIcon,
    PauseIcon,
    NextIcon,
    PreviousIcon,
    RoundUpIcon,
    SoundIcon,
    FavoriteIcon,
    FavoriteFill,
    CloseIcon,
    VueHorizontal,
    Play,
    HeadphoneIcon,
    MutedIcon

  },
  props: {
    is_favorite: {
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
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
      volume: 0,
      showSound: true,
      showPlay: true,
      valueSlider: 0,
      showAudioList: false,
      mainTitle: '',
      showVolume: false,
      oldVolume: 0

    }
  },
  computed: {
    ...mapState('library', ['details']),
    ...mapState('setting', ['darkMode', 'isHide']),
    defaultVolumeRange: {
      get() {
        return this.$store.state.playVideo.defaultVolumeRange;
      },
      set(value) {
        this.$store.commit("playVideo/setDefaultVolumeRange", value);
      }
    }

  },
  methods: {
    ...mapActions('favorite', ['addFavoriteBook', 'removeFavoriteBook']),
    defaultSound() {
      this.audio.volume = this.defaultVolumeRange / 100;
    },
    addFavorite(id) {
      this.addFavoriteBook(id).then(() => {
        this.$store.commit("library/addFavorite", id)
      })
    },
    removeFavorite(id) {
      this.removeFavoriteBook(id).then(() => {
        this.$store.commit("library/removeFavorite", id)
      })
    },
    setVolume(event) {
      this.audio.volume = this.volumeSlider.value / 100;
      this.oldVolume = this.volumeSlider.value;
      if (this.audio.volume === 0) {
        this.muted = true
      } else {
        this.muted = false
      }

      this.$store.commit(
          "playVideo/setDefaultVolumeRange",
          this.volumeSlider.value
      );
      this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${
          event.target.value
      }%, rgba(0, 0, 0, 0.5) ${event.target.value}%)`;


    },
    initialWidth() {
      this.myInterval = setInterval(() => {
        let el = document.getElementById("main")
        if (el.clientWidth) {
          this.mainWidth = el.clientWidth
          clearInterval(this.myInterval)
        }
      }, 100)
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
    audioList() {
      this.showAudioList = !this.showAudioList
    },
    pause() {
      this.showPlay = true;
    },
    onEnded() {
      this.showPlay = false
      this.nextAudio()

    },
    timeUpdate() {
      let nt = Math.floor(this.audio.currentTime * (100 / this.audio.duration));
      let color = `linear-gradient(90deg, rgb(15, 60, 122) ${nt}%, rgb(214,214,214) ${nt}%)`
      if (this.darkMode) {
        color = `linear-gradient(90deg, rgb(255, 255, 10) ${nt}%, rgb(214,214,214) ${nt}%)`
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

    },
    getVideo() {
      let interval = setInterval(() => {
        if (document.getElementById("audio-library") !== null) {
          clearInterval(interval);
          this.audio = document.getElementById("audio-library");
          this.currentTime = document.getElementById("currentTime");
          this.currentDuration = document.getElementById("currentDuration");
          this.seekSlider = document.getElementById("seekSlider");
          this.volumeSlider = document.getElementById("volumeSlider")
          this.seekSlider.addEventListener(
              "input",
              event => {
                let seekTo = this.audio.duration * (event.target.value / 100);
                let color = `linear-gradient(90deg, rgb(15, 60, 122) ${
                    event.target.value
                }%, rgb(151, 151, 151) ${event.target.value}%)`;

                if (this.darkMode) {
                  color = `linear-gradient(90deg, rgb(90, 162, 10) ${event.target.value}%, rgb(214,214,214) ${event.target.value}%)`
                }

                this.seekSlider.style.background = color;
                this.audio.currentTime = seekTo;
              },
              true
          );
        }
        this.volumeSlider.style.background = `linear-gradient(90deg, rgb(33, 111, 219) ${this.defaultVolumeRange}%, rgba(0, 0, 0, 0.5) ${this.defaultVolumeRange}%)`;
        this.defaultSound();
      }, 200);
    },
    selectingAudio(audio, order) {
      if (!this.canWatch(audio)) {
        return false;
      }
      this.audioUrl = audio.filename
      this.audio.src = this.audioUrl
      this.defaultAudio = audio
      this.showPlay = true
      this.order = order
      this.showAudioList = false
    },
    nextAudio() {
      if (this.order < this.details.list.length - 1) {
        this.order++
        let audio = this.details.list[this.order]
        if (!this.canWatch(audio)) {
          return false;
        }
        this.audioUrl = audio.filename
        this.audio.src = this.audioUrl
        this.defaultAudio = audio
        this.showPlay = true
      }
    },
    previousAudio() {
      if (this.order > 0) {
        this.order--
        let audio = this.details.list[this.order]

        if (!this.canWatch(audio)) {
          return false;
        }

        this.audioUrl = audio.filename
        this.audio.src = this.audioUrl
        this.defaultAudio = audio
        this.showPlay = true
      }
    },
    initialVolume() {
      if (this.defaultVolumeRange <= 0) {
        this.muted = true
      }
    },
    initialAudio() {
      this.defaultAudio = this.details.list[this.order]
      this.audioUrl = this.defaultAudio.filename
      this.mainTitle = this.details.book.title
    },
    canWatch(audio) {
      if ((this.details.is_buy == 1 || audio.free_watch == 1)) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    if (this.details.list.length) {
      this.getVideo()
    }
  },
  created() {
    this.initialVolume()
    this.initialWidth()
    this.initialAudio()

    window.addEventListener('click', () => {
      if (this.audio != null) {
        this.seekSlider.value
        let color = `linear-gradient(90deg, rgb(15, 60, 122) ${
            this.seekSlider.value
        }%, rgb(151, 151, 151) ${this.seekSlider.value}%)`;

        if (this.darkMode) {
          color = `linear-gradient(90deg, rgb(90, 162, 10) ${this.seekSlider.value}%, rgb(214,214,214) ${this.seekSlider.value}%)`
        }

        this.seekSlider.style.background = color;
      }
    }, false)

  }
}
</script>
<style>
.t-shadow {
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

.volumeSlider {
  -webkit-appearance: none;
  height: 8px;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;
  border-radius: 50px;
  background: linear-gradient(90deg, rgb(33, 111, 219) 0%, rgba(0, 0, 0, 0.5) 0%);

}

.volume-slider-dark::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: #ffffff !important;
  cursor: pointer;
  border-radius: 50%;
}

.volume-slider-light::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: #055174;
  cursor: pointer;
  border-radius: 50%;
}

.slider-dark {
  background: linear-gradient(90deg, rgb(90, 162, 10) 10%, rgb(214, 214, 214) 0%);
}

.slider-none-dark {
  background: linear-gradient(90deg, rgb(15, 60, 122) 10%, rgb(214, 214, 214) 0%);
}

.slider-none-dark::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #055174;
  cursor: pointer;
  border-radius: 50%;
}

.slider-dark::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #ffffff;
  cursor: pointer;
  border-radius: 50%;
}
</style>