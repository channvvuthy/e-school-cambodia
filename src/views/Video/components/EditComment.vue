<template>
  <div>
    <Modal width="w-4/12">
      <div class="flex justify-between p-5">
        <div class="font-black text-lg">{{ $t('edit_comment') }}</div>
        <div v-if="loading">
          <LoadingWhite></LoadingWhite>
        </div>
        <div v-else class="cursor-pointer" @click="closeComment">
          <CloseIcon></CloseIcon>
        </div>
      </div>
      <div class="border-b" :class="darkMode ? `border-button` : `` "></div>
      <div v-if="socialComment.content && socialComment.content.photo && isPhoto"
           class="max-h-96 overflow-hidden relative"
           @mouseover="()=>{this.isDelete = true}"
           @mouseleave="()=>{this.isDelete = false}"
      >
        <div
            v-if="isDelete"
            @click="deletePhoto"
            class="absolute right-4 top-4 rounded-full flex items-center justify-center bg-black bg-opacity-60 cursor-pointer w-8 h-8">
          <CloseIcon fill="#EAF3FF"></CloseIcon>
        </div>
        <img :src="socialComment.content.photo.url" alt="">
      </div>
      <StickerView
          @removeSticker="removeSticker"
          v-if="(socialComment.content.sticker && isViewSticker)" :sticker-url="stickerUrl"></StickerView>
      <div>
        <div class="flex h-20 flex items-center w-full mt-4 px-5 space-x-5"
        >
          <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
          <textarea
              ref="edit"
              v-model="socialComment.content.text"
              :placeholder="$t('2113')"
              class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>
          <div class="cursor-pointer" @click="()=>{this.isSticker = !this.isSticker}">
            <SmileEmoji :size="30" :fill="darkMode ?`#909090`: `#979797`"></SmileEmoji>
          </div>
          <div
              style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
            <input type="file" ref="socialCommentPhoto" @change="selectPhoto" accept="image/*" class="hidden">
            <div class="rounded-full h-9 w-9 flex items-center justify-center"
                 @click="()=>{this.$refs.socialCommentPhoto.click()}">
              <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></ImageIcon>
            </div>
          </div>

          <div
              v-if="isEditable"
              @click="postComment"
              style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
            <div class="rounded-full h-9 w-9 flex items-center justify-center">
              <SendMessageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></SendMessageIcon>
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

  </div>
</template>

<script>
import Modal from "../../../components/Modal";
import CloseIcon from "../../../components/CloseIcon";
import {mapActions, mapState} from "vuex";
import ImageIcon from "../../../components/ImageIcon";
import SmileEmoji from "./SmileEmoji";
import Avatar from "../../../Avatar";
import mode from "@/mixins/mode";
import Sticker from "@/views/Video/components/Sticker.vue";
import StickerView from "./StickerView";
import LoadingWhite from "@/components/LoadingWhite";
import SendMessageIcon from "@/components/SendMessageIcon";


export default {
  components: {
    CloseIcon,
    Modal,
    ImageIcon,
    SmileEmoji,
    Avatar,
    Sticker,
    StickerView,
    LoadingWhite,
    SendMessageIcon
  },
  mixins: [mode],
  props: {
    replyId: {
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      isSticker: false,
      isViewSticker: true,
      isDelete: false,
      isPhoto: true,
      photo: null,
      stickerUrl: "",
      stickerId: "",
      isPhotoUpdate: false,
      isStickerUpdate: false,
      loading: false,
      payload: {},
      isEditable: false
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile']),
    socialComment() {
      return this.$store.state.social.socialComment
    }
  },
  methods: {
    ...mapActions('upload', ['multiUpload']),
    ...mapActions('social', ['editComment']),
    setFocus() {
      setTimeout(() => {
        this.$refs.edit.focus()
      })
    },
    closeComment() {
      try {
        let originalSocialComment = JSON.parse(localStorage.getItem("originalSocialComment"))
        this.socialComment.content.text = originalSocialComment.content.text
        this.socialComment.content.photo = originalSocialComment.content.photo
        this.socialComment.content.sticker = originalSocialComment.content.sticker
      } catch (e) {
      }
      this.$emit("closeComment")

    },
    deletePhoto() {
      this.isEditable = true
      this.isPhoto = false
    },
    postComment() {
      if (!this.isEditable) {
        return;
      }

      this.payload.id = this.socialComment._id
      this.payload.text = this.socialComment.content.text

      if (this.socialComment.content.photo && this.isPhoto) {
        this.payload.photo = this.socialComment.content.photo
      }
      if (!this.isPhoto) {
        this.payload.photo = ""
      }
      if (this.socialComment.content.sticker) {
        this.payload.sticker = this.stickerId
      }

      this.loading = true
      if (this.isPhotoUpdate) {
        let photo = new FormData()
        photo.append("photo", this.photo)
        this.multiUpload(photo).then(res => {
          this.payload.photo = res.data[0]
          this.payload.sticker = ""
          this.editComment(this.payload).then(() => {
            this.loading = false
            this.socialComment.content.sticker = null
            this.$emit("closeComment")
          })
        }).finally(() => {
          this.loading = false
        })
        return
      }

      if (this.isStickerUpdate) {
        this.payload.sticker = this.stickerId
        this.payload.photo = ""
      }

      if (this.socialComment.content.hasOwnProperty('photo')) {
        try {
          this.socialComment.content.photo.url
        } catch (e) {
          this.$delete(this.payload, 'photo')
        }
      }

      if (!this.isStickerUpdate && !this.isPhotoUpdate) {
        this.$delete(this.payload, 'photo')
        this.$delete(this.payload, 'sticker')
      }

      this.editComment(this.payload).then(res => {
        this.socialComment.content.photo = null
        this.socialComment.content.sticker = res.content.sticker
        this.$emit("closeComment")
      }).finally(() => {
        this.loading = false
      })

    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.isEditable = true
        this.isPhotoUpdate = true
        this.isStickerUpdate = false
        this.photo = e.target.files[0]
        this.socialComment.content.photo = {
          url: URL.createObjectURL(e.target.files[0])
        }
        this.isViewSticker = false
        this.isPhoto = true
        this.setFocus()
      }
    },
    selectSticker(sticker) {
      this.isEditable = true
      this.isPhotoUpdate = false
      this.isStickerUpdate = true
      this.socialComment.sticker = sticker._id
      this.stickerId = sticker._id
      this.isSticker = false
      this.socialComment.content.sticker = {
        name: sticker.name
      }
      this.stickerUrl = sticker.sticker.name
      this.isViewSticker = true
      this.isPhoto = false
      this.setFocus()
    },
    removeSticker() {
      this.isViewSticker = false
    },
  },
  mounted() {
    localStorage.setItem("originalSocialComment", JSON.stringify(this.socialComment))
    this.stickerUrl = this.socialComment.content['sticker'] ? this.socialComment.content['sticker']['url'] : ""
  },
  created() {
    if (this.replyId) {
      this.payload.replyId = this.replyId
    }
  },
  watch: {
    'socialComment.content.text': function () {
      this.isEditable = true
    }
  }
}
</script>

<style scoped>

</style>