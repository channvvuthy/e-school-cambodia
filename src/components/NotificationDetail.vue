<template>
  <div class="fixed inset-0 overflow-y-auto bg-black bg-opacity-90 flex items-center justify-center items-center"
       style="z-index: 52">
    <div class="inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl max-w-lg min-w-96"
         :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div class="header flex justify-between items-center p-4 border-b text-sm font-khmer_os"
           :class="darkMode?`border-button`:`border-bordergray-200`">
        <div class="text-left flex-1 text-center font-semibold text-sm">
          {{ $t('1012') }}
        </div>
        <div class="opacity-80 cursor-pointer" @click="closeNotificationDetail">
          <CloseIcon :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
        </div>
      </div>
      <div class="body mt-5 flex-cols justify-start items-center font-siemreap overflow-y-scroll "
           style="min-height:24rem;max-height:85vh">
        <div class="px-5 pb-5">
          <div class="font-semibold my-4">{{ notificationDetail.title }}</div>
          <div v-if="notificationDetail.content.photo">
            <img :src="notificationDetail.content.photo" class="rounded mb-3 mx-auto">
          </div>
          <div v-if="notificationDetail.content.video">
            <video class="w-full">
              <source :src="notificationDetail.content.vide"/>
            </video>
          </div>
          <div v-if="notificationDetail.content.text">{{ notificationDetail.content.text }}</div>
          <div class="h-5"></div>
          <div class="text-gray-500 text-right text-sm">{{ formatDate(notificationDetail.date) }}</div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import CloseIcon from "./../components/CloseIcon"
import {mapState} from "vuex"
import moment from "moment"

export default {
  name: "Notification",
  data() {
    return {
      page: 1
    }
  },
  props: {
    size: {
      type: Number,
      default: () => {
        return 96
      }
    },
  },
  components: {
    CloseIcon
  },
  computed: {
    ...mapState('auth', ['notificationDetail']),
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY h:mm a');
    },
    closeNotificationDetail() {
      this.$emit("closeNotificationDetail")
    }
  },

}
</script>