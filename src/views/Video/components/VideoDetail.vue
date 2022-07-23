<template>
  <div>
    <Modal @dismiss="dismiss($event)" width="w-11/12" radius="none">
      <div class="flex justify-between relative" style="height: 40rem">
        <div
          @click="dismiss($event)"
          class="
            rounded-full
            w-8
            h-8
            shadow
            bg-primary
            -right-3
            -top-5
            absolute
            flex
            items-center
            justify-center
            cursor-pointer
          "
        >
          <CloseIcon fill="#dadada" />
        </div>
        <div class="w-3/5 p-5 relative overflow-hidden h-full">
          <div v-if="loadingNext">
            <div
              class="
                bg-gradient-to-r
                from-gray-100
                via-gray-200
                to-gray-100
                background-animate
                w-full
              "
              style="height: 37.5rem"
            ></div>
          </div>
          <MediaPlayer
            v-else
            @ended="ended($event)"
            default-aspect-ratio="5:4"
            :is-auto-play="true"
            :isFullScreen="false"
            :video-url="feed.video.url"
            :post="feed"
          />
        </div>
        <div class="w-2/5 pt-5">
          <div
            class="
              border
              h-full
              border-b-0 border-r-0
              flex flex-col
              justify-between
            "
            :class="darkMode ? `border-button` : ``"
          >
            <div class="overflow-y-scroll h-full">
              <div class="p-5 flex space-x-3">
                <div @click="userDetail(post.user)">
                  <Avatar :avatar-url="feed.user.photo" :size="14" />
                </div>

                <div>
                  <div
                    class="text-lg font-semibold"
                    :class="darkMode ? `text-gray-300` : `text-primary`"
                  >
                    {{ feed.user.name }}
                  </div>
                  <div
                    :class="darkMode ? `border-button` : `border-roundBorder`"
                  >
                    <div v-if="post.type >= 51">
                      {{ $t("sponsored") }}
                    </div>
                    <div v-else>
                      {{ formatDate(post.date) }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- Caption -->
              <div class="px-5">
                <div
                  class="text-lg font-light mb-4"
                  v-if="feed.caption"
                  :class="darkMode ? `text-textSecondary` : ``"
                >
                  <div v-if="feed.caption.length > 100">
                    <span class="less" @click="seeMore">
                      {{ cutString(feed.caption, 100) }}
                      <span
                        class="capitalize cursor-pointer"
                        :class="darkMode ? `text-gray-300` : `text-primary`"
                      >
                        {{ $t("see_more") }}
                      </span>
                    </span>
                    <span class="more hidden">
                      {{ feed.caption }}
                    </span>
                  </div>
                  <div v-else>
                    {{ feed.caption }}
                  </div>
                </div>
              </div>

              <div
                class="flex items-center pl-5 justify-between border-b pb-4"
                :class="
                  darkMode ? `text-textSecondary border-button` : `text-primary`
                "
              >
                <div class="flex items-center space-x-16">
                  <div class="flex items-center space-x-2">
                    <div class="cursor-pointer">
                      <div v-if="feed.is_like" @click="disLikePost(feed)">
                        <LikeFillIcon
                          :size="22"
                          :fill="darkMode ? `#909090` : `#055174`"
                        />
                      </div>
                      <div @click="likePost(feed)" v-else>
                        <LikeIcon
                          :size="22"
                          :fill="darkMode ? `#909090` : `#4A4A4A`"
                        />
                      </div>
                    </div>
                    <div v-if="feed.total && feed.total.like">
                      {{ kFormatter(feed.total.like) }}
                    </div>
                  </div>
                  <div
                    class="flex items-center space-x-2"
                    v-if="feed.total && feed.total.seen"
                  >
                    <div>
                      <Eye
                        :size="30"
                        :fill="darkMode ? `#909090` : `#4A4A4A`"
                      />
                    </div>
                    <div>
                      {{ kFormatter(feed.total.seen) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-5 py-5">
                <div v-if="loading">
                  <div
                    v-for="index in 2"
                    :key="index + Math.random()"
                    class="border rounded py-3 px-4 mb-4"
                    :class="darkMode ? `border-button text-lightGray` : ``"
                  >
                    <Loading :grid="true" :number-of-columns="1" />
                  </div>
                </div>
                <div v-else>
                  <div v-if="comments.comments && comments.comments.length">
                    <div v-for="(comment, key) in comments.comments" :key="key">
                      <Comment :comment="comment" @reply="reply($event)" />
                      <div v-if="comment.reply_comment" class="pl-20">
                        <div
                          v-if="
                            replies.comment &&
                            replies.comment._id === comment._id
                          "
                        >
                          <div
                            v-for="(list, index) in replies.list"
                            :key="index"
                          >
                            <Comment
                              :avata-size="12"
                              :parent-comment-id="comment._id"
                              :comment="list"
                              @reply="reply($event)"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <Comment
                            :avata-size="12"
                            :parent-comment-id="comment._id"
                            :comment="comment.reply_comment"
                            @reply="reply($event)"
                          />

                          <button
                            class="ml-17 mt-3 text-lg capitalize outline-none"
                            :disabled="loadingReply"
                            @click="getReplyComment(comment._id)"
                            :class="
                              darkMode ? `text-textSecondary` : `text-primary`
                            "
                          >
                            <template v-if="loadingReply">
                              <LoadingWhite></LoadingWhite>
                            </template>
                            <template v-else
                              >{{ $t("more_reply") }}...</template
                            >
                          </button>
                        </div>
                      </div>
                      <div class="pl-20 mt-3" v-if="commentId === comment._id">
                        <ReplyComment :id="commentId" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              :class="darkMode ? `border-button` : `bg-comment`"
              class="
                h-20
                border-t
                flex
                items-center
                justify-between
                px-5
                space-x-4
                relative
              "
            >
              <div
                v-if="isCommentPhoto"
                :class="
                  darkMode
                    ? `border-b border-button bg-secondary`
                    : `bg-comment border-b`
                "
                class="absolute w-full h-24 left-0 -top-24 flex items-center"
              >
                <StickerView
                  :sticker-url="photo.photoUrl"
                  @removeSticker="
                    () => {
                      this.isCommentPhoto = false;
                    }
                  "
                />
              </div>
              <div
                v-if="comment.sticker"
                :class="
                  darkMode
                    ? `border-b border-button bg-secondary`
                    : `bg-comment border-b`
                "
                class="absolute w-full h-24 left-0 -top-24 flex items-center"
              >
                <StickerView
                  @removeSticker="removeSticker"
                  :sticker-url="stickerUrl"
                />
              </div>

              <textarea
                v-model="comment.text"
                @keyup.enter.exact="postComment"
                :placeholder="$t('2113')"
                class="outline-none w-full pt-6 bg-transparent"
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
                <SmileEmoji
                  :size="30"
                  :fill="darkMode ? `#909090` : `#979797`"
                />
              </div>

              <div
                style="background-color: rgba(5, 81, 116, 0.2)"
                class="rounded-full h-9 w-9 cursor-pointer"
              >
                <input
                  type="file"
                  ref="popupComment"
                  @change="selectPhoto"
                  accept="image/*"
                  class="hidden"
                />
                <div
                  class="rounded-full h-9 w-9 flex items-center justify-center"
                  @click="
                    () => {
                      this.$refs.popupComment.click();
                    }
                  "
                >
                  <ImageIcon
                    :fill="darkMode ? `#909090` : `#055174`"
                    :size="18"
                  />
                </div>
              </div>
              <div v-if="posting" class="pt-2">
                <div
                  class="rounded-full h-9 w-9 flex items-center justify-center"
                >
                  <LoadingWhite />
                </div>
              </div>
              <div
                v-else
                @click="postComment"
                style="background-color: rgba(5, 81, 116, 0.2)"
                class="rounded-full h-9 w-9 cursor-pointer"
              >
                <div
                  class="rounded-full h-9 w-9 flex items-center justify-center"
                >
                  <SendMessageIcon
                    :fill="darkMode ? `#909090` : `#055174`"
                    :size="18"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
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
      :id="feed._id"
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
import Modal from "@/components/Modal";
import Avatar from "@/Avatar";
import ChevronDown from "@/views/MyCourse/components/Chevron";
import { mapActions, mapState } from "vuex";
import helper from "@/helper/helper";
import Eye from "@/components/Eye";
import LikeIcon from "@/components/LikeIcon";
import LikeFillIcon from "@/components/LikeFillIcon";
import ChevronIcon from "@/components/ChevronIcon";
import Loading from "@/components/Loading";
import ImageIcon from "@/components/ImageIcon";
import SmileEmoji from "@/views/Video/components/SmileEmoji";
import Comment from "@/views/Video/components/Comment";
import LoadingWhite from "@/components/LoadingWhite";
import Sticker from "@/views/Video/components/Sticker";
import mode from "@/mixins/mode";
import PhotoView from "@/views/Video/components/PhotoView";
import ReplyComment from "@/views/Video/components/ReplyComment";
import StickerView from "@/views/Video/components/StickerView";
import FastAverageColor from "fast-average-color";
import MediaPlayer from "@/views/Video/components/MediaPlayer";
import moment from "moment";
import SendMessageIcon from "@/components/SendMessageIcon";
import Cropper from "@/views/Component/Cropper/Cropper";
import CloseIcon from "../../../components/CloseIcon";
const fac = new FastAverageColor();
export default {
  name: "PostDetail",
  props: {
    post: {
      default: () => {
        return {};
      },
    },
  },
  mixins: [mode],
  components: {
    CloseIcon,
    SendMessageIcon,
    MediaPlayer,
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
    PhotoView,
    Cropper,
  },
  computed: {
    ...mapState("setting", ["darkMode"]),
    ...mapState("auth", ["stProfile"]),
    ...mapState("social", ["comments", "replies"]),
  },
  data() {
    return {
      feed: this.post,
      posting: false,
      imgSrc: null,
      isCropper: false,
      isCommentPhoto: false,
      isPhoto: false,
      loadingReply: false,
      isSticker: false,
      stickerUrl: null,
      currentSlide: 0,
      payload: {
        p: 1,
      },
      color: "#000",
      loading: false,
      loadingNext: false,
      photo: {
        photoUrl: null,
        file: null,
      },
      commentId: null,
      comment: {
        text: null,
        type: this.post.type,
      },
    };
  },
  methods: {
    ...mapActions("social", ["deleteLike", "like", "addComment", "viewVideo"]),
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
    userDetail(user) {
      this.$router.push({
        name: "user",
        params: {
          user_id: user._id,
        },
      });
    },
    formatDate(day) {
      let currentDate = new Date();
      let today = moment(currentDate);
      let postDay = moment(day);
      let result = today.diff(postDay, "days");
      if (result === 1 || result === 0) {
        return moment(day).startOf("hour").fromNow();
      } else {
        return moment(day).format("LLL");
      }
    },
    ended(data) {
      try {
        this.loadingNext = true;
        this.payload.p++;
        this.payload.id = data._id;
        this.viewVideo(this.payload).then((res) => {
          if(res.next_video == undefined){
            this.feed = res.video
          }else{
            this.feed = res.next_video;
          }
          
          this.loadingNext = false;
          this.getComment();
        });
      } catch (e) {
        this.loadingNext = false;
      }
    },
    setParentColor(postIndex) {
      let interval = setInterval(() => {
        if (document.getElementById(postIndex) != null) {
          fac
            .getColorAsync(document.getElementById(postIndex))
            .then((color) => {
              document.getElementById(
                postIndex
              ).parentElement.style.backgroundColor = color.rgb;
              color.isDark
                ? (this.color = "#FFFFFF")
                : (this.color = "#000000");
            })
            .catch((error) => error);
          clearInterval(interval);
        }
      }, 50);
    },
    removeSticker() {
      this.stickerUrl = null;
      this.$delete(this.comment, "sticker");
    },
    selectSticker(sticker) {
      this.comment.sticker = sticker._id;
      this.isSticker = false;
      this.stickerUrl = sticker.sticker.name;
      this.isCommentPhoto = false;
    },
    getReplyComment(id) {
      let payload = {
        id,
      };
      this.loadingReply = true;
      this.$store.dispatch("social/getReply", payload).then((res) => {
        this.loadingReply = false;
      });
    },
    reply(comment) {
      this.commentId = comment._id;
    },
    postComment() {
      this.comment.id = this.replyId ? this.commentId : this.feed._id;
      let isComment = false;
      this.comment.text = this.comment.text
        ? this.comment.text.trim()
        : this.comment.text;

      if (this.comment.text != "") {
        isComment = true;
      }

      if (this.comment.sticker != undefined) {
        isComment = true;
      }

      if (this.comment.photo != undefined) {
        isComment = true;
      }
      if (this.isCommentPhoto) {
        isComment = true;
      }
      if (isComment) {
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
              this.addComment(this.comment).then((res) => {
                this.comment.text = "";
                this.$delete(this.comment, "sticker");
                this.$delete(this.comment, "photo");
                this.isCommentPhoto = false;
              });
            }
          });
        } else {
          this.addComment(this.comment).then((res) => {
            this.comment.text = "";
            this.$delete(this.comment, "sticker");
            this.$delete(this.comment, "photo");
            this.isCommentPhoto = false;
            this.posting = false;
          });
        }
      }
    },
    selectPhoto(e) {
      if (e.target.files && e.target.files.length) {
        this.photo.file = e.target.files[0];
        this.imgSrc = URL.createObjectURL(e.target.files[0]);
        this.isCropper = true;
      }
    },
    seeMore(e) {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextSibling.classList.toggle("hidden");
    },
    cutString(text, limit) {
      return helper.cutString(text, limit);
    },
    next(postIndex) {
      if (this.currentSlide < this.post.photo.length - 1) {
        this.currentSlide++;
      }
    },
    previous(postIndex) {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    disLikePost(post) {
      let payload = {
        id: post._id,
        type: post.type,
      };
      this.deleteLike(payload).then(() => {
        payload.liker = post.liker.filter(
          (item) => item._id != this.stProfile._id
        );
        this.$store.commit("social/removeLike", payload);
        this.post.is_like = 0;
      });
    },
    likePost(post) {
      let payload = {
        id: post._id,
        type: post.type,
      };
      this.like(payload).then(() => {
        this.post.is_like = 1;
      });
    },
    kFormatter(num) {
      return helper.kFormatter(num);
    },
    dismiss() {
      this.$emit("dismiss", true);
    },
    getComment() {
      try {
        this.loading = true;
        this.$store
          .dispatch("social/getComment", {
            id: this.feed._id,
            type: this.feed.type,
          })
          .then((res) => {
            this.loading = false;
          });
      } catch (e) {
        this.loading = false;
      }
    },
  },
  created() {
    this.getComment();
  },
};
</script>
<style>
.background-animate {
  background-size: 400%;
  animation: AnimationName 1s ease infinite;
}

@keyframes AnimationName {
  0%,
  100% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>