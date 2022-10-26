<template>
  <div class="my-course font-siemreap">
    <div class="px-5 mt-5 h-screen overflow-y-scroll pb-40" @scroll="onScroll">
      <div
        v-if="loadingCourse"
        class="flex justify-center items-center h-screen relative -top-5"
      >
        <h1 class="text-sm font-semibold font-khmer_os relative -top-32">
          <loading></loading>
        </h1>
      </div>
      <div class="mb-5" v-if="myCourses.package && myCourses.package.length">
        <Pkg :packages="myCourses.package"></Pkg>
      </div>
      <div
        class="flex justify-center items-center h-screen pb-40"
        v-if="!isEmpty(myCourses.list)"
      >
        <div class="text-center relative">
          <Empty></Empty>
        </div>
      </div>
      <div
        class="grid gap-4"
        :class="isHide ? `md:grid-cols-4` : `md:grid-cols-3 2xl:grid-cols-4`"
      >
        <div v-for="(video, index) in myCourses.list" :key="index">
          <div
            class="relative rounded-xl cursor-pointer my-course-view"
            :class="darkMode ? `bg-secondary text-white` : `bg-white shadow`"
            :style="minHeight ? { minHeight: `${minHeight}px` } : {}"
          >
            <div class="absolute left-3 top-3" v-if="video.is_new">
              <NewIcon/>
            </div>
            <div class="absolute top-3 left-3">
              <div
                class="
                  h-6
                  w-6
                  rounded-full
                  flex
                  justify-center
                  items-center
                  text-white text-base
                "
                :class="
                  darkMode
                    ? `bg-primary`
                    : `bg-primary border border-textSecondary`
                "
              >
                <span>✓</span>
              </div>
            </div>
            <img
              :src="video.thumbnail"
              @click="gotToPlayList(video)"
              class="rounded-t-xl m-auto"
              onerror="this.onerror=null; this.src='/poster.png'"
            />
            <div
              v-if="video.last_watch"
              class="h-1 absolute bg-red-600 -mt-1"
              :style="{ width: `${video.last_watch.percentage}%` }"
            ></div>
            <div
              class="
                flex flex-col
                relative
                w-full
                justify-center
                items-center
                -top-10
                px-5
              "
            >
              <div
                @click="gotToPlayList(video)"
                class="
                  flex flex-col
                  relative
                  w-full
                  justify-center
                  items-center
                "
              >
                <div
                  class="w-14 h-14 rounded-md bg-gray-300 bg-cover"
                  :style="{ backgroundImage: `url(${video.teacher.photo})` }"
                ></div>
                <div class="text-sm font-semibold mt-4">
                  {{ video.teacher.name }} ({{ cutString(video.title, 30) }})
                </div>
                <div
                  class="
                    flex
                    items-end
                    w-full
                    justify-between
                    mt-4
                    text-center text-sm
                  "
                >
                  <div class="cursor-pointer">
                    <YoutubeIcon :fill="darkMode ? `#909090` : `#000000`" />
                    <div
                      class="
                        h-6
                        mt-1
                        bg-transparent
                        flex
                        items-end
                        justify-center
                      "
                    >
                      {{ video.total_video ? video.total_video : 0 }}
                    </div>
                  </div>
                  <div class="cursor-pointer">
                    <PdfIcon
                      :fill="darkMode ? `#909090` : `#000000`"
                      :size="42"
                    />
                    <div
                      class="
                        h-6
                        mt-1
                        bg-transparent
                        flex
                        items-end
                        justify-center
                      "
                    >
                      {{ video.total_pdf ? video.total_pdf : 0 }}
                    </div>
                  </div>
                  <div class="cursor-pointer">
                    <ChatIcon
                      :fill="darkMode ? `#909090` : `#000000`"
                      :size="42"
                    />
                    <div
                      class="
                        h-6
                        mt-1
                        bg-transparent
                        flex
                        items-end
                        justify-center
                      "
                      :class="darkMode ? `text-skyBlue` : `text-primary`"
                    >
                      {{ video.has_support ? $t("1008") : $t("1009") }}
                    </div>
                  </div>
                  <div class="cursor-pointer">
                    <TestIcon
                      :fill="darkMode ? `#909090` : `#000000`"
                      :size="42"
                    />
                    <div
                      class="
                        h-6
                        mt-1
                        bg-transparent
                        flex
                        items-end
                        justify-center
                      "
                      :class="darkMode ? `text-skyBlue` : `text-primary`"
                    >
                      {{ video.has_quiz ? $t("1008") : $t("1009") }}
                    </div>
                  </div>
                  <div class="cursor-pointer">
                    <CertificateIcon
                      :fill="darkMode ? `#909090` : `#000000`"
                      :size="42"
                    />
                    <div
                      class="
                        h-6
                        mt-1
                        bg-transparent
                        flex
                        items-end
                        justify-center
                      "
                      :class="darkMode ? `text-skyBlue` : `text-primary`"
                    >
                      {{ video.has_certificate ? $t("1008") : $t("1009") }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="mt-5 border-t w-full h-1"
                :class="darkMode ? `border-button` : `border-gray-300`"
              ></div>
              <div
                class="flex justify-between items-center w-full relative top-5"
              >
                <div class="text-sm">
                  {{ $t("date_expired") }} :
                  <span>{{ formatDate(video.deadline) }}</span>
                </div>
                <div @click="addToCart(video)">
                  <CartIcon
                    :fill="darkMode ? `#909090` : `#000000`"
                    v-if="!video.is_in_cart"
                  ></CartIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Cart
      v-if="showCart"
      @closeCart="
        () => {
          this.showCart = false;
        }
      "
      @showInvoice="showInvoice($event)"
    ></Cart>
    <!-- Receipt info -->
    <ReceiptInfo
      v-if="showReceipt"
      :receiptDetail="receiptDetail"
      @closeInfo="
        () => {
          this.showReceipt = false;
        }
      "
    ></ReceiptInfo>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import helper from "./../../helper/helper";
import moment from "moment";
import Loading from "./../../components/Loading";
import eHeader from "./../Video/components/Header.vue";
import CertificateIcon from "./../../components/CertificateIcon.vue";
import TestIcon from "./../../components/TestIcon.vue";
import PdfIcon from "./../../components/PdfIcon.vue";
import ChatIcon from "./../../components/ChatIcon.vue";
import CartIcon from "./../../components/CartIcon.vue";
import YoutubeIcon from "./../../components/YoutubeIcon.vue";
import NewIcon from "./../../components/NewIcon.vue";
import Cart from "./../Component/Cart.vue";
import Empty from "./../Component/Empty.vue";
import ReceiptInfo from "./../MyCourse/components/ReceiptInfo.vue";
import Pkg from "@/views/MyCourse/Pkg";

export default {
  name: "MyCourse",
  components: {
    Loading,
    eHeader,
    CertificateIcon,
    TestIcon,
    PdfIcon,
    ChatIcon,
    CartIcon,
    YoutubeIcon,
    NewIcon,
    Cart,
    Empty,
    ReceiptInfo,
    Pkg,
  },
  data() {
    return {
      window: {
        width: 0,
      },
      active: 1,
      showView: false,
      showReading: false,
      loading: false,
      bookReading: "",
      bookDetail: {},
      minHeight: 0,
      showCart: false,
      showReceipt: false,
      receiptDetail: {},
      page: 1,
      enableScroll: true,
    };
  },

  computed: {
    ...mapState("course", ["myCourses", "loadingCourse"]),
    ...mapState("setting", ["darkMode", "isHide"]),
    query() {
      return this.$store.state.course.s;
    },

    gradeID() {
      return this.$store.state.course.gradeID;
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions("course", [
      "myCourseList",
      "filterByQueryString",
      "readBook",
      "setLessonTitle",
    ]),
    ...mapActions("cart", ["addCart", "getCart"]),
    handleResize() {
      this.window.width = window.innerWidth;
    },
    isEmpty(list) {
      try {
        return list.length;
      } catch (err) {
        return false;
      }
    },
    gotToPlayList(videoCourse) {
      videoCourse.is_buy = 1;
      this.$router.push({
        name: "video-detail",
        params: { course: videoCourse },
      });
    },

    matchHeight() {
      let arr = [];
      let interval = setInterval(() => {
        let box = document.getElementsByClassName("my-course-view");
        if (box) {
          for (let i = 0; i < box.length; i++) {
            arr.push(box[i].clientHeight);
          }
          this.minHeight = Math.max(...arr);
          clearInterval(interval);
        }
      }, 1000);
    },

    cutString(text, limit) {
      return helper.cutString(text, limit);
    },
    formatDate(date) {
      moment.locale("en");
      return moment(date).format("ll");
    },
    addToCart(video) {
      let payload = {};
      payload.id = video._id;
      this.addCart(payload).then(() => {
        this.showCart = true;
      });
    },
    showInvoice(data) {
      this.receiptDetail = data;
      this.showReceipt = true;
      this.showCart = false;
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        this.page++;

        let payload = {};

        payload.p = this.page;

        if (this.enableScroll) {
          this.myCourseList(payload).then((response) => {
            if (response.data.msg == undefined)
              if (response.data.data.list.length <= 0)
                this.enableScroll = false;
          });
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.matchHeight();
    });
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.myCourseList({
      p: this.page,
    });
  },
  watch: {
    query: function () {
      this.myCourseList(this.active);
    },

    gradeID: function () {
      this.myCourseList(this.active);
    },
  },
};
</script>

<style scoped>
svg {
  width: 40px;
}
</style>
