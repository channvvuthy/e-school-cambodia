<template>
  <div>
    <BuyMsg @cancelModal="cancelModal" @yes="yes" v-if="showBuy"/>
    <ModalPhoto
        v-if="showModalPhoto"
        :imgUrl="imgUrl"
        @cancel="cancel"
        @send="send($event)"
    />
    <Cart
        v-if="showCart"
        @closeCart="closeCart"
        @showInvoice="
        (data) => {
          this.showCart = false;
          this.showReceipt = true;
          this.receiptDetail = data;
        }
      "
    />
    <!-- Receipt info -->
    <ReceiptInfo
        v-if="showReceipt"
        :receiptDetail="receiptDetail"
        @closeInfo="
        () => {
          this.showReceipt = false;
        }
      "
    />

    <div class="flex mt-5 ml-5 relative">
      <Exam v-if="showExam" @exit="exit"/>
      <div class="w-3/5">
        <div v-if="loading">
          <video poster="/poster-home.png">
            <source src=""/>
          </video>
        </div>
        <div
            class="shadow pb-2 flex-1"
            :class="darkMode ? `bg-youtube text-gray-300` : `bg-white `"
            v-else
        >
          <VideoPlaylist
              @endedVideo="endedVideo"
              @lastWatchVideo="lastWatchVideo($event)"
              :_id="video._id"
          />
          <div class="mx-5 mt-6">
            <div
                class="font-semibold text-sm"
                :class="darkMode ? `text-white` : `text-primary`"
            >
              {{ video.order }}. {{ video.title }}
            </div>
            <div class="h-5"></div>
            <div class="flex justify-between items-center mb-3">
              <div class="flex text-sm">
                <div class="flex items-center">
                  <div>
                    <Eye :fill="darkMode ? `#E5E7EB` : `#4A4A4A`"/>
                  </div>
                  <div class="mx-2">{{ kFormatter(video.view) }}</div>
                  <div>{{ $t("1003") }}</div>
                </div>
              </div>
              <div
                  class="flex items-center cursor-pointer"
                  v-if="
                  $route.params.course.has_certificate &&
                  $route.params.course.is_buy
                "
                  @click="courseQuiz($route.params.course._id)"
              >
                <div class="mr-3">
                  <CertificateIcon :fill="darkMode ? `#909090` : `#000000`"/>
                </div>
                <div>{{ $t("2117") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div
            v-if="showMenu"
            class="
            h-14
            w-full
            leading-14
            flex-1
            ml-5
            flex
            justify-between
            text-center text-lg
            font-medium
          "
            :class="
            darkMode
              ? `bg-secondary border-b border-button text-gray-300`
              : `bg-white border border-b-0`
          "
        >
          <div
              @click="switchMenu('video')"
              class="flex flex-col flex-1 justify-center cursor-pointer h-full"
              :class="
              active === 'video'
                ? darkMode
                  ? `text-white`
                  : `text-primary`
                : ``
            "
          >
            {{ $t("2108") }}
            <div class="relative -bottom-4 px-4" v-if="active === 'video'">
              <BorderBottom :class="darkMode ? `bg-white` : `bg-primary`"/>
            </div>
          </div>
          <div
              class="
              flex flex-col flex-1
              justify-center
              cursor-pointer
              relative
              h-full
            "
              @click="switchMenu('document')"
              :class="
              active === 'document'
                ? darkMode
                  ? `text-white`
                  : `text-primary`
                : ``
            "
          >
            {{ $t("1112") }}
            <div class="relative -bottom-4 px-4" v-if="active === 'document'">
              <BorderBottom :class="darkMode ? `bg-white` : `bg-primary`"/>
            </div>
          </div>
          <div
              class="
              flex flex-col flex-1
              justify-center
              cursor-pointer
              relative
              h-full
            "
              @click="switchMenu('forum')"
              :class="
              active === 'forum'
                ? darkMode
                  ? `text-white`
                  : `text-primary`
                : ``
            "
          >
            {{ $t("2110") }}
            <div class="relative -bottom-4 px-4" v-if="active === 'forum'">
              <BorderBottom :class="darkMode ? `bg-white` : `bg-primary`"/>
            </div>
          </div>
          <div
              class="
              flex flex-col flex-1
              justify-center
              cursor-pointer
              relative
              h-full
            "
              @click="switchMenu('quiz')"
              :class="
              active === 'quiz'
                ? darkMode
                  ? `text-white`
                  : `text-primary`
                : ``
            "
          >
            {{ $t("2111") }}
            <div class="relative -bottom-4 px-4" v-if="active === 'quiz'">
              <BorderBottom :class="darkMode ? `bg-white` : `bg-primary`"/>
            </div>
          </div>
        </div>
        <div v-if="!showMenu" class="px-5 h-14 w-full leading-14 text-lg flex-1 ml-5 flex justify-between text-center items-center"
             :class="darkMode ? `bg-secondary text-gray-300` : `bg-white border`">
          <div class="shadow rounded-md flex justify-center items-center h-8 px-2 mr-4 cursor-pointer "
               @click="backMenu">
            <BackIcon
                :width="20"
                :height="20"
                :fill="darkMode ? `#afb0b4` : `#000000`"
            />
          </div>
          <div class="text-center flex-1">
            {{ video.order }}. {{ cutString(video.title, 20) }}
          </div>
        </div>
        <Playlist
            v-if="active === 'video'"
            @nextVideo="nextVideo($event)"
            @buyNow="buyNow($event)"
        />
        <Document
            v-if="active === 'document'"
            :id="video._id"
            @openDoc="openDoc($event)"
        />
        <Forum
            v-if="active === 'forum' && showMenu"
            :id="video._id"
            @forumDetail="forumDetail($event)"
            @openModal="openModal($event)"
            @postComment="postComment($event)"
            @noReply="noReply"
        />

        <ForumComment
            v-if="!showMenu"
            :comments="comments"
            :loading="loadingComment"
            @openModal="openModal($event)"
            @reply="reply"
            @replyTextComment="replyTextComment($event)"
            @loadMoreComment="loadMoreComment($event)"
        />
        <Quiz v-if="active === 'quiz'" @startingExam="startingExam($event)"/>
      </div>
    </div>
    <div
        class="
        fixed
        w-full
        h-full
        left-0
        top-0
        bg-black bg-opacity-90
        z-50
        flex
        justify-center
        items-center
      "
        v-if="showDoc"
    >
      <div class="bg-white w-2/5 h-5/6 overflow-y-hidden rounded">
        <div
            class="flex justify-between items-center p-4"
            :class="darkMode ? `bg-secondary` : `bg-primary`"
        >
          <div
              class="border border-white cursor-pointer"
              style="padding: 1px"
              @click="openFullscreen"
          >
            <EnlargeIcon :size="16"/>
          </div>
          <div class="text-white text-lg" :title="video.title">
            {{ cutString(video.title, 50) }}
          </div>
          <div class="cursor-pointer" @click="closeDock">
            <CloseIcon fill="#ffffff" :width="22"/>
          </div>
        </div>
        <div id="fullScreen" class="h-full overflow-y-scroll pb-10">
          <SinglePdf :pdfUrl="pdfUrl" :darkMode="darkMode"/>
        </div>
      </div>
    </div>
    <input type="hidden" id="video" :value="video._id"/>
  </div>
</template>
<script>
import EnlargeIcon from "./../../components/EnlargeIcon.vue";
import CloseIcon from "./../../components/CloseIcon.vue";
import BackIcon from "./../../components/BackIcon.vue";
import Playlist from "./components/Playlist.vue";
import Document from "./components/Document.vue";
import Quiz from "./components/Quiz.vue";
import ModalPhoto from "./components/ModalPhoto.vue";
import ForumComment from "./components/ForumComment.vue";
import Forum from "./components/Forum.vue";
import BorderBottom from "./../../components/BorderBottom.vue";
import Eye from "./../../components/Eye.vue";
import VideoPlaylist from "./ads/VideoPlaylist.vue";
import SinglePdf from "./../Component/SinglePdf.vue";
import {mapState, mapActions} from "vuex";
import helper from "./../../helper/helper";
import Exam from "./components/Exam";
import BuyMsg from "./../Component/BuyMsg.vue";
import Cart from "./../Component/Cart.vue";
import ReceiptInfo from "./../MyCourse/components/ReceiptInfo.vue";
import CertificateIcon from "./../../components/CertificateIcon.vue";

export default {
  data() {
    return {
      hasFree: false,
      videoUrl: "",
      video: {},
      active: "video",
      loading: false,
      showDoc: false,
      pdfUrl: "",
      showMenu: true,
      comments: [],
      loadingComment: false,
      showModalPhoto: false,
      imgUrl: "",
      photo: null,
      isReply: false,
      showExam: false,
      showBuy: false,
      showCart: false,
      showReceipt: false,
      receiptDetail: {},
      window: {
        width: null,
      },
    };
  },
  components: {
    VideoPlaylist,
    Eye,
    Playlist,
    Document,
    SinglePdf,
    EnlargeIcon,
    CloseIcon,
    Forum,
    BackIcon,
    ForumComment,
    ModalPhoto,
    Quiz,
    Exam,
    BuyMsg,
    Cart,
    ReceiptInfo,
    BorderBottom,
    CertificateIcon,
  },
  computed: {
    ...mapState("video", ["playlist"]),
    ...mapState("setting", ["darkMode"]),
    ...mapState("quiz", ["certificatesQuiz"]),
  },
  methods: {
    ...mapActions("video", ["getPlaylist"]),
    ...mapActions("forum", [
      "getCommentForum",
      "addComment",
      "replyComment",
      "showCommentPagination",
    ]),
    ...mapActions("playVideo", ["playVideo", "stopWatch"]),
    ...mapActions("favorite", ["add", "removeFavorite"]),
    ...mapActions("cart", ["addCart", "getCart"]),
    ...mapActions("quiz", ["getQuizCertificate"]),

    closeCart() {
      this.showCart = false;
    },
    cancelModal() {
      this.showBuy = false;
    },
    yes() {
      this.showBuy = false;
      this.showCart = true;
      let payload = new FormData();
      payload.append("id", this.playlist.course._id);
      this.addCart(payload).then(() => {
        this.getCart();
      });
    },
    courseQuiz(id) {
      this.getQuizCertificate({id}).then(() => {
        this.$router.push({
          name: "course-quiz",
          params: {course: this.$route.params.course},
        });
      });
    },
    buyNow() {
      this.showBuy = true;
    },
    startingExam() {
      this.showExam = true;
    },
    removeMyFavorite(id) {
      this.removeFavorite(id).then(() => {
        this.video.is_favorite = 0;
      });
    },
    cutString(text, limit) {
      return helper.cutString(text, limit);
    },
    kFormatter(num) {
      return helper.kFormatter(num);
    },
    openFullscreen() {
      let elem = document.getElementById("fullScreen");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    },
    closeDock() {
      this.showDoc = false;
    },
    openDoc(pdfUrl) {
      this.pdfUrl = pdfUrl;
      this.showDoc = true;
    },
    addFavorite(id) {
      this.add(id).then(() => {
        this.video.is_favorite = 1;
      });
    },
    reply() {
      this.isReply = true;
    },
    noReply() {
      this.isReply = false;
    },
    forumDetail($event) {
      this.showMenu = false;
      this.loadingComment = true;
      this.getCommentForum({id: $event._id}).then((res) => {
        this.comments = res;
        this.loadingComment = false;
      });
    },
    loadMoreComment(payload) {
      this.showCommentPagination(payload).then((res) => {
        for (let i = 0; i < res.comment.length; i++) {
          this.comments.comment.push(res.comment[i]);
        }
      });
    },
    backMenu() {
      this.showMenu = true;
    },
    endedVideo() {
      let nextOrder = parseInt(this.video.order) + 1;
      let nextVideo = this.playlist.list.filter(
          (item) => item.order === nextOrder
      );
      if (nextVideo.length) {
        nextVideo = nextVideo[0];
        if (this.canWatch(nextVideo.free_watch)) {
          this.nextVideo(nextVideo);
        }
      }
    },
    canWatch(free_watch) {
      return !!(this.$route.params.course.is_buy || free_watch);
    },
    nextVideo(event) {
      if (event.order === this.video.order) {
        return;
      }

      if (event.last_watch) {
        if (event.last_watch.duration) {
          if (event.last_watch.duration == event.last_watch.mark) {
            this.$store.commit("playVideo/setLastWatched", 0);
          }
        } else {
          this.$store.commit("playVideo/setLastWatched", event.last_watch.mark);
        }
      } else {
        this.$store.commit("playVideo/setLastWatched", 0);
      }

      this.$store.commit("video/setOrder", event.order);
      this.loading = true;
      this.video = event;
      this.$store.commit("playVideo/getVideoUrl", event.video);
      this.$store.commit("playVideo/isDownload", event._id);
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },
    openModal(event) {
      this.showModalPhoto = true;
      this.photo = event.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    },
    lastWatchVideo(event) {
      event.id = this.video._id;
      this.stopWatch(event).then(() => {
        let percentage = (event.mark * 100) / event.duration;
        percentage = Math.round(percentage);
        event.percentage = percentage;
        this.$store.commit("video/updatingProgressbar", event);
      });
    },
    switchMenu(active) {
      this.active = active;
    },
    cancel() {
      this.showModalPhoto = false;
    },
    postComment(event) {
      let formData = new FormData();
      formData.append("id", this.video._id);
      if (event) {
        formData.append("text", event);
      }
      this.addComment(formData);
    },
    replyTextComment(data) {
      this.replyComment(data).then((res) => {
        this.comments.comment.push(res.data.data);
      });
    },
    send(event) {
      let formData = new FormData();
      if (event) {
        formData.append("text", event);
      }
      if (this.isReply) {
        formData.append("id", this.comments.forum._id);
        formData.append("photo", this.photo);
        this.replyComment(formData).then((res) => {
          this.comments.comment.push(res.data.data);
          this.showModalPhoto = false;
        });
      } else {
        formData.append("photo", this.photo);
        formData.append("id", this.video._id);
        this.addComment(formData).then(() => {
          this.showModalPhoto = false;
        });
      }
    },
    exit() {
      this.showExam = false;
    },
    handleResize() {
      this.window.width = window.innerWidth;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);

    this.handleResize();
    if (this.window.width <= 1440) {
      this.$store.commit("setting/toggleSidebar", true);
    }
    this.loading = true;
    let payload = {
      id: this.$route.params.course["_id"],
    };

    if (this.$route.params.course["package_id"]) {
      payload.package_id = this.$route.params.course["package_id"];
    }

    this.getPlaylist(payload).then((res) => {
      let freeVideo;

      if (res.data.data.is_buy) {
        freeVideo = res.data.data.list;
      } else {
        freeVideo = res.data.data.list.filter((item) => item.free_watch === 1);
      }
      let order = 0;
      if (this.$route.params.course["order"]) {
        order = this.$route.params.course["order"];
      } else if (this.$route.params.course["last_watch"]) {
        order = this.$route.params.course["last_watch"]["order"];
        this.$store.commit(
            "playVideo/setLastWatched",
            this.$route.params.course["last_watch"]["mark"]
        );
      } else {
        order = freeVideo.map((item) => item.order);

        order = Math.min(...order) == Infinity ? 0 : Math.min(...order);

        this.$store.commit("playVideo/setLastWatched", 0);
      }

      this.$store.commit("video/setOrder", order);
      freeVideo = freeVideo.filter((item) => item.order == order);

      if (freeVideo.length >= 1) {
        this.hasFree = true;
        let video = freeVideo.map((item) => item)[0];
        this.video = video;
        this.$store.commit("playVideo/getVideoUrl", video.video);
        this.$store.commit("playVideo/isDownload", video._id);

        this.loading = false;
        this.playVideo(this.video["_id"]);
      }
    });
  },
};
</script>
<style>
.bt-shadow {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>