<template>
  <div>
    <Modal width="w-4/12">
      <div class="flex justify-between p-5">
        <div class="font-black text-lg">{{ $t('edit_comment') }}</div>
        <div class="cursor-pointer" @click="closeComment">
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
              v-model="socialComment.content.text"
              @keyup.enter.exact="postComment"
              :placeholder="$t('2113')"
              class="outline-none w-full pt-6 bg-transparent" style="resize: none"></textarea>
          <div class="cursor-pointer" @click="()=>{this.isSticker = !this.isSticker}">
            <SmileEmoji :size="30" :fill="darkMode ?`#909090`: `#979797`"></SmileEmoji>
          </div>
          <div style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-9 w-9 cursor-pointer">
            <input type="file" ref="socialCommentPhoto" @change="selectPhoto" accept="image/*" class="hidden">
            <div class="rounded-full h-9 w-9 flex items-center justify-center"
                 @click="()=>{this.$refs.socialCommentPhoto.click()}">
              <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></ImageIcon>
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
import {mapState} from "vuex";
import ImageIcon from "../../../components/ImageIcon";
import SmileEmoji from "./SmileEmoji";
import Avatar from "../../../Avatar";
import mode from "@/mixins/mode";
import Sticker from "@/views/Video/components/Sticker";
import StickerView from "./StickerView";

export default {
  components: {
    CloseIcon,
    Modal,
    ImageIcon,
    SmileEmoji,
    Avatar,
    Sticker,
    StickerView
  },
  mixins: [mode],
  data() {
    return {
      isSticker: false,
      isViewSticker: true,
      isDelete: false,
      isPhoto: true,
      photo: null,
      stickerUrl: null,
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile']),
    ...mapState('social', ['socialComment'])
  },
  methods: {
    closeComment() {
      this.$emit("closeComment")
    },
    deletePhoto() {
      this.isPhoto = false
    },
    postComment() {

    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo = e.target.files[0]
        this.socialComment.content.photo = {
          url: URL.createObjectURL(e.target.files[0])
        }
        this.isPhoto = true
        this.isViewSticker = false
      }
    },
    selectSticker(sticker) {
      this.socialComment.sticker = sticker._id
      this.isSticker = false
      this.socialComment.content.sticker.url = sticker.name
      this.stickerUrl = sticker.sticker.name
      this.isViewSticker = true
      this.isPhoto = false
    },
    removeSticker() {
      this.isViewSticker = false
    },
  },
  mounted() {
    this.stickerUrl = this.socialComment.content.sticker ? this.socialComment.content.sticker.url : null
  }
}
</script>

<style scoped>

</style>