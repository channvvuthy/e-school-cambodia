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

          <div v-if="loading" class="relative">
            {{ progress }}%
          </div>
          <div class="cursor-pointer" :class="darkMode? `` : `text-primary`" v-else>
            {{ $t('post') }}
          </div>
        </button>
      </div>

      <div class="bg-primary h-2"
           v-if="loading"
           :style="{width:`${progress}%`}">
      </div>

      <!-- Body -->
      <div>
        <div class="flex space-x-5 mb-5 m-5">
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

        <div class="overflow-y-scroll preview relative pb-5" style="height: 26rem;">
          <div v-if="isBackground">
            <div class="h-full w-full absolute left-0 top-0 pb-5">
              <div class="h-full w-full flex items-center justify-center bg-cover bg-center overflow-y-scroll p-5"
                   :style="{backgroundImage: `url(${backgroundPhoto})`}"
                   @click="()=>{this.$refs.content.focus()}"

              >
                <img :src="backgroundPhoto" id="image" class="hidden">
                <div contenteditable="true" :data-ph="$t('say_something')"

                     @keyup="onKeyup"
                     ref="content"
                     :style="{color:`${color}`}"
                     class="outline-none text-lg">
                </div>

              </div>
            </div>
            <div class="h-5"></div>
          </div>
          <div class="px-5" v-else>
          <textarea
              ref="caption"
              v-model="payload.caption"
              :placeholder="$t('say_something')"
              @input="resize($event)"
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
                <div class="container" @mouseleave="()=> {this.currentHoverPhoto = null}">
                  <figure v-for="(picture, index) in multiPhotoPreview"
                          @mouseover="activeRemove(index)"
                          class="relative cursor-pointer"
                          :class="((index === 0 && multiPhotoPreview.length === 1) || (index === 0 && multiPhotoPreview.length > 2)) ? `span-2` : ``">
                    <img :src="`file://${picture}`" :alt="index" @click="previewPhoto(picture)"/>
                    <div
                        v-if="currentHoverPhoto === index"
                        @click="removePicture(index)"
                        :class="darkMode ? `bg-secondary` : `bg-gray-50`"
                        class="w-8 h-8 flex items-center justify-center absolute right-2 top-2 rounded-full cursor-pointer
                      z-50 shadow">
                      <CloseIcon :fill="darkMode ? `#909090`: `#000000`"></CloseIcon>
                    </div>
                  </figure>
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
      </div>

      <!-- Footer -->
      <div class="h-24 border-t flex items-center space-x-10 px-5"
           :class="darkMode ? `border-facebook`: ``"
      >
        <template v-if="isBackground">
          <div class="flex overflow-x-scroll preview space-x-3 w-full flex-nowrap">
            <div class="h-16 w-16">
              <div class="cursor-pointer flex items-center justify-center h-16 w-16 rounded-full"
                   :class="darkMode ? `bg-black` : `bg-none text-iconColor`" @click="closeBackground">None
              </div>
            </div>
            <div v-for="(bg,index) in background" :key="index"
                 class="h-16 w-16"
            >
              <div
                  @click="selectedBackground(index)"
                  :class="(backgroundActive === index) ? `border-primary border-4`: ``"
                  class="bg-cover bg-center cursor-pointer flex items-center justify-center h-16 w-16 rounded-full"
                  :style="{backgroundImage:`url(${bg.photo})`}"
              >

              </div>
            </div>
            <div class="h-16 w-16">
              <div class="cursor-pointer flex items-center justify-center h-16 w-16 rounded-full"
                   :class="darkMode ? `bg-primary text-gray-300` : `bg-more`">More
              </div>
            </div>

          </div>
        </template>
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
              @click="()=>{this.$refs['multiple-photo'].click()}"
          >
            <div>
              <ImageIcon :size="20" :fill="darkMode ? `#909090` : `#055174`"></ImageIcon>
            </div>
            <input type="file" class="hidden" multiple accept="image/*" ref="multiple-photo" @change="selectFiles">
          </div>
          <div
              class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              :class="darkMode ? `bg-button`: `bg-softGray`"
              @click="()=>{
                this.videoPreview = null;
                this.$refs['upload-video'].value = null;
                this.$refs['upload-video'].click()}"
          >
            <div>
              <PostVideoIcon :fill="darkMode ? `#909090` : `#055174`"></PostVideoIcon>
            </div>
            <input type="file" accept="video/*"
                   @click="resetVideo"
                   ref="upload-video" class="hidden"
                   @change="selectVideo">
          </div>
          <div class="w-10 h-10 rounded-full flex items-center justify-center  text-sm fot-semibold cursor-pointer"
               :class="darkMode ? `bg-button text-textSecondary `: `bg-softGray text-primary`">
            Live
          </div>
          <div
              @click="showBackground"
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
    <template v-if="isMessage">
      <Message :message="$t('limit_photo')" @closeMessage="()=>{this.isMessage = false}"></Message>
    </template>
    <template v-if="isPreviewPhoto">
      <PreviewPhoto :img-url="imgUrl" @closeIcon="()=>{this.isPreviewPhoto = false}"></PreviewPhoto>
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
import FastAverageColor from "fast-average-color";
import Message from "@/components/Message";
import PreviewPhoto from "@/components/PreviewPhoto";

const fac = new FastAverageColor();

const payload = new FormData()

