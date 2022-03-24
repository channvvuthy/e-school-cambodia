<template>
  <div>
    <div class="flex items-center space-x-3">
      <Avatar :avatar-url="stProfile.photo" :size="10"></Avatar>
      <div
          :class="darkMode ? `bg-youtube` : `bg-forum`"
          class="flex items-center w-full space-x-3 rounded-full px-4 h-12">
        <textarea
            v-model="comment.text"
            @keyup.enter.exact="replyComment"
            :placeholder="$t('reply')"
            class="outline-none w-full bg-transparent h-12 pt-3" style="resize: none"></textarea>
        <div class="cursor-pointer" @click="()=>{this.isSticker = !this.isSticker}">
          <SmileEmoji :size="28" :fill="darkMode ?`#909090`: `#979797`"></SmileEmoji>
        </div>
        <div style="background-color: rgba(5,81,116,0.2)" class="rounded-full h-8 w-8 cursor-pointer">
          <input type="file" ref="replyPhoto" @change="selectPhoto" accept="image/*" class="hidden">
          <div class="rounded-full h-8 w-8 flex items-center justify-center"
               @click="()=>{this.$refs.replyPhoto.click()}">
            <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"></ImageIcon>
          </div>
        </div>
      </div>
    </div>
    <StickerView
        @removeSticker="removeSticker"
        v-if="comment.sticker" :sticker-url="stickerUrl"></StickerView>
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
        :is-reply="true"
        :id="id"
        @closePhoto="()=>{this.isPhoto = false}"
        :photo="photo"
        v-if="isPhoto"></PhotoView>
  </div>
</template>

<script>
import {mapState} from "vuex";
import ImageIcon from "@/components/ImageIcon";
import SmileEmoji from "@/views/Video/components/SmileEmoji";
import Avatar from "@/Avatar";
import PhotoView from "@/views/Video/components/PhotoView";
import Sticker from "@/views/Video/components/Sticker";
import mode from "@/mixins/mode";
import StickerView from "@/views/Video/components/StickerView";

export default {
  name: "ReplyComment",
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode'])
  },
  components: {
    StickerView,
    Sticker,
    PhotoView,
    SmileEmoji,
    ImageIcon,
    Avatar
  },
  mixins: [mode],
  props: {
    id: {
      default: () => null
    },
  },
  data() {
    return {
      isPhoto: false,
      isSticker: false,
      stickerUrl: null,
      photo: {
        photoUrl: null,
        file: null
      },
      comment: {
        id: '',
        text: ''
      }
    }
  },
  methods: {
    removeSticker() {
      this.stickerUrl = null
      this.$delete(this.comment, 'sticker')
    },
    selectSticker(sticker) {
      this.comment.sticker = sticker._id
      this.isSticker = false
      this.stickerUrl = sticker.sticker.name
    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo.file = e.target.files[0]
        this.photo.photoUrl = URL.createObjectURL(e.target.files[0])
        this.isPhoto = true
      }
    },
    replyComment() {
      this.$store.dispatch('social/replyComment', this.comment).then(res => {
        this.comment.text = ''
        this.$delete(this.comment, 'sticker')
        this.$delete(this.comment, 'photo')
      })
    }
  },
  created() {
    this.comment.id = this.id
  }
}
</script>

<style scoped>

</style>