<template>
  <div>
    <div class="flex items-center space-x-3">
      <Avatar :avatar-url="stProfile.photo" :size="10" />
      <div
        :class="darkMode ? `bg-youtube` : `bg-forum`"
        class="flex items-center w-full space-x-3 rounded-full px-4 h-12"
      >
        <textarea
          v-model="comment.text"
          :placeholder="$t('reply')"
          class="outline-none w-full bg-transparent h-12 pt-3"
          style="resize: none"
        />
        <div
          class="cursor-pointer"
          @click="
            () => {
              this.isSticker = !this.isSticker;
            }
          "
        >
          <SmileEmoji :size="28" :fill="darkMode ? `#909090` : `#979797`" />
        </div>
        <div
          style="background-color: rgba(5, 81, 116, 0.2)"
          class="rounded-full h-8 w-8 cursor-pointer"
        >
          <input
            type="file"
            ref="replyPhoto"
            @change="selectPhoto"
            accept="image/*"
            class="hidden"
          />
          <div
            class="rounded-full h-8 w-8 flex items-center justify-center"
            @click="
              () => {
                this.$refs.replyPhoto.click();
              }
            "
          >
            <ImageIcon :fill="darkMode ? `#909090` : `#055174`" :size="18" />
          </div>
        </div>
        <div v-if="posting" class="pt-2">
          <div class="rounded-full h-9 w-9 flex items-center justify-center">
            <LoadingWhite />
          </div>
        </div>
        <div
          v-else
          @click="replyComment"
          style="background-color: rgba(5, 81, 116, 0.2)"
          class="rounded-full h-9 w-9 cursor-pointer"
        >
          <div class="rounded-full h-9 w-9 flex items-center justify-center">
            <SendMessageIcon
              :fill="darkMode ? `#909090` : `#055174`"
              :size="18"
            />
          </div>
        </div>
      </div>
    </div>
    <StickerView
      :sticker-url="photo.photoUrl"
      @removeSticker="
        () => {
          this.isCommentPhoto = false;
        }
      "
      v-if="isCommentPhoto"
    />
    <StickerView
      @removeSticker="removeSticker"
      v-if="comment.sticker"
      :sticker-url="stickerUrl"
    />
    <!-- Sticker -->
    <Sticker
      v-if="isSticker"
      :sticker-grid="4"
      :parent-class="className"
      @closeSticker="
        () => {
          this.isSticker = false;
        }
      "
      @selectSticker="selectSticker($event)"
      :is-parent-class="true"
      default-position="border w-96 h-1/2 z-50 rounded-xl shadow-lg flex flex-col justify-between"
    />

    <!-- Photo -->
    <PhotoView
      :is-reply="true"
      :id="id"
      @closePhoto="
        () => {
          this.isPhoto = false;
        }
      "
      :photo="photo"
      v-if="isPhoto"
    />
    <Cropper
      v-if="isCropper"
      @dismiss="
        () => {
          this.isCropper = false;
        }
      "
      :imgSrc="imgSrc"
      buttonText="post"
      @cropped="cropped($event)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ImageIcon from "@/components/ImageIcon";
import SmileEmoji from "@/views/Video/components/SmileEmoji";
import Avatar from "@/Avatar";
import PhotoView from "@/views/Video/components/PhotoView";
import Sticker from "@/views/Video/components/Sticker";
import StickerView from "@/views/Video/components/StickerView";
import SendMessageIcon from "@/components/SendMessageIcon";
import Cropper from "@/views/Component/Cropper/Cropper";
import LoadingWhite from "@/components/LoadingWhite";
import helper from "@/helper/helper";
export default {
  computed: {
    ...mapState("auth", ["stProfile"]),
    ...mapState("setting", ["darkMode","className"]),
  },
  components: {
    StickerView,
    Sticker,
    PhotoView,
    SmileEmoji,
    ImageIcon,
    Avatar,
    SendMessageIcon,
    Cropper,
    LoadingWhite,
  },
  props: {
    id: {
      default: () => null,
    },
  },
  data() {
    return {
      posting: false,
      imgSrc: null,
      isCropper: false,
      isCommentPhoto: false,
      isPhoto: false,
      isSticker: false,
      stickerUrl: null,
      photo: {
        photoUrl: null,
        file: null,
      },
      comment: {
        id: "",
        text: "",
      },
    };
  },
  methods: {
    ...mapActions("upload", ["singleUpload"]),
    cropped(data) {
      if (data == null) {
        this.photo.photoUrl = URL.createObjectURL(this.photo.file);
      } else {
        this.photo.photoUrl = data;
        this.photo.file = helper.dataURLtoBlob(data);
      }
      this.isCropper = false;
      this.isCommentPhoto = true;
      this.comment.sticker = "";
    },
    removeSticker() {
      this.stickerUrl = null;
      this.$delete(this.comment, "sticker");
    },
    selectSticker(sticker) {
      this.comment.sticker = sticker._id;
      this.isSticker = false;
      this.stickerUrl = sticker.sticker.name;
    },

    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo.file = e.target.files[0];
        this.imgSrc = URL.createObjectURL(e.target.files[0]);
        this.isCropper = true;
      }
    },
    replyComment() {
      this.posting = true;
      if (this.isCommentPhoto) {
        let formData = new FormData();
        formData.append("photo", this.photo.file);
        this.singleUpload(formData).then((res) => {
          this.posting = false;
          if (res.msg) {
            helper.errorMessage(res.msg);
          } else {
            this.comment.photo = {
              url: res.data.url,
            };
            this.$store
              .dispatch("social/replyComment", this.comment)
              .then(() => {
                this.comment.text = "";
                this.$delete(this.comment, "sticker");
                this.$delete(this.comment, "photo");
                this.isCommentPhoto = false;
                this.posting = false;
              });
          }
        });
      } else {
        this.$store
          .dispatch("social/replyComment", this.comment)
          .then(() => {
            this.comment.text = "";
            this.$delete(this.comment, "sticker");
            this.$delete(this.comment, "photo");
            this.isCommentPhoto = false;
            this.posting = false;
          });
      }
    },
  },
  created() {
    this.comment.id = this.id;
  },
};
</script>