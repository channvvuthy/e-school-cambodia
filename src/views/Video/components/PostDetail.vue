<template>
  <div>
    <Modal
        @dismiss="dismiss($event)"
        width="w-11/12"
        radius="none">
      <div class="flex justify-between" style="height: 40rem;">
        <div class="w-3/5 p-5 relative">
          <div
              class="absolute bg-black z-50 text-sm text-white font-PoppinsMedium rounded-md bg-opacity-80 bottom-24 left-10"
              v-if="isStyle"
          >
            <div
                @click="()=>{
                  this.original = true;
                  this.isStyle = false;
                }"
                class="flex items-center space-x-3 justify-between p-3 cursor-pointer border-b border-instagram">
              <div :class="original ? `text-white`: `text-instagram`">
                Original
              </div>
              <div>
                <ImageIcon :fill="original === true ? '#FFF': '#8e8e8e'" :width="23"></ImageIcon>
              </div>
            </div>
            <div
                @click="()=>{
                  this.original = false;
                  this.isStyle = false;
                }"
                class="flex items-center justify-between cursor-pointer p-3"
                :class="original ? `text-instagram`: `text-white`">
              <div>
                1 : 1
              </div>
              <div class="border rounded w-6 h-6" :class="original ? `border-instagram`: `border-white`"></div>
            </div>
          </div>
          <div
              @click="()=>{this.isStyle =! this.isStyle}"
              class="cursor-pointer absolute w-10 h-10 bg-black rounded-full z-50 flex items-center justify-center bg-opacity-60 bottom-10 left-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#abaeb3">
              <path d="M24 13h-4v-9h-9v-4h13v13zm-24 11h13v-4h-9v-9h-4v13z"/>
            </svg>
          </div>
          <div
              class="w-full h-full"
              :class="original ?`flex items-center justify-center` : ``"
              v-for="(photo, index) in post.photo" v-if="index === currentSlide">
            {{ setParentColor(`postDetail${index}`) }}
            <img
                :id="`postDetail${index}`"
                :src="photo.url"
                :class="original ?`max-h-full`: `w-full object-cover h-full`">
          </div>
          <div
              v-if="post.photo && post.photo.length > 1"
              class="flex items-center justify-between h-full w-full absolute left-0 object-cover top-0 px-10">
            <div
                :class="currentSlide > 0 ? `visible` : `invisible`"
                @click="previous"
                class="transform rotate-90 cursor-pointer">
              <ChevronIcon :size="40" :fill="color"></ChevronIcon>
            </div>
            <div
                v-if="currentSlide < (post.photo.length - 1)"
                @click="next"
                class="transform -rotate-90 cursor-pointer">
              <ChevronIcon :size="40" :fill="color"></ChevronIcon>
            </div>
          </div>
        </div>
        <div class="w-2/5 pt-5">
          <div class="border h-full border-b-0 border-r-0 flex flex-col justify-between"
               :class="darkMode ? `border-button`: ``">
            <div class="overflow-y-scroll h-full">
              <div class="p-5 flex space-x-3">
                <Avatar :avatar-url="post.user.photo" :size="14"></Avatar>
                <div>
                  <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">
                    {{ post.user.name }}
                  </div>
                  <div :class="darkMode ? `border-button` : `border-roundBorder` ">
                    {{ formatDate(post.date) }}
                  </div>
                </div>
              </div>

              <!-- Caption -->
              <div class="px-5">
                <div class="text-lg font-light mb-4"
                     v-if="post.caption"
                     :class="darkMode ? `text-textSecondary` : ``">
                  <div v-if="post.caption.length > 100">
                  <span class="less"
                        @click="seeMore"
                  >{{ cutString(post.caption, 100) }} <span
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
              </div>

              <div class="flex items-center pl-5 justify-between border-b pb-4"
                   :class="darkMode ? `text-textSecondary border-button` : `text-primary`">
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
              </div>
              <div class="px-5 py-5">
                <div v-if="loading">
                  <div
                      v-for="index in 2" :key="index + Math.random()"
                      class="border rounded py-3 px-4 mb-4"
                      :class="darkMode ? `border-button text-lightGray` : ``">
                    <Loading :grid="true" :number-of-columns="1"></Loading>
                  </div>
                </div>
                <div v-else>
                  <div v-if="comments.comments && comments.comments.length">
                    <div v-for="(comment, key) in comments.comments" :key="key">
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
              </div>
            </div>
            <div
                :class="darkMode ? `border-button` : `bg-comment`"
                class="h-20 border-t flex items-center justify-between px-5 space-x-4 relative">
              <div
                  v-if="comment.sticker"
                  :class="darkMode ? `border-b border-button bg-secondary` : `bg-comment border-b`"
                  class="absolute w-full h-24 left-0 -top-24 flex items-center">
                <StickerView
                    @removeSticker="removeSticker"
                    :sticker-url="stickerUrl"></StickerView>
              </div>

              <textarea
                  v-model="comment.text"
                  @keyup.enter.exact="postComment"
                  :placeholder="$t('2113')"
                  class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>

              <div class="cursor-pointer" @click="()=>{this.isSticker = !this.isSticker}">
                <SmileEmoji :size="30" :fill="darkMode ?`#909090`: `#979797`"></SmileEmoji>
              </div>

              <div style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
                <input type="file" ref="popupComment" @change="selectPhoto" accept="image/*" class="hidden">
                <div class="rounded-full h-9 w-9 flex items-center justify-center"
                     @click="()=>{this.$refs.popupComment.click()}">
                  <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></ImageIcon>
                </div>
              </div>
              <div
                  @click="postComment"
                  style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
                <div class="rounded-full h-9 w-9 flex items-center justify-center">
                  <SendMessageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></SendMessageIcon>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Modal>
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
        :id="post._id"
        :postType="post.type"
        @closePhoto="()=>{this.isPhoto = false}"
        :photo="photo"
        v-if="isPhoto"></PhotoView>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import Avatar from "@/Avatar";
