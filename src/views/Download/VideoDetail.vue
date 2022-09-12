<template>
  <div>
    <eHeader></eHeader>
    <div class="flex mt-5 ml-5 h-screen">
      <div class="w-3/5">
        <div class="w-11/12 relative m-auto">
          <div
              class="flex justify-center items-center bg-black bg-opacity-70 rounded py-1 px-2 absolute top-5 cursor-pointer z-50"
              v-if="showToolbar" @click="toggleFullScreen">
            <div class="border border-white opacity-80 m-1 rounded" style="padding:1px;">
              <EnlargeIcon :size="20"/>
            </div>
          </div>
        </div>
        <video autoplay id="vDownload" class="m-auto w-full" ref="vDownload" @click="playPause()"
               poster="/poster-home.png"
               @timeupdate="timeUpdate()"
               @pause="pause()"
               @mouseover="()=>{this.showSound = false,this.showToolbar = true}"
               @ended="endedVideo">
          <source :src="protocol + baseUrl + '/' + video._id"/>
        </video>

        <div class="relative">
          <div class="absolute bottom-3 w-full px-5">
            <div
                class="bg-black text-white rounded-md text-sm bg-opacity-70 h-10 flex justify-between px-5 items-center m-auto"
                :class="showToolbar?'visible':'invisible'">
              <button id="playPauseBtn" class="bg-transparent focus:outline-none opacity-80"
                      @click="playPause()">
                <PlayIcon v-if="showPlay"/>
                <PauseIcon v-else/>
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
                  <SettingIcon/>
                </div>
                <!--Setting-->
                <div class="bg-black absolute bottom-8 w-48 right-5 px-3 bg-opacity-70 rounded-md py-2"
                     v-if="showSetting">
                  <div class="flex justify-between items-center h-10 leading-10"
                       @click="showPlaybackModal">
                    <div>{{ $t('playback_speed') }}</div>
                    <div class="transform -rotate-90">
                      <ChevronIcon fill="#ffffff" :size="16"/>
                    </div>
                  </div>
                  <div class="flex justify-between items-center h-10 leading-10"
                       @click="showQualityModal">
                    <div>{{ $t('quality') }}</div>
                    <div class="transform -rotate-90">
                      <ChevronIcon fill="#ffffff" :size="16"/>
                    </div>
                  </div>
                </div>
                <!--End setting-->
                <!--Playback speed-->
                <div class="bg-black absolute bottom-8 w-48 right-5 bg-opacity-70 rounded-md pt-2 overflow-hidden"
                     v-if="showPlayback">
                  <div class="flex items-center h-10 leading-10 px-3" @click="playbackBack">
                    <div class="transform rotate-90 mr-3">
                      <ChevronIcon fill="#ffffff" :size="16"/>
                    </div>
                    <div>{{ $t('playback_speed') }}</div>
                  </div>
                  <hr class="opacity-30">
                  <div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(0.25)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===0.25">&#10003;</span>0.25
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(0.5)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===0.5">&#10003;</span>
                      0.5
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(0.75)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===0.75">&#10003;</span>
                      0.75
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(1)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===1">&#10003;</span>
                      {{ $t('normal') }}
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(1.25)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===1.25">&#10003;</span>
                      1.25
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(1.5)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===1.5">&#10003;</span>
                      1.5
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(1.75)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===1.75">&#10003;</span>
                      1.75
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="playbackRate(2)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultSpeed ===2">&#10003;</span>
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
                      <ChevronIcon fill="#ffffff" :size="16"/>
                    </div>
                    <div>{{ $t('quality') }}</div>
                  </div>
                  <hr class="opacity-30">
                  <div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="changeVideoQuality(1)">
                                            <span class="text-base absolute left-5"
                                                  v-if="defaultQuality ===1">&#10003;</span>{{ $t('auto') }}
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="changeVideoQuality(360)">
                      <span class="text-base absolute left-5" v-if="defaultQuality ===360">&#10003;</span>360p
                    </div>
                    <div
                        class="h-10 leading-1 text-left flex px-10 hover:bg-black items-center hover:bg-opacity-30 relative"
                        @click="changeVideoQuality(720)">
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
                <div class="opacity-80 cursor-pointer z-40" @click="showSoundModal"
                     @mouseover="()=>{this.showSound= true,this.showSetting= false}">
                  <SoundIcon v-if="!muted"/>
                  <MutedIcon :size="20" v-else/>
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
        <div class="p-5 rounded-b-xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow`">
          {{ video.title }}
        </div>
      </div>
      <div class="flex-1 pl-5">
        <div class="flex h-12 items-center px-5 text-sm justify-between"
             :class="darkMode?`bg-button text-gray-300`:`bg-white `">
          <div class="cursor-pointer text-center w-full h-full justify-end flex flex-col"
               :class="active === `video`?`font-semibold`:``" @click="switchTap(`video`)">
            <span class="pb-3" :class="darkMode?``:`text-primary`">{{ $t('2108') }}</span>
            <BorderBottom
                :class="darkMode?`bg-white`:`bg-primary`"
                v-if="active === `video`"/>
          </div>
          <div class="cursor-pointer text-center w-full h-full justify-end flex flex-col"
               :class="active === `document`?`font-semibold`:``" @click="switchTap(`document`)">
            <span class="pb-3" :class="darkMode?``:`text-primary`">{{ $t('1112') }}</span>
            <BorderBottom :class="darkMode?`bg-white`:`bg-primary`"
                          v-if="active === `document`"/>
          </div>
        </div>
        <!-- Video -->
        <div class="mt-3 h-full overflow-y-scroll pr-3 pb-60" v-if="active === `video`">
          <div v-for="(video, index) in videos" :key="index" class="mb-3 p-4 rounded"
               :class="darkMode?`${order === index?`bg-white`:`bg-button text-gray-300`}`:`${order === index?`bg-gray-300`:`bg-white`} shadow`">
            <div class="flex items-center cursor-pointer">
              <img :src="video.thumbnail" class="w-2/5 mr-5" @click="nextVideo(index,video)">
              <div @click="nextVideo(index,video)">{{ video.title }}</div>
              <div class="flex-1 flex justify-end items-center cursor-pointer">
                <CloseIcon/>
              </div>
            </div>
          </div>
        </div>
        <!-- Document -->
        <div>
          <div
              class="h-screen overflow-y-scroll pb-60 font-khmer_os flex flex-col justify-center items-center mt-3 rounded-t"
              :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" v-if="active === `document`">
            <div class="text-base text-center" v-html="$t('pdf_des')"></div>
            <button @click="openDoc"
                    class="rounded-lg mt-5 focus:outline-none h-13 text-base text-white px-10"
                    :class="darkMode?`bg-active`:`bg-primary`"
                    :style="darkMode?``:`box-shadow: rgba(155, 155, 155, 0.7) 3px 4px 3px;`">{{ $t('1110') }}
            </button>
          </div>
        </div>
        <!-- Pdf -->
        <div class="fixed w-full h-full left-0 top-0 bg-black  flex justify-center items-center z-50 bg-opacity-90"
             v-if="showDoc">
          <div class="bg-white w-2/5 h-5/6 overflow-y-hidden">
            <div class="flex justify-between items-center p-4" :class="darkMode?`bg-fb`:`bg-primary`">
              <div class="border border-white cursor-pointer" style="padding:1px;"
                   @click="openFullscreen">
                <EnlargeIcon :size="16"/>
              </div>
              <div class="text-white text-sm">{{ video.title }}</div>
              <div class="cursor-pointer" @click="closeDock">
                <CloseIcon fill="#ffffff" :width="22"/>
              </div>
            </div>
            <div id="fullScreen" class="h-full overflow-y-scroll pb-10">
              <SinglePdf :pdfUrl="pdfUrl" :darkMode="darkMode"/>
            </div>

          </div>
        </div>
        <!-- Forum -->
        <Forum
            :id="video._id"
            v-if="active === `forum`"
            @forumDetail="forumDetail($event)"
            @openModal="openModal($event)"
            @postComment="postComment($event)"
            @noReply="noReply"/>
        <ForumComment
            v-if="showMenu"
            :comments="comments"
            :loading="loadingComment"
            @openModal="openModal($event)"
            @reply="reply"
            @replyTextComment="replyTextComment($event)"
            @loadMoreComment="loadMoreComment($event)"/>
      </div>
    </div>
  </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import EnlargeIcon from "./../../components/EnlargeIcon.vue";
