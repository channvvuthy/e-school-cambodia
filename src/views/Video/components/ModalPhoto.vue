<template>
  <div class="fixed w-full h-full bg-black flex justify-center items-center z-50 bg-opacity-80">
    <div class="w-96 shadow p-6 rounded-xl shadow relative" :class="darkMode?`bg-youtube`:`bg-white`">
      <div
          @click="cancel"
          class="absolute w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center -right-2 -top-4 shadow cursor-pointer">
        <CloseIcon></CloseIcon>
      </div>
      <img :src="imgUrl" class="max-h-52 m-auto">
      <div class="relative mt-3">
                <textarea
                    @keyup.enter.exact="send"
                    class="border rounded-full px-3 text-sm w-full h-10 leading-10 mt-5 focus:outline-none resize-none"
                    :placeholder="$t('2113')"
                    v-model="text"
                    :class="darkMode?`bg-transparent border-b border-secondary caret-white text-gray-300`:``"
                    ref="text"></textarea>
        <div class="cursor-pointer absolute right-3 bottom-3.5">
          <div
              class="rounded-full flex items-center justify-center" @click="send">
            <SendMessageIcon :fill="darkMode?`#909090`:`#055174`" :size="25"></SendMessageIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"
import SvgLoading from "@/views/Video/components/SvgLoading";
import SendMessageIcon from "@/components/SendMessageIcon";
import CloseIcon from "@/components/CloseIcon";

export default {
  name: "ModalPhoto",
  components: {
    CloseIcon,
    SvgLoading,
    SendMessageIcon
  },
  props: {
    imgUrl: {
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      text: "",
      loading: false
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    send() {
      this.$emit("send", this.text)
      this.loading = true
    }
  },
  mounted() {
    this.$refs.text.focus()
  }
}
</script>
<style>
.caret-white {
  caret-color: #fff;
}
</style>