<template>
  <Modal width="w-2/5">
    <div>
      <div class="flex justify-between items-center px-10 pt-5 pb-2">
        <div class="flex items-center space-x-4">
          <div>
            <HelpIcon :size="35" :fill="darkMode ? `#9ca3af`: `#055174`"></HelpIcon>
          </div>
          <div class="text-lg font-PoppinsMedium">
            {{ $t('report_this_post') }}
          </div>
        </div>
        <div>
          <div class="cursor-pointer" @click="()=>{
            this.isDetail = false;
            this.$emit('closeReport')
          }">
            <CloseIcon :fill="darkMode ? `#9ca3af`: `#000000`"></CloseIcon>
          </div>
        </div>
      </div>
      <ul class="px-10 font-PoppinsMedium text-sm pb-10" v-if="!isDetail">
        <li v-if="loading" class="flex items-center justify-center py-40">
          <LoadingWhite></LoadingWhite>
        </li>
        <template v-else>
          <li
              v-for="(r, index) in report"
              :class="darkMode ? `border-button text-gray-400` : `text-primary `"
              :key="index"
              class="border-b py-5 cursor-pointer" @click="addReport(r)">
            {{ r.name }}
          </li>
        </template>
      </ul>
      <div class="px-10 my-5" v-else>
        <div v-if="!isSuccess">
          <textarea
              style="resize: none"
              ref="caption"
              v-model="text"
              class="w-full border p-5" rows="10" :placeholder="$t('say_something')"></textarea>
          <button
              @click="onSubmit"
              :disabled="isSubmit"
              class="w-full bg-primary outline-none text-white rounded-lg py-4 mt-5 font-PoppinsMedium">
            <div v-if="!isSubmit">
              {{ $t('submit') }}
            </div>
            <div v-else>
              <Loader></Loader>
            </div>
          </button>
        </div>
        <div v-else class="flex flex-col items-center justify-between py-20 text-2xl font-PoppinsMedium">
          <span :class="darkMode ? ``: `text-success`">{{ $t('report_thank') }}</span>
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-successCheck mt-8 text-white text-3xl">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                 viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#fff" stroke="none">
                <path d="M4187 3956 c-22 -8 -50 -25 -64 -38 -14 -12 -459 -504 -990 -1093 -715 -793 -977 -1078 -1016
                -1102 -61 -39 -128 -44 -192 -14 -23 10 -261 217 -560 486 -345 310 -535 475 -564 488 -137 61 -294 -41
                -294 -192 -1 -31 6 -72 15 -92 11 -26 214 -223 683 -665 367 -346 685 -640 708 -654 63 -37 148 -35 210 5
                52 34 2290 2513 2321 2572 70 130 -20 294 -170 308 -30 3 -64 0 -87 -9z"/>
              </g>
            </svg>

          </div>
        </div>
        <div class="h-8"></div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../../components/Modal";
import HelpIcon from "../../../components/HelpIcon";
import CloseIcon from "../../../components/CloseIcon";
import {mapActions, mapState} from "vuex";
import Loader from "@/components/Loader";
import LoadingWhite from "@/components/LoadingWhite";

export default {
  name: "Report",
  components: {
    CloseIcon,
    HelpIcon,
    Modal,
    Loader,
    LoadingWhite
  },
  computed: {
    ...mapState('report', ['report', 'loading']),
    ...mapState('setting', ['darkMode'])
  },
  props: {
    social: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isDetail: false,
      reportSocial: {},
      text: "",
      isSuccess: false,
      isSubmit: false,

    }
  },
  methods: {
    ...mapActions('report', ['getReport', 'postReport']),
    onSubmit() {
      if (!this.text) {
        this.$refs.caption.focus()
        return
      }
      let payload = new FormData()
      payload.append("id", this.social._id)
      payload.append("report", this.reportSocial._id)
      payload.append("detail", this.text)
      this.isSubmit = true
      this.postReport(payload).then(() => {
        this.isSubmit = false
        this.isSuccess = true
        setTimeout(() => {
          this.$emit("closeReport")
        }, 1000)
      })
    },
    addReport(r) {
      this.reportSocial = r
      this.isDetail = true
    }
  },
  created() {
    this.getReport({
      p: 1
    })
  }
}
</script>

<style scoped>

</style>