import ChevronIcon from "./../../components/ChevronIcon.vue";
import CloseIcon from "./../../components/CloseIcon.vue";
import PlayIcon from "./../MyCourse/components/media/PlayIcon.vue";
import PauseIcon from "./../MyCourse/components/media/PauseIcon.vue";
import SettingIcon from "./../MyCourse/components/media/SettingIcon.vue";
import SoundIcon from "./../MyCourse/components/media/SoundIcon.vue";
import MutedIcon from "./../MyCourse/components/media/MutedIcon.vue";
import BorderBottom from "./../../components/BorderBottom.vue"
import SinglePdf from "./../Component/SinglePdf.vue"
import Forum from "./../Video/components/Forum.vue"
import ForumComment from "./../Video/components/ForumComment.vue"


import {mapState, mapActions} from "vuex";

const {ipcRenderer} = require('electron')

export default {
  components: {
    eHeader,
    PlayIcon,
    PauseIcon,
    SettingIcon,
    EnlargeIcon,
    SoundIcon,
    ChevronIcon,
    MutedIcon,
    BorderBottom,
    SinglePdf,
    CloseIcon,
    Forum,
    ForumComment
  },
  data() {
    return {
      protocol: "file:///",
      baseUrl: "",
      loading: false,
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
      window: {
        wwidth: null
      },
      video: {},
      videos: [],
      active: "video",
      order: 0,
      showDoc: false,
      pdfUrl: "",
      comments: [],
      isReply: false,
      showMenu: false,
      loadingComment: false,


    }
  },
  computed: {
    ...mapState("playVideo", ["videoUrl", "defaultVolumeRange", "lastWatched"]),
    ...mapState('setting', ['darkMode'])
  },
  mounted() {
    ipcRenderer.on("getDownloadLocation", (event, arg) => {
      this.baseUrl = arg
    })
  },
  methods: {
    ...mapActions('playVideo', ['getPdf']),
    ...mapActions('forum', ['getCommentForum', 'addComment', 'replyComment', 'showCommentPagination']),

    openDoc() {
      this.showDoc = true
    },
    replyTextComment(event) {
      this.replyComment(event).then(response => {
        this.comments.comment.push(response.data.data)
      })
    },
    loadMoreComment(payload) {
      this.showCommentPagination(payload).then(res => {
        for (let i = 0; i < res.comment.length; i++) {
          this.comments.comment.push(res.comment[i]);
        }
      })
    },
    forumDetail($event) {
      this.showMenu = true
      this.loadingComment = true
      this.getCommentForum({id: $event._id}).then(response => {
        this.comments = response
        this.loadingComment = false
      })
    },
    openModal(event) {
      this.showModalPhoto = true
      this.photo = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgUrl = e.target.result
      }
      reader.readAsDataURL(event.target.files[0]);
    },
    noReply() {
      this.isReply = false
    },
    reply() {

      this.isReply = true
    },
    postComment(event) {
      let formData = new FormData();
      formData.append("id", this.video._id)
      if (event) {
        formData.append("text", event);
      }
      this.addComment(formData)
    },
    closeDock() {
      this.showDoc = false
    },
    openFullscreen() {
      var elem = document.getElementById("fullScreen");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
    },
    showSettingModal() {

    },
    switchTap(tap) {
      this.active = tap
    },
    nextVideo(index, video) {
      this.order = index
      this.video = video
      this.vid.src = this.protocol + this.baseUrl + '/' + video._id
      this.showPlay = false

      this.getPdf({id: this.video._id}).then(response => {
        this.pdfUrl = response.data.data.url
      })
    },
    endedVideo() {
      this.$emit("endedVideo")
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
    pause() {
      this.showPlay = true;
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
    timeUpdate() {
      let nt = Math.floor(this.vid.currentTime * (100 / this.vid.duration));
      this.rangeSliderWidth = nt;
      let color = `linear-gradient(90deg, rgb(255, 255, 255) ${nt}%, rgb(151, 151, 151) ${nt}%)`;
      this.seekSlider.style.background = color;
      this.currentWatch = this.vid.currentTime

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
    setMute(value) {
      if (value === "0") {
        this.vid.muted = true;
        this.muted = true;
      } else {
        this.muted = false;
        this.vid.muted = false;
      }
    },
    getVideo() {
      let interval = setInterval(() => {
        if (document.getElementById("vDownload") !== null) {
          clearInterval(interval);
          this.vid = document.getElementById("vDownload");
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
  },
  created() {
    ipcRenderer.send("downloadLocation")
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    if (this.window.width <= 1315) {
      this.$store.commit('setting/toggleSidebar', true)
    }
    let videos = JSON.parse(localStorage.getItem('videos'))

    videos = videos.filter(item => item.course._id == this.$route.params.course.course._id)
    this.video = videos[0]
    this.videos = videos
    ipcRenderer.send("decypt", this.video._id)
    this.getPdf({id: this.video._id}).then(response => {
      this.pdfUrl = response.data.data.url
    })
    ipcRenderer.on("decypted", () => {
      this.getVideo()
      ipcRenderer.removeAllListeners();
    })


  }
}
</script>