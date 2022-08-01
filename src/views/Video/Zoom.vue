<template>
  <div class="mt-3 overflow-y-scroll  h-screen pb-40"
       :class="darkMode ? `bg-youtube`: ``"
       @scroll="onScroll" ref="feed">
    <BoxFilter @enableUserScroll="enableUserScroll($event)" :is-zoom="true"/>
    <Pkg
        :is-zoom="true"
        :packages="courses.package"/>
    <div class="mt-10 px-5">
      <div v-if="loading">
        <Loading/>
      </div>

      <div v-else>
        <div class="grid gap-4" :class="isHide?`grid-cols-4`:`md:grid-cols-3 2xl:grid-cols-4`">
          <div v-for="(video, index) in courses.list" :key="index">
            <div class="relative cursor-pointer zoom"
                 :class="darkMode?`bg-secondary text-white`:`bg-white shadow`"
                 :style="minHeight?{minHeight:`${minHeight}px`}:{}">
              <div class="absolute left-3 top-3 z-50" v-if="video.is_new && video.is_buy === 0">
                <NewIcon/>
              </div>
              <div class="absolute top-3 left-3" v-if="video.is_buy">
                <div class="h-6 w-6 rounded-full flex justify-center items-center text-white text-base"
                     :class="darkMode?`bg-primary`:`bg-primary border border-textSecondary`">
                  <span>✓</span>
                </div>
              </div>
              <div class="relative">
                <img :src="video.thumbnail" onerror="this.onerror=null; this.src='/poster.png'"
                     class="m-auto"
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
                  <div class="text-base font-semibold mt-3 text-center">{{
                      cutString(video.title, 30)
                    }}
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
                      <CertificateIcon :fill="darkMode?`#909090`:`#000000`" :size="42"/>
                      <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                           :class="darkMode?`text-skyBlue`:`text-primary`">
                        {{ video.has_certificate ? $t('1008') : $t('1009') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full justify-between items-center relative top-5 mt-5 text-base">
                  <template v-if="video.price.year">
                    <div :class="darkMode?`text-gray-300`:``">
                      <del class="font-black text-xl">${{ video.price.highlight }}</del>&nbsp;
                      <span
                          :class="darkMode?`text-gray-300`:`text-red-700`">{{ video.price.year }} USD</span>
                    </div>
                    <div @click="addToCart(video)">
                      <div v-if="!video.is_in_cart" style="background-color:rgba(5,81,116,0.24)"
                           class="rounded-full w-10 h-10 flex items-center justify-center">
                        <CartIcon :fill="darkMode?`#909090`:`#055174`"/>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div :class="darkMode?`text-gray-300`:`text-red-700`">{{ $t('1007') }}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingMore">
        <Loading/>
      </div>

      <template v-if="courses.list == undefined || courses.list.length <= 0">
        <div class="h-65 flex items-center justify-center">
          <Empty/>
        </div>
      </template>

      <BuyMsg
          v-if="showMsg"
          :msg="msg"
          @cancelModal="() => {this.showMsg = false}"
          @yes="yes"/>
      <div
          class="fixed right-0 bottom-0 w-full z-50 flex justify-end pr-5 pb-5"
          v-if="showScrollTop" @click="goToTop">
        <div class="cursor-pointer rounded-full w-12 h-12 flex items-center justify-center bg-primary">
          <ScrollTopIcon fill="#FFF" :size="24"/>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
import {mapState, mapActions} from "vuex";
import BoxFilter from "./components/Filter.vue"
import Pkg from "./components/Pkg.vue"
import Loading from "./../../components/Loading.vue"
import CertificateIcon from "./../../components/CertificateIcon.vue"
import TestIcon from "./../../components/TestIcon.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import ChatIcon from "./../../components/ChatIcon.vue"
import CartIcon from "./../../components/CartIcon.vue"
import YoutubeIcon from "./../../components/YoutubeIcon.vue"
import NewIcon from "./../../components/NewIcon.vue"
import Empty from "./../Component/Empty.vue";
import BuyMsg from "./../Component/BuyMsg.vue"
import helper from "@/helper/helper";
import ScrollTopIcon from "./../../components/ScrollTopIcon.vue"

export default {
  computed: {
    ...mapState('setting', ['darkMode', 'isHide']),
    ...mapState('home', ['filter_id', 's']),
    ...mapState('zoom', ['courses', 'loading'])
  },
  components: {
    ScrollTopIcon,
    Empty,
    BuyMsg,
    BoxFilter,
    Pkg,
    Loading,
    CartIcon,
    CertificateIcon,
    TestIcon,
    NewIcon,
    YoutubeIcon,
    PdfIcon,
    ChatIcon
  },
  data() {
    return {
      enableScroll: true,
      page: 1,
      minHeight: 0,
      loadingMore: false,
      showMsg: false,
      msg: "2006",
      showScrollTop: false
    }
  },
  methods: {
    ...mapActions('zoom', ['getZoomCourse', 'getZoomCourseWithPagination']),
    ...mapActions('cart', ['addCart', 'getCart']),
    goToTop() {
      this.$refs.feed.scrollTop = 0;
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight) {

        if (!scrollTop) {
          this.showScrollTop = false
        }

        if (scrollTop > 300) {
          this.showScrollTop = true
        }

        this.page++

        let payload = {}

        if (this.s.length) {
          payload.s = this.s
        }

        if (this.filter_id !== "all") {
          payload.filter_id = this.filter_id
        }

        payload.p = this.page

        if (this.enableScroll) {
          this.loadingMore = true
          this.getZoomCourseWithPagination(payload).then(res => {
            this.loadingMore = false
            if (res.data.data.list.length <= 0) {
              this.enableScroll = false
            }
          })
        }
      }
    },
    enableUserScroll() {
      this.enableScroll = true
      this.page = 1
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    matchHeight() {
      let arr = []
      let interval = setInterval(() => {
        let box = document.getElementsByClassName('zoom')
        if (box) {
          for (let i = 0; i < box.length; i++) {
            arr.push(box[i].clientHeight)
          }
          this.minHeight = Math.max(...arr)
          clearInterval(interval)
        }
      }, 1000)
    },
    yes() {
      this.$router.push({name: "login"})
    },
    addToCart(video) {
      if (localStorage.getItem('token') == null) {
        this.showMsg = true
        return;
      }
      let payload = {}
      payload.id = video._id
      this.addCart(payload).then(() => {
        this.getCart()
      })
      this.$store.commit("zoom/addToCart", video._id)
    },
    gotToPlayList(videoCourse) {

      videoCourse.package_id = ""
      if (localStorage.getItem('token') == null) {
        this.showMsg = true
        return;
      }
      this.$router.push(
          {
            name: 'zoom-detail',
            params: {
              course: videoCourse,
            }
          }
      )
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.matchHeight()
    })
  },
  created() {
    this.getZoomCourse().then(res => {
      if (res.data && res.data.filter) {
        this.$store.commit("home/getFilter", {filter: res.data.filter})
      }
    })
  }
}
</script>