<template>
  <div
      :class="darkMode ? `bg-secondary`: `bg-white`">
    <div class="px-5 flex items-center h-24"
         :class="mode(darkMode ?`border-b border-button` : ``)">
      <Avatar
          :avatar-url="stProfile.photo"
          :size="16"></Avatar>
      <textarea
          :class="mode()"
          readonly
          @click="()=>{this.isPost = true}"
          v-model="payload.caption"
          class="outline-none h-full w-full ml-4 text-sm pt-10 border-none bg-transparent"
          style="resize: none"
          :placeholder="$t('say_something')"></textarea>
      <div class="flex items-center space-x-8">
        <div
            @click="createPost"
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`">
          <PostVideoIcon :fill="darkMode ? `#909090` : `#055174`"></PostVideoIcon>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
             @click="createPost"
             :class="darkMode ? `bg-button`: `bg-softGray`">
          <ImageIcon :size="20" :fill="darkMode ? `#909090` : `#055174`"></ImageIcon>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center  text-sm fot-semibold cursor-pointer"
             :class="darkMode ? `bg-button text-lightGray `: `bg-softGray text-primary`">
          Live
        </div>
      </div>
      <template v-if="isPost">
        <CreatePost
            @dismissPost="()=>{this.isPost = false}"
            @closeCreate="closeCreate"></CreatePost>
      </template>
    </div>
    <div class="flex p-5">
      <!-- New feed -->
      <div class="w-65">
        <template v-if="loadingNewFeed">
          <div
              v-for="key in 6" :key="key + Math.random()"
              class="border mb-5 p-5"
              :class="darkMode ? `border-button text-lightGray` : ``">
            <Loading :grid="true" :number-of-columns="1"></Loading>
          </div>
        </template>
        <div id="new-feed" v-else>
          <div v-for="post in social" :key="post._id">
            <div
                v-observe-visibility="visibilityChanged"
                :data-id="post._id"
                :data-type="post.type"
                class="border mb-5" :class="darkMode ? `border-button text-lightGray` : ``">
              <div class="px-5 pt-5">
                <div class="flex justify-between">
                  <div class="flex space-x-4">
                    <Avatar :avatar-url="post.user.photo" :size="16"></Avatar>
                    <div>
                      <div class="font-PoppinsMedium text-lg">{{ post.user.name }}</div>
                      <div
                          v-if="(post.type === 52 || post.type === 51)"
                          class="capitalize text-primary text-sm">
                        {{ $t('sponsored') }}
                      </div>
                      <div
                          v-else
                          class="text-base"
                          :class="darkMode ? `text-gray-400` : `text-gray-500`">
                        {{ formatDate(post.date) }}
                      </div>
                    </div>
                  </div>
                  <!-- Action -->
                  <div class="relative">
                    <div
                        @click="closeAction"
                        class="w-full h-full fixed top-0 left-0 z-40"
                        v-if="actionId === post._id"></div>
                    <div @click="showAction(post)">
                      <Action></Action>
                    </div>
                    <div
                        v-if="actionId === post._id"
                        :class="darkMode ? `bg-youtube text-lightGray`: `bg-white border-t`"
                        class="absolute w-60 py-5 right-0 top-10 z-50 rounded-xl shadow-md">
                      <ActionList
                          @selectedAction="selectedAction($event)"
                          :post="post"></ActionList>
                    </div>
                  </div>
                </div>
                <div v-if="post.thumbnail && post.type === 1" class="relative">
                  <div class="absolute flex items-center h-full w-full justify-center top-0 left-0">
                    <div class="m-auto overflow-y-scroll p-5 whitespace-pre-wrap text-center max-h-full">
                      <div v-if="post.caption.length > 200">
                  <span class="less"
                        @click="seeMore"
                  >{{ cutString(post.caption, 200) }} <span
                      class="capitalize cursor-pointer font-bold">{{ $t('see_more') }}</span>
                  </span>
                        <span class="more hidden">
                    {{ post.caption }}
                  </span>
                      </div>
                      <div v-else>
                        {{ post.caption }}
                      </div>
                    </div>
                  </div>
                  <img :src="post.thumbnail.url" alt="" class="mt-4" :id="post._id">
                  {{ setParentColor(post._id) }}
                </div>
                <!-- Caption -->
                <div class="font-light mt-4 whitespace-pre-wrap"
                     v-else-if="post.caption"
                     :class="darkMode ? `text-lightGray` : ``">
                  <div v-if="post.caption.length > 200">
                  <span class="less"
                        @click="seeMore"
                  >{{ cutString(post.caption, 200) }} <span
                      class="capitalize cursor-pointer"
                      :class="darkMode ? `text-gray-300`: `text-primary`">{{ $t('see_more') }}</span>
                  </span>
                    <span class="more hidden">
                    {{ post.caption }}
                  </span>
                  </div>
                  <div v-else>
                    {{ post.caption }}
                  </div>
                </div>
                <!-- Photo -->
                <div v-if="post.photo && post.photo.length" class="mt-4">
                  <PhotoGrid @itemClick="itemClickHandler"
                             :post="post"
                             :photos="post.photo"/>
                </div>
                <!--Video-->
                <div v-if="post.video" class="mt-4 overflow-hidden">
                  <MediaPlayer
                      @fullScreen="fullScreen($event)"
                      :video-url="post.video.url" :post="post"></MediaPlayer>
                </div>
                <!-- Background -->
                <div></div>
                <!-- Tool -->
                <div class="flex items-center pl-5 mt-4 justify-between"
                     :class="darkMode ? `text-lightGray` : `text-primary`">
                  <div class="flex items-center space-x-16">
                    <div class="flex items-center space-x-2">
                      <div class="cursor-pointer">
                        <div v-if="post.is_like" @click="disLikePost(post)">
                          <LikeFillIcon :size="22" :fill="darkMode ? `#909090`: `#055174`"></LikeFillIcon>
                        </div>
                        <div @click="likePost(post)" v-else>
                          <LikeIcon :size="22" :fill="darkMode ? `#909090`: `#4A4A4A`"></LikeIcon>
                        </div>

                      </div>
                      <div v-if="post.total && post.total.like">
                        {{ kFormatter(post.total.like) }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2" v-if="post.total && post.total.seen">
                      <div>
                        <Eye :size="30" :fill="darkMode ? `#909090`: `#4A4A4A`"></Eye>
                      </div>
                      <div>
                        {{ kFormatter(post.total.seen) }}
                      </div>
                    </div>
                  </div>
                  <div
                      :class="`liker-${post.liker.length}`"
                      class="flex items-center justify-end" v-if="post.liker && post.liker.length">
                    <div
                        @click="showLiker(post)"
                        v-if="index < 6"
                        :title="liker.name"
                        v-for="(liker, index) in post.liker"
                        :class="`circle-${index} ${likerClass()}`"
                        :key="index + Math.random()"
                        class="rounded-full h-11 w-11 relative bg-cover bg-center border-2 cursor-pointer bg-gray-50"
                        :style="{backgroundImage:`url(${liker.photo})`}"
                    ></div>
                  </div>
                </div>
              </div>
              <!--Comment -->
              <div class="flex h-17 border-t flex items-center w-full mt-4 px-5 space-x-5"
                   v-if="commentDetailId !== post._id"
                   @click="showCommentDetail(post._id)"
                   :class="darkMode ? `border-button text-lightGray` : ``">
                <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
                <textarea
                    disabled
                    readonly
                    :placeholder="$t('2113')"
                    class="outline-none w-full pt-6 bg-transparent cursor-pointer" style="resize: none"></textarea>
                <div class="whitespace-nowrap" v-if="post.total && post.total.comment">
                  {{ post.total.comment }} {{ commentText(post.total.comment) }}
                </div>
              </div>
              <div v-if="commentDetailId === post._id">
                <CommentDetail :id="commentDetailId"></CommentDetail>
              </div>
            </div>
          </div>
        </div>
        <template v-if="loadingMore">
          <div
              v-for="i in 2" :key="i + Math.random()"
              class="border mb-5 p-5"
              :class="darkMode ? `border-button text-lightGray` : ``">
            <Loading :grid="true" :number-of-columns="1"></Loading>
          </div>
        </template>
      </div>
      <!-- End New feed -->


      <!-- Ads -->
      <div class="w-35 pl-5">
        <div
            v-for="index in 6" :key="index + Math.random()"
            v-if="loadingNewFeed"
            class="border py-3 px-4 mb-4"
            :class="darkMode ? `border-button text-lightGray` : ``">
          <Loading :grid="true" :number-of-columns="1"></Loading>
        </div>
        <div v-if="!loadingNewFeed">
          <div v-for="(ad, index) in ads" :key="index" class="mb-4">

            <div class="border" :class="darkMode ? `border-button text-lightGray` : ``">
              <div class="py-3 px-4">
                <div class="flex justify-between">
                  <div class="flex space-x-4">
                    <Avatar :avatar-url="ad.user.photo" :size="14"></Avatar>
                    <div>
                      <div class="font-semibold text-lg">{{ ad.user.name }}</div>
                      <div class="capitalize text-primary text-sm">
                        {{ $t('sponsored') }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-lg mt-4 font-light whitespace-pre-wrap"
                     v-if="ad.caption"
                     :class="darkMode ? `text-lightGray` : ``">
                  {{ ad.caption }}
                </div>

                <!-- Photo -->
                <div v-if="ad.photo && ad.photo.length" class="mt-4">
                  <div id="carouselExampleSlidesOnly" class="carousel slide relative" data-bs-ride="carousel">
                    <div class="carousel-inner relative w-full overflow-hidden">
                      <div
                          v-for="(photo, key) in ad.photo" :key="key"
                          :class="key == 0 ? `active` : ``"
                          class="carousel-item relative float-left w-full">
                        <img
                            :src="photo.url"
                            class="block w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!--Video-->
                <div v-if="ad.video" class="mt-4 relative">
                  <div class="absolute w-full h-full flex items-center justify-center z-10">
                    <div
                        class="h-16 w-16 rounded-full flex items-center justify-center cursor-pointer"
                        style="background-color: rgba(5,81,116,0.5)">
                      <div class="pl-1">
                        <Next fill="#FFF"></Next>
                      </div>
                    </div>
                  </div>
                  <img :src="ad.thumbnail.url">
                </div>

                <!-- Tool -->
                <div class="flex items-center px-3 mt-4 justify-between"
                     :class="darkMode ? `text-lightGray` : `text-primary`">
                  <div class="flex items-center space-x-16">
                    <div class="flex items-center space-x-2">
                      <div>
                        <LikeIcon :size="20"></LikeIcon>
                      </div>
                      <div v-if="post.total && post.total.like">
                        {{ kFormatter(post.total.like) }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2" v-if="post.total && post.total.seen">
                      <div>
                        <Eye :size="28"></Eye>
                      </div>
                      <div>
                        {{ kFormatter(post.total.seen) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--Comment -->
              <div class="flex h-16 border-t flex items-center w-full mt-4 space-x-5 px-3"
                   :class="darkMode ? `border-button text-lightGray` : ``">
                <Avatar :avatar-url="stProfile.photo" :size="8"></Avatar>
                <textarea
                    placeholder="Add comment"
                    class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>
      <!-- End ads -->

      <!-- Post detail -->
      <PostDetail
          @dismiss="()=>{this.isPostDetail = false}"
          :post="postDetail"
          v-if="isPostDetail"></PostDetail>
      <!-- Video detail -->
      <VideoDetail
          @dismiss="()=>{this.isVideo = false}"
          :post="postDetail"
          v-if="isVideo"
      ></VideoDetail>
      <!-- Edit post -->
      <template v-if="isEdit">
        <CreatePost
            :edit-detail="postDetail"
            :is-edit="true"
            @dismissPost="()=>{this.isEdit = false}"
            @closeCreate="closeCreate"></CreatePost>
      </template>

      <!-- Report post -->
      <template v-if="isReport">
        <Report
            :social="reportSocial"
            @closeReport="()=>{this.isReport = false}"></Report>
      </template>
      <!-- Copy link -->
      <input type="text" class="absolute" v-model="link" id="copyLink" style="z-index:-1">
      <!-- Liker -->
      <template v-if="isLiker">
        <Liker :social="postDetail" @closeLiker="()=>{this.isLiker = false}"></Liker>
      </template>
    </div>
  </div>
</template>
<script>
import Avatar from "@/Avatar";
import mode from "@/mixins/mode";
import {mapActions, mapState} from "vuex";
import PostVideoIcon from "@/components/PostVideoIcon";
import ImageIcon from "@/components/ImageIcon";
import CreatePost from "@/views/Component/Post/CreatePost";
import moment from "moment";

import PhotoGrid from "@/views/Video/components/PhotoGrid";
import LikeIcon from "@/components/LikeIcon";
import Eye from "@/components/Eye";
import Next from "@/views/Component/Post/Next";
import helper from "@/helper/helper";
import Loading from "@/components/Loading";
import LikeFillIcon from "@/components/LikeFillIcon";
import CommentDetail from "@/views/Video/components/CommentDetail";
import PostDetail from "@/views/Video/components/PostDetail";
import Action from "@/views/Video/components/Action";
import ActionList from "@/views/Video/components/ActionList";
import Pause from "@/views/Component/Post/Pause";
import FastAverageColor from "fast-average-color";

const fac = new FastAverageColor();
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import Video from "@/views/Video/Video";
import MediaPlayer from "@/views/Video/components/MediaPlayer";
import VideoDetail from "@/views/Video/components/VideoDetail";
import Report from "@/views/Video/components/Report.vue";
import config from "./../../config"
import Liker from "@/views/Video/components/Liker";

Vue.use(VueObserveVisibility)

export default {
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode', 'isHide']),
    ...mapState('social', ['social', 'ads', 'loadingMore']),
  },
  components: {
    Report,
    VideoDetail,
    MediaPlayer,
    Video,
    Pause,
    ActionList,
    Action,
    PostDetail,
    CommentDetail,
    LikeFillIcon,
    Loading,
    Next,
    Eye,
    LikeIcon,
    PhotoGrid,
    Avatar,
    PostVideoIcon,
    ImageIcon,
    CreatePost,
    Liker
  },
  mixins: [mode],
  data() {
    return {
      isLiker: false,
      link: null,
      isReport: null,
      isVideo: false,
      videoPlaying: null,
      actionId: null,
      isPostDetail: false,
      postDetail: {},
      commentDetailId: null,
      loadingNewFeed: false,
      loading: false,
      isPost: false,
      isEdit: false,
      reportSocial: {},
      payload: {
        p: 1,
        caption: null,
        type: 1
      }
    }
  },
  methods: {

    ...mapActions('social', ['getSocial', 'postSocial', 'like',
      'deleteLike', 'deleteSocial', 'addFavorite', 'deleteFavorite']),
    showLiker(post) {
      this.isLiker = true
      this.postDetail = post
    },
    fullScreen(data) {
      this.postDetail = data
      this.isVideo = true
    },
    setParentColor(postIndex) {
      let interval = setInterval(() => {
        if (document.getElementById(postIndex) != null) {
          fac.getColorAsync(document.getElementById(postIndex))
              .then(color => {
                if (color.isDark) {
                  document.getElementById(postIndex).parentElement.style.color = 'white'
                }
              }).catch(error => error);
          clearInterval(interval)
        }
      }, 100)
    },
    visibilityChanged(isVisible, entry) {
      if (isVisible) {
        let payload = {
          id: entry.target.getAttribute('data-id'),
          type: entry.target.getAttribute('data-type')
        }
        this.$store.dispatch('social/countView', payload)
      }


    },
    stopVideo(post) {
      this.videoPlaying = null;
      let vd = document.getElementById(`${post._id}`)
      vd.pause()
    },
    playVideo(post) {
      this.videoPlaying = post._id
    },
    selectedAction(data) {
      let payload = {}
      payload.id = data.post._id
      this.reportSocial = data.post

      if (data.action.label === 'actions.delete') {
        this.deleteSocial(payload).then(() => {
          this.actionId = null
        })
      }

      if (data.action.label === 'actions.add_to_favorite') {
        this.addFavorite(payload).then(() => {
          this.actionId = null
        })
      }

      if (data.action.label === 'actions.remove_favorite') {
        this.deleteFavorite(payload).then(() => {
          this.actionId = null
        })
      }
      if (data.action.label === 'actions.edit') {
        this.postDetail = data.post
        this.isEdit = true
        this.actionId = null
      }
      if (data.action.label === 'actions.report') {
        this.isReport = true
        this.actionId = null
      }
      if (data.action.label === 'actions.copy_link') {
        this.link = config.customProtocolUrl + `id?=${data.post._id}&type=${data.post.type}`
        setTimeout(() => {
          let copyText = document.getElementById("copyLink")
          copyText.select()
          copyText.setSelectionRange(0, 99999)
          document.execCommand("copy")
          helper.success("Copied")
          this.actionId = null
        }, 100)
      }
    },
    closeAction() {
      this.actionId = null
    },
    showAction(post) {
      this.actionId = post._id
    },
    showCommentDetail(id) {
      this.commentDetailId = id
    },
    postComment() {

    },
    commentText(comment) {
      let text = this.$i18n.t('2114')

      if (this.$i18n.locale === 'en') {
        if (comment > 1) {
          text = this.$i18n.t('2114') + 's'
        }
      }
      return text
    },
    disLikePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.deleteLike(payload).then(() => {
        payload.liker = post.liker.filter(item => item._id != this.stProfile._id)
        this.$store.commit('social/removeLike', payload)
      })

    },
    likePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.like(payload)
    },
    kFormatter(num) {
      return helper.kFormatter(num)
    },
    seeMore(e) {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextSibling.classList.toggle("hidden")
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    likerClass() {
      if (this.darkMode) {
        return "border-secondary"
      } else {
        return "border-white"
      }
    },
    itemClickHandler(data) {
      this.postDetail = data
      this.isPostDetail = true
    },
    post() {
      if (this.loading) {
        return
      }

      if (this.payload.caption === null || this.payload.caption === '') {
        return;
      }
      this.loading = true
      this.postSocial(this.payload).then(res => {
        this.payload.caption = null
        this.$store.commit('social/newPost', res.data)
        this.loading = false
      })
    },
    formatDate(day) {
      let currentDate = new Date()
      let today = moment(currentDate)
      let postDay = moment(day)
      let result = today.diff(postDay, 'days')
      if (result === 1 || result === 0) {
        return moment(day).startOf('hour').fromNow()
      } else {
        return moment(day).format('LLL')
      }
    },
    closeCreate() {
      this.isEdit = false
      this.isPost = false
      this.getPost()
    },
    createPost() {
      this.isPost = true
    },
    getPost() {
      this.loadingNewFeed = true
      this.getSocial(
          this.payload
      ).then(() => {
        this.loadingNewFeed = false
      })
    }
  },
  mounted() {
    this.mode()
  },
  created() {
    this.getPost()
  },
}
</script>
<style>
.hooper-liveregion.hooper-sr-only {
  display: none;
}

* {
  outline: none !important;
}
</style>