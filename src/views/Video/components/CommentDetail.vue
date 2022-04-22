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
        <input type="file" ref="commentPhoto" @change="selectPhoto" accept="image/*" class="hidden">
        <div class="rounded-full h-9 w-9 flex items-center justify-center"
             @click="()=>{this.$refs.commentPhoto.click()}">
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
        <div v-for="(comment, index) in comments.comments" :key="index">
          <Comment :comment="comment" @reply="reply($event)"></Comment>
          <div v-if="comment.reply_comment" class="pl-20">
            <div v-if="replies.comment && replies.comment._id === comment._id">
              <div v-for="(list, index) in replies.list">
                <Comment
                    :avata-size="12"
                    :parent-comment-id="comment._id"
                    :comment="list" @reply="reply($event)"></Comment>
              </div>
            </div>
            <div v-else>
              <Comment
                  :avata-size="12"
                  :parent-comment-id="comment._id"
                  :comment="comment.reply_comment" @reply="reply($event)"></Comment>

              <button class="ml-17 mt-3 text-lg capitalize outline-none"
                      :disabled="loadingReply"
                      @click="getReplyComment(comment._id)"
                      :class="darkMode ?`text-textSecondary`: `text-primary`">
                <template v-if="loadingReply">
                  <LoadingWhite></LoadingWhite>
                </template>
                <template v-else>{{ $t('more_reply') }}...</template>
              </button>
            </div>

          </div>
          <div class="pl-20 mt-3" v-if="commentId === comment._id">
            <ReplyComment :id="commentId"></ReplyComment>
          </div>
        </div>
      </div>
    </div>
    <!-- Sticker -->
    <Sticker v-if="isSticker"
             :sticker-grid="4"
             :parent-class="className"
             @closeSticker="()=>{this.isSticker = false}"
             @selectSticker="selectSticker($event)"
             :is-parent-class="true"
             default-position="border w-96 h-1/2 z-50 rounded-xl shadow-lg flex flex-col justify-between"></Sticker>

    <!-- Photo -->
    <PhotoView
        :id="payload.id"
        @closePhoto="()=>{this.isPhoto = false}"
        :photo="photo"
        v-if="isPhoto"></PhotoView>
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
import helper from "@/helper/helper";
import Sticker from "@/views/Video/components/Sticker";
import mode from "@/mixins/mode";
import CloseIcon from "@/components/CloseIcon";
import StickerView from "@/views/Video/components/StickerView";
import PhotoView from "@/views/Video/components/PhotoView";
import ReplyComment from "@/views/Video/components/ReplyComment";
import Comment from "@/views/Video/components/Comment";
import LoadingWhite from "@/components/LoadingWhite";

export default {
  name: "CommentDetail",
  components: {
    Comment,
    ReplyComment,
    PhotoView,
    StickerView,
    CloseIcon,
    VueMomentsAgo,
    Loading,
    SendMessageIcon,
    Avatar,
    SmileEmoji,
    ImageIcon,
    Sticker,
    LoadingWhite
  },
  mixins: [mode],
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['loadingComment', 'comments', 'replies'])
  },
  props: {
    social: {
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loadingReply: false,
      commentId: null,
      stickerUrl: null,
      isSticker: false,
      isPhoto: null,
      photo: {
        photoUrl: null,
        file: null
      },
      payload: {
        p: 1,
        id: this.social._id,
        type: this.social.type,
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
    reply(comment) {
      this.commentId = comment._id
    },
    getReplyComment(id) {
      let payload = {
        id
      }
      this.loadingReply = true
      this.$store.dispatch('social/getReply', payload).then(res => {
        this.loadingReply = false
      })
    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo.file = e.target.files[0]
        this.photo.photoUrl = URL.createObjectURL(e.target.files[0])
        this.isPhoto = true
      }
    },
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
      this.comment.id = this.social._id
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
  }
}
</script>

<style scoped>

</style>