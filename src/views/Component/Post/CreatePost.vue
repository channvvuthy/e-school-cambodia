<template>
  <div :class="className">
    <div
        class="shadow rounded-xl w-2/5"
        :class="darkMode ? `bg-secondary`: `bg-white`"
    >
      <div
          :class="darkMode ?`border-b border-facebook`: `border-b`"
          class="h-14 flex items-center justify-between px-5 text-lg">


        <div class="cursor-pointer" @click="()=>{this.$emit('dismissPost')}">
          <CloseIcon :fill="darkMode ? `#909090` : `#000000`"></CloseIcon>
        </div>
        <div class="w-full text-center">
          <div>
            {{ $t('create_post') }}
          </div>
        </div>
        <button @click="post" :disabled="loading" class="outline-none bg-transparent flex items-center">
          <div v-if="loading">
            <LoadingWhite></LoadingWhite>
          </div>
          <div class="cursor-pointer" :class="darkMode? `` : `text-primary`" v-else>
            {{ $t('post') }}
          </div>
        </button>

      </div>

      <!-- Body -->
      <div class="p-5">
        <div class="flex space-x-5 mb-5">
          <Avatar :size="16" :avatar-url="stProfile.photo"></Avatar>
          <div>
            <div class="flex space-x-1 items-center">
              <span>{{ stProfile.first_name }}</span>
              <span>{{ stProfile.last_name }}</span>
            </div>
            <div>
              <div
                  style="border-radius: 4px;"
                  :class="darkMode ? `border-button` : `border-roundBorder` "
                  class="flex items-center border px-2 mt-1 text-sm py-1 justify-between cursor-pointer space-x-2">
                <span class="capitalize">{{ $t('category') }}</span>
                <div>
                  <ChevronDown :fill="darkMode ? `#909090` : `#000000`" :size="15"></ChevronDown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-y-scroll preview" style="height: 24rem;">
          <textarea
              v-model="payload.caption"
              :placeholder="$t('say_something')"
              class="w-full outline-none bg-transparent" style="resize: none"></textarea>
          <div class="relative flex items-center justify-center">
            <!-- Picture -->
            <template v-if="singlePhotoPreview">
              <div
                  @click="clearData"
                  :class="darkMode ? `bg-secondary` : `bg-gray-50`"
                  class="absolute w-8 h-8 rounded-full flex items-center justify-center shadow cursor-pointer right-2 top-2">
                <CloseIcon :fill="darkMode ? `#909090`: `#000000`"></CloseIcon>
              </div>
              <img :src="singlePhotoPreview" alt="picture">
            </template>


            <!-- Multiple picture -->
            <template v-if="multiPhotoPreview.length">
              <div class="flex flex-wrap">
                <div v-for="(picture, index) in multiPhotoPreview"
                     class="relative"
                     :class="index === 0 ? `w-full`: `w-1/2`"
                     :key="index">
                  <img :src="`file://${picture}`" :alt="index">
                  <div
                      @click="removePicture(index)"
                      :class="darkMode ? `bg-secondary` : `bg-gray-50`"
                      class="w-6 h-6 flex items-center justify-center absolute right-2 top-2 rounded-full cursor-pointer z-50 shadow">
                    <CloseIcon :fill="darkMode ? `#909090`: `#000000`" :width="20"></CloseIcon>
                  </div>
                </div>
              </div>
            </template>

            <!-- Preview video -->
            <template v-if="videoPreview">
              <div class="relative" @mouseenter="()=>{this.isVideo = true}" @mouseleave="()=>{this.isVideo = false}">
                <video id="video">
                  <source :src="`file://${videoPreview}`">
                </video>
                <div class="w-full h-full flex items-center justify-center absolute z-40 top-0 left-0" v-if="isVideo">
                  <div
                      class="h-14 text-white w-14 rounded-full flex items-center justify-center bg-black bg-opacity-50 border-white border-4 shadow cursor-pointer">
                    <div class="ml-2" v-if="!isPlay" @click="playPause()">
                      <Next fill="#FFF" :size="30"></Next>
                    </div>
                    <div @click="playPause()" v-else>
                      <Pause fill="#FFF" :size="30"></Pause>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="h-24 border-t flex items-center space-x-10 px-5"
           :class="darkMode ? `border-facebook`: ``"
      >
        <template v-if="isBackground"></template>
        <template v-else>
          <div
              @click="()=>{this.isCamera = true}"
              class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              :class="darkMode ? `bg-button`: `bg-softGray`"
          >
            <CameraIcon :width="20" :height="22" :fill="darkMode ? `#909090` : `#055174`"></CameraIcon>
          </div>
          <div
              class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              :class="darkMode ? `bg-button`: `bg-softGray`"
          >
            <div @click="()=>{this.$refs['multiple-photo'].click()}">
              <ImageIcon :size="20" :fill="darkMode ? `#909090` : `#055174`"></ImageIcon>
            </div>
            <input type="file" class="hidden" multiple accept="image/*" ref="multiple-photo" @change="selectFiles">
          </div>
          <div
              class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              :class="darkMode ? `bg-button`: `bg-softGray`"
          >
            <div
                @click="()=>{
                this.videoPreview = null;
                this.$refs['upload-video'].value = null;
                this.$refs['upload-video'].click()}">
              <PostVideoIcon :fill="darkMode ? `#909090` : `#055174`"></PostVideoIcon>
            </div>
            <input type="file" accept="video/*" ref="upload-video" class="hidden" @change="selectVideo">
          </div>
          <div class="w-10 h-10 rounded-full flex items-center justify-center  text-sm fot-semibold cursor-pointer"
               :class="darkMode ? `bg-button text-textSecondary `: `bg-softGray text-primary`">
            Live
          </div>
          <div
              @click="()=>{this.isBackground = true}"
              class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              :class="darkMode ? `bg-button`: `bg-softGray`"
          >
            <BackgroundIcon :fill="darkMode ? `#909090` : `#055174`"></BackgroundIcon>
          </div>
        </template>
      </div>
    </div>
    <template v-if="isCamera">
      <Camera @closeCamera="()=>{this.isCamera = false}" @pictureTaken="pictureTaken($event)"></Camera>
    </template>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";
