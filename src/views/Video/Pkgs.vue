<template>
  <div class="mt-3 overflow-y-scroll h-screen pb-40 relative"
       :class="darkMode ? `bg-youtube`: `bg-white`"
       @scroll="onScroll" ref="feed">
    <BoxFilter @enableUserScroll="enableUserScroll($event)"/>
    <div class="m-5">
      <div v-if="loading">
        <Loading/>
      </div>

      <div v-else class="grid gap-4" :class="isHide?`grid-cols-4`:`md:grid-cols-3 2xl:grid-cols-4`">
        <div v-for="(video, index) in packages.list" :key="index">
          <div class="relative cursor-pointer view"
               :class="darkMode?`bg-secondary text-white`:`bg-white shadow`"
               :style="minHeight?{minHeight:`${minHeight}px`}:{}">
            <div class="absolute left-3 top-3" v-if="video.is_new && video.is_buy === 0">
              <NewIcon/>
            </div>
            <div class="absolute top-3 left-3 z-40" v-if="video.is_buy">
              <div class="h-6 w-6 rounded-full flex justify-center items-center text-white text-base"
                   :class="darkMode?`bg-primary`:`bg-primary border border-textSecondary`">
                <span>✓</span>
              </div>
            </div>
            <div class="relative">
              <img :src="video.thumbnail" class="m-auto"
                   style="min-height:12rem;"/>
              <div class="absolute w-full h-full bg-gradient-to-t top-0 from-black cursor-pointer"
                   @click="gotToPlayList(video)"></div>
            </div>
            <div v-if="video.last_watch" class="h-1 absolute bg-red-600 -mt-1"
                 :style="{width:`${video.last_watch.percentage}%`}"></div>
            <div class="flex flex-col relative w-full justify-center items-center -top-10 px-5">
              <div @click="gotToPlayList(video)" class="flex flex-col relative w-full">
                <div class="flex items-center">
                  <div class="w-14 h-14  bg-gray-300 bg-cover rounded border-2 border-white shadow bg-center"
                       :style="{backgroundImage:`url(${video.teacher.photo})`}"></div>
                  <div class="ml-5 text-white pb-2">{{ video.teacher.name }}</div>
                </div>
                <div class="text-sm font-semibold mt-3 text-center">
                  {{ cutString(video.title, 30) }}
                </div>
                <div class="flex items-center w-full justify-between mt-3 text-center text-sm">
                  <div class="cursor-pointer" :title="$t('2108')">
                    <YoutubeIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                      {{ video.total_video ? video.total_video : 0 }}
                    </div>
                  </div>
                  <div class="cursor-pointer" :title="$t('pdf')">
                    <PdfIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                      {{ video.total_pdf ? video.total_pdf : 0 }}
                    </div>
                  </div>
                  <div class="cursor-pointer" :title="$t('support')">
                    <ChatIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                         :class="darkMode?`text-skyBlue`:`text-primary`">
                      {{ video.has_support ? $t('1008') : $t('1009') }}
                    </div>
                  </div>
                  <div class="cursor-pointer" :title="$t('2111')">
                    <TestIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                         :class="darkMode?`text-skyBlue`:`text-primary`">
                      {{ video.has_quiz }}
                    </div>
                  </div>
                  <div class="cursor-pointer" :title="$t('1114')">
                    <CertificateIcon
                        :fill="darkMode?`#909090`:`#000000`"
                        :size="42"/>
                    <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                         :class="darkMode?`text-skyBlue`:`text-primary`">
                      {{ video.has_certificate ? $t('1008') : $t('1009') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex w-full justify-between items-center relative top-5 text-base border-t cursor-default"
                   :class="darkMode? `border-left`: ``"
              >
                <div class="mt-5 text-lg">
                  {{ $t('2201') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="packages.list == undefined || packages.list.length <= 0">
        <div class="h-65 flex items-center justify-center">
          <Empty/>
        </div>
      </template>
      <div class="h-20"></div>
    </div>
    <!-- Scroll to top -->
    <div class="fixed right-0 bottom-0 w-full z-50 flex justify-end pr-5 pb-5" v-if="showScrollTop"
         @click="goToTop">
      <div class="cursor-pointer rounded-full w-12 h-12 flex items-center justify-center bg-primary">
        <ScrollTopIcon fill="#FFF" :size="24"/>
      </div>
    </div>
    <div class="h-24 z-50 fixed right bottom-0 e-shadow px-10 flex items-center justify-center"
         :class="darkMode ? `bg-secondary`: `bg-white`"
         v-if="packages.package != undefined && packages.package.is_buy == 0"
         :style="{width: `${buyNowWidth}px`}">
      <button
          @click="addToCart(packages.package)"
          :disabled="loadingBuy"
          class="outline-none flex items-center justify-center bg-primary rounded-xl text-xl text-white w-full h-12">
        {{ $t('buy_now') }}
        <div class="pl-2" v-if="loadingBuy">
          <Loader/>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
import BoxFilter from "./components/Filter.vue"
import {mapActions, mapState} from "vuex"
import helper from "./../../helper/helper"
import CertificateIcon from "./../../components/CertificateIcon.vue"
import TestIcon from "./../../components/TestIcon.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import ChatIcon from "./../../components/ChatIcon.vue"
import YoutubeIcon from "./../../components/YoutubeIcon.vue"
import NewIcon from "./../../components/NewIcon.vue"
import ScrollTopIcon from "./../../components/ScrollTopIcon.vue"
import Loading from "./../../components/Loading.vue"
import Empty from "./../Component/Empty.vue";
import Loader from "@/components/Loader";

export default {
  components: {
    BoxFilter,
    CertificateIcon,
    TestIcon,
    ChatIcon,
    PdfIcon,
    YoutubeIcon,
    NewIcon,
    ScrollTopIcon,
    Loading,
    Empty,
    Loader
  },
  data() {
    return {
      loadingBuy: false,
      filter: [],
      minHeight: 0,
      showScrollTop: false,
      page: 1,
      enableScroll: true,
      loading: false,
      buyNowWidth: 0,
    }
  },
  computed: {
    ...mapState('video', ['packages']),
    ...mapState("setting", ["darkMode", "isHide"]),
    ...mapState('home', ['selectedFilterName']),
    isHideSidebar() {
      return this.$store.state.setting.isHide
    },
    filter_id() {
      return this.$store.state.home.filter_id
    },
    s() {
      return this.$store.state.home.s
    }
  },
  methods: {
    ...mapActions('video', ['getPackages', 'getPackagesPagination']),
    ...mapActions('cart', ['addCart', 'getCart']),
    enableUserScroll() {

    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    gotToPlayList(videoCourse) {
      videoCourse.package_id = this.packages.package._id
      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        return;
      }
      this.$router.push({name: 'overview', params: {course: videoCourse}})
    },
    listPackages() {
      this.loading = true
      let payload = {}
      payload.filter_id = this.filter_id
      payload.s = this.s
      payload.id = this.$route.params.pkg._id
      this.getPackages(payload).then(res => {
        this.$store.commit("home/getFilter", res.data)
        this.loading = false
      })
    },
    addToCart(video) {
      this.loadingBuy = true
      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        return;
      }
      let payload = {}
      payload.id = video._id === undefined ? "" : video._id
      this.addCart(payload).then(() => {
        this.getCart().then(() => {
          this.loadingBuy = false
          document.getElementById("myCart").click()
        })
      })
      this.$store.commit("video/addToCart", video._id)
    },
    goToTop() {
      this.$refs.feed.scrollTop = 0;
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (!scrollTop) {
        this.showScrollTop = false
      }

      if (scrollTop > 300) {
        this.showScrollTop = true
      }

      if (scrollTop + clientHeight >= scrollHeight) {
        this.page++

        let payload = {}
        payload.id = this.$route.params.pkg._id

        if (this.s.length) {
          payload.s = this.s
        }

        if (this.filter_id !== "all") {
          payload.filter_id = this.filter_id
        }

        payload.p = this.page

        if (this.enableScroll) {
          this.getPackagesPagination(payload).then(res => {
            if (res.data.list.length <= 0) {
              this.enableScroll = false
            }
          })
        }
      }
    },
    matchHeight() {
      let arr = []
      let interval = setInterval(() => {
        let box = document.getElementsByClassName('view')
        if (box) {
          for (let i = 0; i < box.length; i++) {
            arr.push(box[i].clientHeight)
          }
          this.minHeight = Math.max(...arr)
          clearInterval(interval)
        }
      }, 1000)
    },
  },
  updated() {
    this.buyNowWidth = this.$refs.feed.clientWidth
  },
  mounted() {
    this.$nextTick(() => {
      this.matchHeight()
    })

  },
  created() {
    this.listPackages()
  },
  watch: {
    filter_id: function () {
      this.listPackages()
    },
    s: function () {
      this.listPackages()
    },
    'isHideSidebar': function () {
      this.buyNowWidth = this.$refs.feed.clientWidth
    }
  }
}
</script>
