<!---->
<template>
  <div class="absolute left-0 top-0 w-full h-full z-50 pt-10"
       :class="darkMode?`bg-youtube text-gray-300`:`bg-white text-black`">
    <div class="flex justify-center">
      <div>
        <div class="text-base font-semibold text-center">{{ $t('2128') }}</div>
        <div class="mt-5 flex justify-center items-center">
          <SadEmojiIcon :size="55"/>
        </div>
        <div :class="darkMode?`bg-secondary`:`shadow-xl border-t border-gray-100`"
             class="rounded-xl py-10 px-5 mt-10 w-72 text-center">
          <div class="font-semibold">{{ stProfile.first_name }} {{ stProfile.last_name }}</div>
          <div class="mt-5 font-semibold" style="color:#f6a522">{{ $t('2130') }}</div>
          <div class="border-b mt-5  border-dashed"
               :class="darkMode?`border-gray-700`:`border-gray-400`"></div>
          <div class="mt-5 font-semibold" :style="darkMode?``:{color:`#c0272d`}">
            {{ result.correct }}/{{ result.total_quiz }}
          </div>
          <button class="rounded-md mt-5 focus:outline-none py-2 px-5 shadow-lg"
                  :class="darkMode?`bg-button text-gray-300`:`bg-primary text-white`" @click="checkResult">
            {{ $t('2133') }}
          </button>
        </div>

        <div class="w-72 flex justify-center items-center">
          <button class="rounded-md mt-10 w-full focus:outline-none py-2 px-5 shadow-lg"
                  :class="darkMode?`bg-button text-gray-300`:`bg-primary text-white `" @click="exit">
            {{ $t('2132') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"
import SadEmojiIcon from "../../../components/SadEmojiIcon.vue"

export default {
  props: {
    result: {
      default: () => {
        return {}
      }
    }
  },
  components: {
    SadEmojiIcon
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile'])
  },
  methods: {
    exit() {
      this.$emit("exit")
    },
    checkResult() {
      this.$emit("checkResult")
    }
  }
}
</script>