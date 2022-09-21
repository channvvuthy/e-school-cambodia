<template>
  <div class="fixed inset-0 overflow-y-auto w-full h-full bg-black bg-opacity-90 flex items-center justify-center"
       style="z-index: 60">
    <div class="rounded-xl shadow-xl max-w-lg min-w-96" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div class="flex justify-between items-center p-4 border-b text-sm font-khmer_os"
           :class="darkMode?`border-button`:`border-bordergray-200`">
        <div class="text-left flex-1 text-center font-semibold text-sm">
          {{ $t('1012') }}
        </div>
        <div class="opacity-80 cursor-pointer" @click="closeNotification">
          <CloseIcon :fill="darkMode?`#909090`:`#000000`"/>
        </div>
      </div>
      <div class="body mt-5 flex-cols justify-start items-center font-khmer_os text-13px overflow-y-scroll"
           @scroll="onScroll" style="min-height:24rem;max-height:85vh">
        <div v-if="loadingNotification"
             class="flex justify-center items-center h-screen">
          <div class="relative" :class="window.width <= '1366'?' -top-20':' -top-56'">
            <Loading/>
          </div>
        </div>
        <div v-else>
          <div v-if="notifications && notifications.length">
            <ul>
              <li v-for="(notification, key) in notifications" :key="key"
                  class="flex justify-start items-center px-4 h-20 cursor-pointer"
                  :class="darkMode?`border-button ${key<(notifications.length - 1)?`border-b`:``}`:`border-gray-200 ${key<(notifications.length - 1)?`border-b`:``}`"
                  @click="readNotification(notification)">
                <div class="h-13 w-13 rounded-full flex justify-center items-center mr-3"
                     :class="bgColor(notification.type)">
                  <div v-if="notification.type == 1">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" height="25"
                         viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                         :fill="fillColor(notification.type)" stroke="none">
                        <path d="M2453 5105 c-141 -38 -249 -140 -299 -280 -14 -40 -19 -96 -23 -284
                                            l-6 -234 -69 -23 c-416 -141 -775 -511 -916 -944 -60 -183 -70 -281 -70 -673
                                            0 -498 -17 -650 -100 -899 -55 -164 -108 -267 -338 -650 -145 -241 -202 -345
                                            -202 -367 0 -43 17 -75 50 -94 26 -16 184 -17 2080 -17 1896 0 2054 1 2080 17
                                            33 19 50 51 50 94 0 22 -57 126 -202 367 -266 443 -320 555 -378 780 -46 184
                                            -52 248 -60 732 -7 410 -10 476 -28 555 -62 281 -188 518 -386 722 -180 188
                                            -347 296 -598 387 l-48 18 0 191 c0 106 -5 221 -11 256 -40 249 -286 410 -526
                                            346z"/>
                        <path d="M1890 422 c0 -15 91 -147 128 -185 92 -96 208 -166 342 -208 107 -34
                                            292 -34 400 0 129 40 225 97 315 186 67 66 155 185 155 209 0 3 -301 6 -670 6
                                            -368 0 -670 -4 -670 -8z"/>
                      </g>
                    </svg>
                  </div>
                  <div v-if="notification.type == 2">
                    <NotificationCommentIcon/>
                  </div>
                  <div v-if="notification.type == 3 || notification.type == 5">
                    <ChatIcon fill="#ffffff"/>
                  </div>
                  <div v-if="notification.type == 8">
                    <InsuranceIcon fill="#ffffff"/>
                  </div>
                  <div v-if="notification.type == 9">
                    <AddFriendIcon fill="#ffffff"/>
                  </div>
                  <div v-if="notification.type == 41">
                    <NotificationWalletIcon/>
                  </div>
                  <div v-if="notification.type == 4">
                    <NotificationBillIcon :size="52.8"/>
                  </div>
                  <div v-if="notification.type ==10">
                    <FriendRequestIcon :fill="fillColor(notification.type)"/>
                  </div>
                </div>
                <div class="flex-cols justify-start items-center flex-1">
                  <div class="font-semibold mb-1">{{ cutString(notification.title, 25) }}</div>
                  <div class="opacity-50">{{ formatDate(notification.date) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import CloseIcon from "./../components/CloseIcon"
import ChatIcon from "./../components/ChatIcon.vue"
import RequestIcon from "./../components/RequestIcon.vue"
import InsuranceIcon from "./../components/InsuranceIcon.vue"
import AddFriendIcon from "./../components/AddFriendIcon.vue"
import NotificationCommentIcon from "./../components/NotificationCommentIcon.vue"
import FriendRequestIcon from "./../components/FriendRequestIcon.vue"
import CommentIcon from "./../components/CommentIcon.vue"
import helper from "./../helper/helper"
import moment from "moment"
import Loading from "./Loading"
import NotificationBillIcon from "@/views/Video/components/NotificationBillIcon";
import NotificationWalletIcon from "@/views/Video/components/NotificationWalletIcon";

export default {
  name: "Notification",
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      page: 1
    }
  },
  props: {
    size: {
      type: Number,
      default: () => {
        return 96
      }
    }
  },
  components: {
    CloseIcon,
    Loading,
    ChatIcon,
    RequestIcon,
    InsuranceIcon,
    CommentIcon,
    AddFriendIcon,
    FriendRequestIcon,
    NotificationCommentIcon,
    NotificationWalletIcon,
    NotificationBillIcon
  },
  computed: {
    ...mapState('auth', ['loadingNotification', 'notifications']),
    ...mapState('setting', ['darkMode']),
    ...mapState('receipt', ['receiptDetail']),
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions('auth', ['getNotification', 'readingNotification']),
    ...mapActions('receipt', ['getReceiptDetail']),
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    onPay(rc) {
      this.isBill = true
      this.showInfo = false
    },
    closeInfo() {
      this.showInfo = false
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.page++

        this.getNotification(this.page)

      }
    },
    readNotification(notification) {
      if (notification.type == 41) {
        this.readingNotification(notification._id)
        this.$emit('closeNotification')
        document.getElementById("wallet").click()
        return;
      }
      if (notification.type == 4) {
        this.readingNotification(notification._id)
        this.getReceiptDetail(notification.content.transaction_id).then((res) => {
          this.$store.commit('receipt/getId', res.data.data._id)
          this.$emit('closeNotification')
          if(this.$route.name != 'invoice')
            this.$router.push({
              name: "invoice"
            }).catch(err => {
              console.warn(err)
            })
        })
        return;
      }
      if (notification.type == 10) {
        this.$store.commit("network/switchTab", "friend")
        this.$router.push({
          name: "network"
        }).catch(err => {
          console.warn(err)
        })
      }
      if (notification.type == 9) {
        this.$store.commit("network/switchTab", "friend_request")
        this.$router.push({
          name: "network"
        }).catch(err => {
          console.warn(err)
        })
      }

      if (notification.type == 8) {
        this.$router.push({
          name: "insurance"
        }).catch(err => {
          err
        })
      }

      if (notification.type == 3) {
        this.$router.push({
          name: "chat"
        }).catch(err => {
          err
        })
      }

      if (notification.type == 9 || notification.type == 8 || notification.type == 10) {
        this.$emit('closeNotification')
      }

      this.readingNotification(notification._id).then(res => {
        this.$emit('readNotification', res.data.data)
      })

    },
    formatDate(date) {
      moment.locale('en');
      return moment(date).format('DD-MM-YYYY h:mm a');
    },
    closeNotification() {
      this.$emit("closeNotification")
    },
    cutString(text, limit) {
      if (text) {
        return helper.cutString(text, limit)
      }
      return ""
    },
    fillColor(type) {
      if (type == 1) {
        return "#ee9b11"
      }
      if (type == 10 || 41 == type) {
        return "#fff"
      }
    },
    bgColor(type) {
      if (type == 1) {
        return "bg-yellow-100"
      }
      if (type == 10) {
        return "bg-dce8d0"
      }
      if (type == 9) {
        return "bg-d4eae8"
      }
      if (type == 41) {
        return 'bg-wallet_n'
      }
      if (type == 4) {
        return ''
      }
      return "bg-blue-400"
    }
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getNotification(1)
  }
}
</script>