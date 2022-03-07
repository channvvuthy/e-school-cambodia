<template>
  <div :style="{height: `${screenHeight}px`}">
    <div v-if="!isLive"
         :style="{height: `${videoOptions.height}px`}"
         :class="darkMode ? `` : `bg-white`"
         class="flex items-center justify-center h-full">
      <div class="relative cursor-pointer" @click="()=>{this.isLive = true}">
        <TVIcon :size="250" :fill="darkMode ? `#909090`: `#055174`">
        </TVIcon>
        <div class="absolute w-full flex items-center justify-center left-0 top-0 h-full">
          <img src="/eschool-cambodia.png" alt="logo" class="w-36 mt-6 mr-9">
        </div>
      </div>
    </div>
    <div v-else>
      <video-player :options="videoOptions"></video-player>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VideoPlayer from 'vue-vjs-hls'
import {mapState} from "vuex";
import TVIcon from "@/components/TVFillIcon";

VideoPlayer.config({
  hls: true       // default true
})

// use
Vue.use(VideoPlayer)
export default {
  components: {
    TVIcon
  },
  data() {
    return {
      isLive: false,
      screenHeight: 0,
      videoOptions: {
        height: 500,
        source: {
          type: 'application/x-mpegURL',
          src: 'http://stream.et-l.ink/hls/Ap6UwsAjKFgZA8ueacC4mAm2ScSrZk.m3u8',
          withCredentials: false
        },
        live: true
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  created() {
    this.screenHeight = screen.height
    this.videoOptions.height = screen.height - 220
  }

}
</script>