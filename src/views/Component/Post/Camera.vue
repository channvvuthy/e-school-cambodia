<template>
    <div :class="className">
        <div
                style="min-height: 28rem;"
                class="shadow rounded-xl w-2/5"
                :class="darkMode ? `bg-secondary`: `bg-white`">

            <div class="flex items-center justify-center flex-col">
                <div class="h-14 flex items-center w-full px-5"
                     :class="darkMode ?`border-b border-facebook`: `border-b`">
                    <div class="cursor-pointer" @click="closeCamera">
                        <CloseIcon :fill="darkMode ? `#909090` : `#000000`"/>
                    </div>
                    <div class="w-full text-center text-lg">
                        {{ $t('take_photo') }}
                    </div>
                </div>
            </div>

            <div class="p-5">
                <div v-if="loading" class="flex items-center justify-center">
                    <LoadingWhite></LoadingWhite>
                </div>
                <div :class="loading ? `hidden` : ``">
                    <video ref="video" @canplay="initCanvas()">Stream unavailable</video>
                    <div class="flex justify-end items-center">
                        <button @click="takePicture"
                                class="mt-5 outline-none py-3 px-4 rounded shadow-lg flex justify-center items-center space-x-2"
                                :class="darkMode ? `bg-button`: `bg-primary text-white`">
                            <CameraIcon :fill="darkMode ? `#909090` : `#FFFFFF`"/>
                            <span>{{ $t('take_photo') }}</span>
                        </button>
                    </div>
                    <canvas ref="canvas" style="display: none"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mode from "@/mixins/mode";
    import {mapState} from "vuex";
    import CloseIcon from "@/components/CloseIcon";
    import CameraIcon from "@/components/CameraIcon";
    import Video from "@/views/Video/Video";
    import LoadingWhite from "@/components/LoadingWhite";

    export default {
        components: {
            Video,
            CameraIcon,
            CloseIcon,
            LoadingWhite
        },
        mixins: [mode],
        computed: {
            ...mapState('setting', ['darkMode'])
        },
        data() {
            return {
                video: null,
                canvas: null,
                loading: false
            }
        },
        mounted() {
            this.video = this.$refs.video
            this.canvas = this.$refs.canvas
            this.startCapture()
        },
        methods: {

            stopCameraStream() {
                let tracks = this.$refs.video.srcObject.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });

                this.video.srcObject = null
            },
            closeCamera() {
                this.$emit("closeCamera")
                this.stopCameraStream()
            },
            startCapture() {
                this.loading = true
                navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
                    this.loading = false
                    this.video.srcObject = stream
                    this.video.play()
                }).catch(err => {
                    console.log(err)
                })
            },
            initCanvas() {
                this.canvas.setAttribute('width', this.video.videoWidth)
                this.canvas.setAttribute('height', this.video.videoHeight)
            },
            takePicture() {
                let context = this.canvas.getContext("2d")
                context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
                this.stopCameraStream()
                this.$emit("pictureTaken", this.canvas.toDataURL("image/png"))
            }
        },
    }
</script>