import Avatar from "@/Avatar";
import CameraIcon from "@/components/CameraIcon";
import ImageIcon from "@/components/ImageIcon";
import PostVideoIcon from "@/components/PostVideoIcon";
import ChevronDown from "@/views/MyCourse/components/Chevron";
import BackgroundIcon from "@/components/BackgroundIcon";
import mode from "@/mixins/mode";
import Camera from "@/views/Component/Post/Camera";
import LoadingWhite from "@/components/LoadingWhite";
import Next from "@/views/Component/Post/Next";
import Pause from "@/views/Component/Post/Pause";

const payload = new FormData()

export default {
  name: "CreatePost",
  components: {
    Pause,
    Next,
    BackgroundIcon,
    ChevronDown,
    PostVideoIcon,
    ImageIcon,
    CameraIcon,
    Avatar,
    CloseIcon,
    Camera,
    LoadingWhite
  },
  data() {
    return {
      isBackground: false,
      vid: null,
      isVideo: false,
      isPlay: false,
      singlePhotoPreview: null,
      multiPhotoPreview: [],
      videoPreview: null,
      selectedFiles: [],
      loading: false,
      isCamera: false,
      payload: {
        caption: null,
        type: 1,
        photo: [],
      }
    }
  },
  mixins: [mode],
  methods: {
    ...mapActions('upload', ['singleUpload', 'multiUpload']),
    ...mapActions('social', ['postSocial']),
    removePicture(indexed) {
      this.multiPhotoPreview = this.multiPhotoPreview.filter((item, index) => {
        return index !== indexed
      })

      this.selectedFiles = this.selectedFiles.filter((item, index) => {
        return index !== indexed
      })
    },
    playPause() {
      this.vid = document.getElementById("video")
      if (this.vid.paused) {
        this.vid.play();
        this.isPlay = true;
      } else {
        this.vid.pause();
        this.isPlay = false;
      }
    },
    selectVideo(e) {
      if (e.target.files.length) {
        this.videoPreview = e.target.files[0].path
        this.multiPhotoPreview = []
        this.singlePhotoPreview = null
      }

    },
    selectFiles(e) {
      if (e.target.files.length)
        this.clearData()

      for (let i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i]
        this.multiPhotoPreview.push(file.path)
        this.selectedFiles.push(file)
      }
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: mime});
    },
    post() {
      this.loading = true
      if (this.singlePhotoPreview) {
        this.singleUpload(payload).then(res => {
          this.singlePhotoPreview = null
          if (res.data && res.data.url) {
            let photo = {
              url: res.data.url,
              width: res.data.width,
              height: res.data.height
            }
            payload.delete("photo")
            this.payload.photo.push(photo)
            this.postSocial(this.payload).then(() => {
              this.loading = false
            })
          }
        })
      }

      if (this.multiPhotoPreview.length) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          payload.append("photo", this.selectedFiles[i])
        }

      }
    },
    clearData() {
      this.singlePhotoPreview = null
      this.selectedFiles = []
      this.multiPhotoPreview = []
      this.payload.photo = null
      this.videoPreview = null
    },
    pictureTaken(picture) {
      this.clearData()
      this.payload.type = 2
      this.singlePhotoPreview = picture
      payload.append("photo", this.dataURLtoBlob(picture))
      this.isCamera = false
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile'])
  }
}
</script>
<style>
.preview {
  scrollbar-width: none
}

.preview::-webkit-scrollbar {
  display: none;
}
</style>