import ChevronDown from "@/views/MyCourse/components/Chevron";
import {mapActions, mapState} from "vuex";
import helper from "@/helper/helper";
import Eye from "@/components/Eye";
import LikeIcon from "@/components/LikeIcon";
import LikeFillIcon from "@/components/LikeFillIcon";
import ChevronIcon from "@/components/ChevronIcon";
import Loading from "@/components/Loading";
import ImageIcon from "@/components/ImageIcon.vue";
import SmileEmoji from "@/views/Video/components/SmileEmoji";
import Comment from "@/views/Video/components/Comment";
import LoadingWhite from "@/components/LoadingWhite";
import Sticker from "@/views/Video/components/Sticker";
import mode from "@/mixins/mode";
import PhotoView from "@/views/Video/components/PhotoView";
import ReplyComment from "@/views/Video/components/ReplyComment";
import StickerView from "@/views/Video/components/StickerView";
import FastAverageColor from "fast-average-color";
import moment from "moment";
import SendMessageIcon from "@/components/SendMessageIcon";

const fac = new FastAverageColor();
export default {
  name: "PostDetail",
  props: {
    post: {
      default: () => {
        return {}
      }
    }
  },
  mixins: [mode],
  components: {
    SendMessageIcon,
    StickerView,
    ReplyComment,
    Sticker,
    LoadingWhite,
    Comment,
    SmileEmoji,
    ImageIcon,
    Loading,
    LikeFillIcon,
    LikeIcon,
    Eye,
    Avatar,
    Modal,
    ChevronDown,
    ChevronIcon,
    PhotoView
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile']),
    ...mapState('social', ['comments', 'replies'])
  },
  data() {
    return {
      isStyle: false,
      original: true,
      isPhoto: false,
      loadingReply: false,
      isSticker: false,
      stickerUrl: null,
      currentSlide: 0,
      payload: {},
      color: "#000",
      loading: false,
      photo: {
        photoUrl: null,
        file: null
      },
      commentId: null,
      comment: {
        text: null,
        type: this.post.type,
      }
    }
  },
  methods: {
    ...mapActions('social', ['deleteLike', 'like', 'addComment']),
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
    setParentColor(postIndex) {
      let interval = setInterval(() => {
        if (document.getElementById(postIndex) != null) {
          fac.getColorAsync(document.getElementById(postIndex))
              .then(color => {
                document.getElementById(postIndex).parentElement.style.backgroundColor = color.rgb
                color.isDark ? this.color = "#FFFFFF" : this.color = "#000000"
              }).catch(error => error);
          clearInterval(interval)
        }
      }, 50)
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
    getReplyComment(id) {
      let payload = {
        id
      }
      this.loadingReply = true
      this.$store.dispatch('social/getReply', payload).then(res => {
        this.loadingReply = false
      })
    },
    reply(comment) {
      this.commentId = comment._id
    },
    postComment() {
      this.comment.id = this.replyId ? this.commentId : this.post._id
      let isComment = false
      this.comment.text = this.comment.text ? this.comment.text.trim() : this.comment.text

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
    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo.file = e.target.files[0]
        this.photo.photoUrl = URL.createObjectURL(e.target.files[0])
        this.isPhoto = true
      }
    },
    seeMore(e) {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextSibling.classList.toggle("hidden")
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    next(postIndex) {
      if (this.currentSlide < (this.post.photo.length - 1)) {
        this.currentSlide++
      }
    },
    previous(postIndex) {
      if (this.currentSlide > 0) {
        this.currentSlide--
      }
    },
    disLikePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.deleteLike(payload).then(() => {
        this.post.is_like = 0
        payload.liker = post.liker.filter(item => item._id != this.stProfile._id)
        this.$store.commit('social/removeLike', payload)
      })

    },
    likePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.like(payload).then(() => {
        this.post.is_like = 1
      })
    },
    kFormatter(num) {
      return helper.kFormatter(num)
    },
    dismiss() {
      this.$emit('dismiss', true)
    },
    getComment() {
      this.loading = true
      this.$store.dispatch('social/getComment',
          {
            id: this.post._id,
            type: this.post.type
          }
      ).then(res => {
        this.loading = false
      })
    }
  },
  created() {
    this.getComment()
    this.original = false
  }
}
</script>

<style scoped>

</style>