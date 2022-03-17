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
    <div class="flex flex-wrap p-5">
      <div class="w-9/13">
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
                {{ post.caption }}
              </div>
              <!-- Photo -->
              <div v-if="post.photo && post.photo.length" class="mt-4">
                <PhotoGrid @itemClick="itemClickHandler" :photos="post.photo"/>
              </div>
              <!--Video-->
              <div v-if="post.video" class="mt-4">
                <video class="m-auto">
                  <source src="file:///Users/mac/Downloads/6131c75d37762735197a71a41647503412596.mp4">
                </video>
              </div>
              <!-- Background -->
              <div></div>
              <!-- Tool -->
              <div class="flex items-center px-5 mt-4 justify-between"
                   :class="darkMode ? `` : `text-primary`">
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
                  <div
                      class="rounded-full h-11 w-11 bg-red-50 relative z-50 bg-cover bg-center border-2 border-white"
                      style="right: -4rem;"
                      :style="{backgroundImage:`url('https://i.wifegeek.com/200426/d8bcb6a7.jpg')`}"
                  ></div>
                  <div class="rounded-full h-11 w-11 bg-red-100 relative z-40 bg-cover bg-center border-2 border-white"
                       :style="{backgroundImage:`url('https://i.wifegeek.com/200426/d74d9040.jpg')`}"

                       style="right: -3rem;"
                  ></div>
                  <div class="rounded-full h-11 w-11 bg-red-200 relative z-30 bg-cover bg-center border-2 border-white"
                       :style="{backgroundImage:`url('https://i.wifegeek.com/200426/663181fe.jpg')`}"
                       style="right: -2rem;">

                  </div>
                  <div class="rounded-full h-11 w-11 bg-red-400 relative z-20 bg-cover bg-center border-2 border-white"
                       :style="{backgroundImage:`url('https://i.wifegeek.com/200426/d17ce9a0.jpg')`}"
                       style="right: -1rem;"
                  ></div>
                  <div class="rounded-full h-11 w-11 bg-red-500 relative z-10 bg-cover bg-center border-2 border-white"
                       :style="{backgroundImage:`url('https://i.wifegeek.com/200426/f9459c52.jpg')`}"
                  ></div>
                </div>
              </div>
            </div>
            <!--Comment -->
            <div class="flex h-20 border-t flex items-center w-full mt-4 px-5 space-x-5">
              <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
              <textarea
                  placeholder="Add comment"
                        class="outline-none w-full pt-7" style="resize: none"></textarea>
              <div class="whitespace-nowrap">
                20 Comments
              </div>
            </div>
          </div>
        </div>
      </div>
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


export default {
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['social'])
  },
  components: {
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
      this.$router.push({
        name: "refresh-post"
      })
    },
    createPost() {
      this.isPost = true
    }
  },
  mounted() {
    this.mode()
  },
  created() {
    this.getSocial(
        this.payload
    )
  }

}
</script>