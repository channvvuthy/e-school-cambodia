<template>
  <div class="relative">
    <div
        @click="fullScreen"
        class="absolute z-40 right-4 top-4 w-6 h-6 flex items-center justify-center cursor-pointer fullscreen"
        style="background-color: rgba(43, 51, 63, 0.7)">
    </div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css'
import FullScreenIcon from "@/components/FullScreenIcon";

export default {
  name: "VideoPlayer",
  components: {
    FullScreenIcon
  },
  props: {
    videoUrl: {
      default: () => null
    },
    post: {
      type: Object,
      default: () => {
      }
    },
    options: {
      type: Object,
      default() {
        return {
          controlBar: {
            fullscreenToggle: false
          },
          autoplay: false,
          poster: "",
          controls: true,
          fluid: true,
          aspectRatio: '16:9',
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
  methods: {
    fullScreen() {
      this.$emit("fullScreen", this.post)
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    })
  },
  created() {
    this.options.sources[0].src = this.videoUrl
    this.options.poster = this.post.thumbnail.url
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

.fullscreen {
  font-family: VideoJS;
}

.fullscreen::before {
  color: #f3f3f3;
  content: "\f108";
  font-size: 20px;
}
</style>