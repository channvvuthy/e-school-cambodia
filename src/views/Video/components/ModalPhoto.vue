<template>
  <div class="fixed w-full h-full bg-black flex justify-center items-center z-50 bg-opacity-80">
    <div class="w-96 shadow p-6 rounded-xl shadow" :class="darkMode?`bg-youtube`:`bg-white`">
      <img :src="imgUrl" class="max-h-52 m-auto">
      <div class="relative mt-3">
                <textarea
                    class="border rounded-full px-3 text-sm w-full h-10 leading-10 mt-5 focus:outline-none resize-none"
                    :placeholder="$t('2113')"
                    v-model="text"
                    :class="darkMode?`bg-transparent border-b border-gray-300 caret-white text-gray-300`:``"
                    ref="text"></textarea>
        <div class="flex justify-end mt-3">
          <div class="px-3 py-1 font-semibold cursor-pointer rounded-md" @click="cancel"
               :class="darkMode?`text-gray-300`:`text-black bg-gray-200`">{{ $t('1011') }}
          </div>
          <button class="outline-none rounded-md px-3 py-1
          justify-center
          font-semibold ml-5 cursor-pointer flex items-center"
                  :class="darkMode?`text-white bg-secondary`:`bg-primary text-white`" @click="send" :disabled="loading">
            <template v-if="loading">
              <SvgLoading></SvgLoading>
            </template>
            <span v-else>{{ $t('send') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"
import SvgLoading from "@/views/Video/components/SvgLoading";

export default {
  name: "ModalPhoto",
  components: {
    SvgLoading
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