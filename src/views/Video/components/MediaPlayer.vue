<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css'

export default {
  name: "VideoPlayer",
  props: {
    videoUrl: {
      default: () => null
    },
    poster: {
      default: () => null
    },
    options: {
      type: Object,
      default() {
        return {
          autoplay: false,
          poster: "",
          controls: true,
          fluid: true,
          aspectRatio:'16:9',
          sources: [
            {
              src: "",
              type: "video/mp4"
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    })
  },
  created() {
    this.options.sources[0].src = this.videoUrl
    this.options.poster = this.poster
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style>
.video-js .vjs-big-play-button {
  line-height: 1.9em;
  width: 2em;
  height: 2em;
  top: 45%;
  left: 45%;
  border: 0.06666em solid transparent !important;
  border-radius: 50%;
}
</style>