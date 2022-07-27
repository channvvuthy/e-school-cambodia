<template>
    <div class="relative">
        <div
                v-if="isFullScreen"
                @click="fullScreen"
                class="absolute z-40 right-4 top-4 w-6 h-6 flex items-center justify-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="#e4e6eb">
              <path d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z"/>
            </g>
          </svg>
        </div>
        <video ref="videoPlayer" class="video-js" @ended="ended"/>
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
            defaultAspectRatio: {
                default: () => '16:9'
            },
            isAutoPlay: {
                default: () => false
            },
            isFullScreen: {
                default: () => true
            },
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
            ended() {
                this.$emit("ended", this.post)
            },
            fullScreen() {
                this.player.pause()
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
            this.options.autoplay = this.isAutoPlay
            this.options.aspectRatio = this.defaultAspectRatio
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