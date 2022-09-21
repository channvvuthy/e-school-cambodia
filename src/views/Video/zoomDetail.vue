<template>
  <div :class="darkMode ?`bg-youtube` : `bg-gray-50`" class="p-5 h-screen overflow-y-scroll">
    <div class="w-9/12" :class="darkMode ?`bg-youtube text-textSecondary` : `bg-white shadow rounded-b-xl`">
      <div class="relative">
        <img :src="detail.thumbnail" class="w-full m-auto">
        <div class="w-full absolute left-0 -bottom-5 flex justify-center space-x-5">
          <button
              @click="gotToPlayList"
              class="flex items-center justify-center bg-primary text-white w-72 py-2 outline-none rounded-full shadow text-xl">
            <VideoCameraIcon fill="#fff" :size="35"/>
            <span class="ml-3">{{ $t('1117') }}</span>
          </button>
          <a
              @click="zoomAttendant()"
              class="flex items-center cursor-pointer justify-center bg-primary text-white w-72 py-2 outline-none rounded-full shadow text-xl">
            <TVIcon fill="#fff" :size="35"/>
            <span class="ml-3">{{ $t('join_zoom') }}</span>
          </a>
        </div>
      </div>
      <div class="my-10 px-5">
        <div class="font-bold text-2xl">{{ detail.teacher.name }} ({{ detail.title }})</div>
        <div class="flex justify-between items-center my-5">
          <div class="text-lg">
            <template v-if="detail.price.highlight">
              {{ $t('1006') }}:
              <span class="mr-3">
                $ <del>{{ khmerNumber(detail.price.highlight) }}</del>
              </span>
              <span class="text-red-600 font-semibold">$ {{ khmerNumber(detail.price.year) }}</span>
            </template>
            <template v-else>
              <span>{{ $t('1007') }}</span>
            </template>
          </div>

          <div class="flex items-center">
            <Eye :height="30"/>
            <span v-if="loading">
              <Loader :size="10" bg="#000"/>
            </span>
            <span v-else>
              <span class="pl-2">
                  {{ kFormatter(playlist.course.view) }}
              </span>
            </span>
          </div>
          <div class="cursor-pointer">
          </div>
        </div>
      </div>
      <div class="border-b border-t py-3 px-5" :class="darkMode ?`border-button` : ``" v-if="!loading">
        <div class="flex items-center text-center justify-between w-96">
          <div class="cursor-pointer" :title="$t('2108')">
            <YoutubeIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
            <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
              {{ playlist.course.total_video ? playlist.course.total_video : 0 }}
            </div>
          </div>
          <div class="cursor-pointer" :title="$t('pdf')">
            <PdfIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
            <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
              {{ playlist.course.total_pdf ? playlist.course.total_pdf : 0 }}
            </div>
          </div>
          <div class="cursor-pointer" :title="$t('support')">
            <ChatIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
            <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                 :class="darkMode?`text-skyBlue`:`text-primary`">
              {{ playlist.course.has_support ? $t('1008') : $t('1009') }}
            </div>
          </div>
          <div class="cursor-pointer text-center flex justify-center flex-col" :title="$t('2111')">
            <TestIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
            <div class="h-6 mt-1 bg-transparent"
                 :class="darkMode?`text-skyBlue`:`text-primary`">
              {{ playlist.course.has_quiz ? $t('1008') : $t('1009') }}
            </div>
          </div>
          <div class="cursor-pointer" :title="$t('1114')">
            <CertificateIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
            <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                 :class="darkMode?`text-skyBlue`:`text-primary`">
              {{ playlist.course.has_certificate ? $t('1008') : $t('1009') }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center my-10 pb-20" v-if="!loading">
        <div class="progressVideoDetail flex items-center justify-center">
          <div>
            <div class="barOverflowVideoDetail">
              <div class="reportDetail"
                   :style="{transform:`rotate(${45+(Math.round(report('percentage'))*1.8)}deg)`}"></div>
            </div>
            <div class="absolute w-full top-0 h-full flex flex-col justify-end items-center">
              <div class="text-xl">
                {{ $t('1117') }}
              </div>
              <div class="font-bold text-3xl mt-2">
                {{ report('watch') }}/{{ report('total') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-40"></div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import VideoCameraIcon from "@/views/Video/components/VideoCameraIcon";
import Eye from "@/components/Eye";
import helper from "@/helper/helper";
import Loader from "@/components/Loader";
import CertificateIcon from "@/components/CertificateIcon";
import TestIcon from "@/components/TestIcon";
import PdfIcon from "@/components/PdfIcon";
import ChatIcon from "@/components/ChatIcon";
import YoutubeIcon from "@/components/YoutubeIcon";
import TVIcon from "@/components/TVIcon";
const { ipcRenderer } = require("electron");
export default {
  components: {
    YoutubeIcon,
    CertificateIcon,
    VideoCameraIcon,
    ChatIcon,
    PdfIcon,
    TestIcon,
    Eye,
    Loader,
    TVIcon
  },
  data() {
    return {
      detail: {},
      loading: false,
      payload: {
        id: null,
        package_id: null,
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('zoom', ['playlist'])
  },
  methods: {
    ...mapActions('favorite', ['add']),
    ...mapActions('zoom', ['getPlaylist', 'getZoomAttendant']),
    addToFavorite() {
    },
    gotToPlayList() {
      if (this.detail.list.length <= 0) {
        helper.errorMessage('no_video')
        return;
      }
      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        return;
      }
      this.$router.push({name: 'video-detail', params: {course: this.detail}})
    },
    report(field) {
      try {
        return this.playlist.course.report_watch[field] || 0
      } catch (err) {
        return 0
      }
    },
    kFormatter(view) {
      return helper.kFormatter(view)
    },
    reportWatch() {
      try {
        return this.playlist.course.report_watch.watch + `/` + this.playlist.course.report_watch.total
      } catch (err) {
        return '0/0'
      }
    },
    khmerNumber(str) {
      if (this.$i18n.locale == 'kh') {
        return helper.khmerNumber(str)
      }
      return str
    },
    getVideoDetail() {
      this.payload.id = this.detail._id
      this.payload.package_id = this.detail.package_id
      this.loading = true
      this.getPlaylist(this.payload).then((res) => {
        this.detail.zoom_link = res.data.data.course.zoom_link
        this.detail.list = res.data.data.list
        this.loading = false
        this.reportWatch()
      })
    },
    zoomAttendant() {
      let payload = {
        id: this.detail._id
      }
      this.getZoomAttendant(payload).then(res => {
        if (res.msg == undefined) {
          ipcRenderer.send("openLink",this.detail.zoom_link)
        }
      })
    }
  },
  mounted() {

  },
  created() {
    this.detail = this.$route.params.course
    this.getVideoDetail()

  }
}
</script>
<style>
.progressVideoDetail {
  position: relative;
  margin: 4px;
  float: left;
  text-align: center;
}

.barOverflowVideoDetail { /* Wraps the rotating .bar */
  position: relative;
  width: 290px;
  height: 145px; /* Half circle (overflow) */
  margin-bottom: -14px; /* bring the numbers up */
  overflow: hidden;
}

.reportDetail {
  position: absolute;
  top: 0;
  left: 0;
  width: 290px;
  height: 290px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 15px solid #c9c9c9;
  border-bottom-color: #055174;
  border-right-color: #055174;
}
</style>