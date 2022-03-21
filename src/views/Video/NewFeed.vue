<template>
  <div :class="darkMode ? `bg-secondary`: `bg-white`">
    <div class="px-5 flex items-center h-24"
         :class="mode(darkMode ?`border-b border-button` : ``)">
      <Avatar
          :avatar-url="stProfile.photo"
          :size="16"></Avatar>
      <textarea
          :class="mode()"
          v-model="payload.caption"
          @keyup.enter.exact="post"
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
             :class="darkMode ? `bg-button text-textSecondary `: `bg-softGray text-primary`">
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
              v-for="key in 6" :key="key"
              class="border mb-5 rounded-md p-5"
              :class="darkMode ? `border-button text-lightGray` : ``">
            <Loading :grid="true" :number-of-columns="1"></Loading>
          </div>
        </template>
        <template v-else>
          <div v-for="(post, index) in social" :key="index">
            <div class="border mb-5 rounded-md" :class="darkMode ? `border-button text-lightGray` : ``">
              <div class="p-5">
                <div class="flex justify-between">
                  <div class="flex space-x-4">
                    <Avatar :avatar-url="post.user.photo" :size="16"></Avatar>
                    <div>
                      <div class="font-semibold text-lg">{{ post.user.name }}</div>
                      <div
                          class="text-sm"
                          :class="darkMode ? `text-gray-400` : `text-gray-500`">
                        {{ formatDate(post.date) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-1 cursor-pointer">
                    <div class="h-1 w-1 rounded-full" :class="darkMode ? `bg-textSecondary`: `bg-black`"></div>
                    <div class="h-1 w-1 rounded-full" :class="darkMode ? `bg-textSecondary`: `bg-black`"></div>
                    <div class="h-1 w-1 rounded-full" :class="darkMode ? `bg-textSecondary`: `bg-black`"></div>
                  </div>
                </div>
                <div class="text-lg mt-4 font-light"
                     v-if="post.caption"
                     :class="darkMode ? `text-textSecondary` : ``">
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
                  <PhotoGrid @itemClick="itemClickHandler" :photos="post.photo"/>
                </div>
                <!--Video-->
                <div v-if="post.video" class="mt-4 relative">
                  <div class="absolute w-full h-full flex items-center justify-center z-10">
                    <div
                        class="h-16 w-16 rounded-full flex items-center justify-center cursor-pointer"
                        style="background-color: rgba(5,81,116,0.5)">
                      <div class="pl-1">
                        <Next fill="#FFF"></Next>
                      </div>
                    </div>
                  </div>
                  <video class="m-auto">
                    <source :src="post.video.url">
                  </video>
                </div>
                <!-- Background -->
                <div></div>
                <!-- Tool -->
                <div class="flex items-center px-5 mt-4 justify-between"
                     :class="darkMode ? `text-textSecondary` : `text-primary`">
                  <div class="flex items-center space-x-16">
                    <div class="flex items-center space-x-2">
                      <div>
                        <LikeIcon :size="22"></LikeIcon>
                      </div>
                      <div>
                        1.2k
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div>
                        <Eye :size="30"></Eye>
                      </div>
                      <div>
                        1.6k
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-end">
                    <!--                  <div-->
                    <!--                      v-for="(i, index) in 5"-->
                    <!--                      :class="`circle-${index} ${likerClass()}`"-->
                    <!--                      :key="index"-->
                    <!--                      class="rounded-full h-11 w-11 bg-red-500 relative bg-cover bg-center border-2"-->
                    <!--                      :style="{backgroundImage:`url('https://i.wifegeek.com/200426/f9459c52.jpg')`}"-->
                    <!--                  ></div>-->
                  </div>
                </div>
              </div>
              <!--Comment -->
              <div class="flex h-20 border-t flex items-center w-full mt-4 px-5 space-x-5"
                   :class="darkMode ? `border-button text-textSecondary` : ``">
                <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
                <textarea
                    placeholder="Add comment"
                    class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>
                <div class="whitespace-nowrap">
                  20 Comments
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="loadingMore">
          <div
              v-for="i in 2" :key="i"
              class="border mb-5 rounded-md p-5"
              :class="darkMode ? `border-button text-lightGray` : ``">
            <Loading :grid="true" :number-of-columns="1"></Loading>
          </div>
        </template>
      </div>
      <!-- End New feed -->


      <!-- Ads -->
      <div class="w-35 pl-5">
        <div
            v-for="index in 6" :key="index"
            v-if="loadingNewFeed"
            class="border rounded py-3 px-4 mb-4"
            :class="darkMode ? `border-button text-lightGray` : ``">
          <Loading :grid="true" :number-of-columns="1"></Loading>
        </div>
        <div v-else>
          <div v-for="(ad, index) in ads" :key="index" class="mb-4">
            <div class="border rounded" :class="darkMode ? `border-button text-lightGray` : ``">
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

                <div class="text-lg mt-4 font-light"
                     v-if="ad.caption"
                     :class="darkMode ? `text-textSecondary` : ``">
                  {{ ad.caption }}
                </div>

                <!-- Photo -->
                <div v-if="ad.photo && ad.photo.length" class="mt-4">
                  <PhotoGrid @itemClick="itemClickHandler" :photos="ad.photo"/>
                </div>

                <!--Video-->
                <div v-if="ad.video" class="mt-4">
                  <div class="absolute w-full h-full flex items-center justify-center z-10">
                    <div
                        class="h-16 w-16 rounded-full flex items-center justify-center cursor-pointer"
                        style="background-color: rgba(5,81,116,0.5)">
                      <div class="pl-1">
                        <Next fill="#FFF"></Next>
                      </div>
                    </div>
                  </div>
                  <video class="m-auto">
                    <source :src="ad.video.url">
                  </video>
                </div>

                <!-- Tool -->
                <div class="flex items-center px-3 mt-4 justify-between"
                     :class="darkMode ? `text-textSecondary` : `text-primary`">
                  <div class="flex items-center space-x-16">
                    <div class="flex items-center space-x-2">
                      <div>
                        <LikeIcon :size="20"></LikeIcon>
                      </div>
                      <div>
                        1.2k
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div>
                        <Eye :size="28"></Eye>
                      </div>
                      <div>
                        1.6k
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--Comment -->
              <div class="flex h-16 border-t flex items-center w-full mt-4 space-x-5 px-3"
                   :class="darkMode ? `border-button text-textSecondary` : ``">
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

export default {
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['social', 'ads', 'loadingMore'])
  },
  components: {
    Loading,
    Next,
    Eye,
    LikeIcon,
    PhotoGrid,
    Avatar,
    PostVideoIcon,
    ImageIcon,
    CreatePost
  },
  mixins: [mode],
  data() {
    return {
      loadingNewFeed: false,
      loading: false,
      isPost: false,
      payload: {
        p: 1,
        caption: null,
        type: 1
      }
    }
  },
  methods: {
    ...mapActions('social', ['getSocial', 'postSocial']),
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
    itemClickHandler() {

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
  }

}
</script>