export default {
  name: "CreatePost",
  components: {
    PreviewPhoto,
    Message,
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
      canPost: false,
      isPreviewPhoto: false,
      imgUrl: null,
      isMessage: false,
      currentHoverPhoto: null,
      isBackground: false,
      backgroundActive: 0,
      backgroundPhoto: null,
      backgroundColor: "",
      color: "",
      p: 1,
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
        background: null,
        type: 1,
        photo: [],
      }
    }
  },
  mixins: [mode],
  methods: {
    ...mapActions('upload', ['singleUpload', 'multiUpload', 'videoUpload']),
    ...mapActions('social', ['postSocial']),
    ...mapActions('background', ['getBackground', 'getMoreBackground']),
    resize(e) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
      if (this.payload.caption) {
        this.canPost = true
      }
    },
    previewPhoto(picture) {
      this.isPreviewPhoto = true
      this.imgUrl = `file://${picture}`
    },
    activeRemove(index) {
      this.currentHoverPhoto = index
    },
    lightBoxGalleryClass(index) {
      if (index === 0) {
        if (this.multiPhotoPreview.length === 1) {
          return 'w-full rounded-md'
        } else {
          return 'w-full rounded-t-md'
        }
      }
      return 'w-1/2'
    },
    closeBackground() {
      this.isBackground = false
      this.payload.background = null
    },
    onKeyup(e) {
      this.payload.caption = e.target.innerText
      this.canPost = true
    },
    selectedBackground(index = 0) {
      this.backgroundActive = index
      this.payload.background = this.background[index]._id
      this.backgroundPhoto = this.background[index].photo
      setTimeout(() => {
        fac.getColorAsync(document.querySelector('#image'))
            .then(color => {
              this.backgroundColor = color.rgba
              this.color = color.isDark ? '#fff' : '#000';
            }).catch(error => null);
        this.$refs.content.focus()
        if (this.payload.caption) {
          this.$refs.content.innerText = this.payload.caption
        }
      }, 100)
    },
    showBackground() {
      this.isBackground = true
      this.deletePayload()
      this.resetVideo()
      this.videoPreview = null
      this.singlePhotoPreview = null
      this.selectedBackground()
    },
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
    resetVideo() {
      payload.delete("video")
    },
    selectVideo(e) {
      if (e.target.files.length) {
        this.deletePayload()
        this.videoPreview = e.target.files[0].path
        payload.append("video", e.target.files[0])
        this.multiPhotoPreview = []
        this.singlePhotoPreview = null
        this.canPost = true
      }

    },
    selectFiles(e) {
      if (e.target.files.length)
        this.clearData()
      this.resetVideo()
      this.canPost = true

      if (e.target.files.length > 10) {
        this.isMessage = true
        return
      }

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
    closeCreate() {
      this.$emit("closeCreate")
    },
    post() {
      if (!this.canPost) {
        return
      }
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
            this.payload.photo = photo

            this.postSocial(this.payload).then(() => {
              this.loading = false
              this.resetCaption()
              this.closeCreate()
            })

          }
        })
      }

      if (this.multiPhotoPreview.length > 0) {
        this.deletePayload()
        for (let i = 0; i < this.selectedFiles.length; i++) {
          payload.append("photo", this.selectedFiles[i])
        }
        this.multiUpload(payload).then(res => {
          this.payload.type = 2
          this.payload.photo = res.data
          this.postSocial(this.payload).then(res => {
            console.log(res)
            this.loading = false
            this.resetCaption()
            this.closeCreate()
          })
        })

      }

      if (this.videoPreview) {
        this.payload.type = 3
        this.videoUpload(payload).then(res => {
          this.payload['video'] = {url: res.data.url}
          this.postSocial(this.payload).then(() => {
            this.loading = false
            this.resetCaption()
            this.closeCreate()
          })
        })

      }

      if (this.isBackground) {
        this.payload.type = 1
        this.postSocial(this.payload).then(() => {
          this.loading = false
          this.resetCaption()
          this.closeCreate()
        })
      }


      if (!this.singlePhotoPreview && !this.multiPhotoPreview.length && !this.isBackground && !this.videoPreview) {
        this.postSocial(this.payload).then(() => {
          this.loading = false
          this.resetCaption()
          this.closeCreate()
        })
      }
    },
    resetCaption() {
      this.payload.caption = null
    },
    deletePayload() {
      payload.delete("photo")
    },
    clearData() {
      this.singlePhotoPreview = null
      this.selectedFiles = []
      this.multiPhotoPreview = []
      this.payload.photo = null
      this.videoPreview = null
    },
    pictureTaken(picture) {
      this.canPost = true
      this.clearData()
      this.payload.type = 2
      this.singlePhotoPreview = picture
      this.resetVideo()
      this.deletePayload()
      payload.append("photo", this.dataURLtoBlob(picture))
      this.isCamera = false
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('upload', ['progress']),
    ...mapState('auth', ['stProfile']),
    ...mapState('background', ['background', 'loadingBackground'])
  },
  created() {
    this.getBackground({
      p: this.p
    })
  }
}
</script>
<style lang="scss">
.preview {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

[contentEditable=true]:empty:not(:focus)::before {
  content: attr(data-ph);
}


figure {
  display: grid;
  grid-template-rows: 1fr auto;
  break-inside: avoid;

  > img {
    grid-row: 1 / -1;
    grid-column: 1;
    margin: 0 auto 4px;
  }
}

.span-2 {
  column-span: all;
}

.container {
  column-count: 2;
  column-gap: 4px;
}

</style>