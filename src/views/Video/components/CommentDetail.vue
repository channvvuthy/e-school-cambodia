<template>
  <div>
    <div class="flex h-20 border-t flex items-center w-full mt-4 px-5 space-x-5"
         :class="darkMode ? `border-button text-textSecondary` : ``">
      <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
      <textarea
          v-model="comment.text"
          @keyup.enter.exact="postComment"
          :placeholder="$t('2113')"
          class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>
      <div class="cursor-pointer" @click="()=>{this.isSticker = !this.isSticker}">
        <SmileEmoji :size="30" :fill="darkMode ?`#909090`: `#979797`"></SmileEmoji>
      </div>
      <div style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
        <div class="rounded-full h-9 w-9 flex items-center justify-center">
          <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></ImageIcon>
        </div>
      </div>
    </div>
    <StickerView
        @removeSticker="removeSticker"
        v-if="comment.sticker" :sticker-url="stickerUrl"></StickerView>
    <div v-if="loadingComment" class="p-5">
      <div
          v-for="key in 1" :key="key + Math.random()"
          class="border mb-5 rounded-md p-5"
          :class="darkMode ? `border-button text-lightGray` : ``">
        <Loading :grid="true" :number-of-columns="1"></Loading>
      </div>
    </div>
    <div v-else>
      <div class="border-t px-5 pb-5"
           v-if="comments.comments && comments.comments.length"
           :class="darkMode ? `border-button text-textSecondary` : ``">
        <div v-for="(comment, index) in comments.comments" :key="index" class="mt-4 flex space-x-5">
          <Avatar :avatar-url="comment.user.photo" :size="14"></Avatar>
          <div class="rounded-xl py-4 px-3" :class="darkMode ? `bg-youtube`: `bg-forum`">
            <div>
              <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">
                {{ comment.user.name }}
              </div>
            </div>
            <div v-if="comment.content.photo">
              <img :src="comment.content.photo.name" class="max-h-40 rounded my-2">
            </div>
            <div v-if="comment.content.sticker">
              <img :src="comment.content.sticker.url" class="max-h-40 rounded my-2">
            </div>
            <div v-if="comment.content.text" :class="darkMode?`text-gray-300`:``">
              {{ cutString(comment.content.text, 100) }}
            </div>

            <div class="flex items-center justify-between">
              <div class="text-gray-500 text-sm">
                <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en"/>
              </div>
              <div class="cursor-pointer">
                <ReplyIcon></ReplyIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sticker -->
    <Sticker v-if="isSticker"
             :parent-class="className"
             @closeSticker="()=>{this.isSticker = false}"
             @selectSticker="selectSticker($event)"
             :is-parent-class="true"
             default-position="border w-96 h-1/2 z-50 rounded-xl shadow-lg flex flex-col justify-between"></Sticker>
  </div>
</template>

<script>
import Avatar from "@/Avatar";
import {mapState, mapActions} from "vuex";
import SmileEmoji from "@/views/Video/components/SmileEmoji";
import ImageIcon from "@/components/ImageIcon";
import SendMessageIcon from "@/components/SendMessageIcon";
import Loading from "@/components/Loading";
import VueMomentsAgo from "vue-moments-ago";
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import helper from "@/helper/helper";
import Sticker from "@/views/Video/components/Sticker";
import mode from "@/mixins/mode";
import CloseIcon from "@/components/CloseIcon";
import StickerView from "@/views/Video/components/StickerView";

export default {
  name: "CommentDetail",
  components: {
    StickerView,
    CloseIcon,
    VueMomentsAgo,
    Loading,
    SendMessageIcon,
    Avatar,
    SmileEmoji,
    ImageIcon,
    ReplyIcon,
    Sticker
  },
  mixins: [mode],
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['loadingComment', 'comments'])
  },
  props: ['id'],
  data() {
    return {
      stickerUrl: null,
      isSticker: false,
      payload: {
        p: 1,
        id: null,
      },
      comment: {
        id: "",
        type: 1,
        text: ''
      }
    }
  },
  methods: {
    ...mapActions('social', ['getComment', 'addComment']),
    removeSticker() {
      this.stickerUrl = null
      this.$delete(this.comment, 'sticker')
    },
    selectSticker(sticker) {
      this.comment.sticker = sticker._id
      this.isSticker = false
      this.stickerUrl = sticker.sticker.name
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    postComment() {
      this.comment.id = this.id
      let isComment = false
      this.comment.text = this.comment.text.trim()

      if (this.comment.text != '') {
        isComment = true
      }

      if (this.comment.sticker != undefined) {
        isComment = true
      }

      if (this.comment.photo != undefined) {
        isComment = true
      }
      if (isComment) {
        this.addComment(this.comment).then(res => {
          this.comment.text = ''
          this.$delete(this.comment, 'sticker')
          this.$delete(this.comment, 'photo')
        })
      }
    }
  },

  mounted() {
    this.getComment(this.payload)
  },
  created() {
    this.payload.id = this.id
  }
}
</script>

<style scoped>

</style>