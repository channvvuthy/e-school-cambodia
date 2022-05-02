<template>
  <div class="fixed w-full h-full bg-black top-0 left-0 z-50 flex justify-center items-center">
    <div class="rounded-md shadow p-3 w-96 flex flex-col justify-center" style="max-height:90%"
         :class="darkMode?`bg-secondary`:`bg-white`">
      <div class="flex justify-between items-center py-2">
        <div class="mb-3 font-semibold" :class="darkMode?`text-gray-300`:``">{{ $t('preview') }}</div>
        <div class="cursor-pointer relative -top-2" @click="closeAddStory">
          <CloseIcon :fill="darkMode?`#afb0b4`:`#000000`"></CloseIcon>
        </div>
      </div>
      <div class="flex-1 overflow-hidden h-screen">
        <img :src="imgUrl" class="m-auto max-h-full rounded">
      </div>
      <div class="flex justify-end mt-4">
        <button
            class="flex items-center text-sm justify-center rounded-md h-10 leading-10 cursor-pointer px-5 focus:outline-none shadow relative w-36"
            :class="darkMode?`bg-primary text-gray-300`:`bg-primary text-white`"
            :disabled="addingStory"
            @click="shareStory">

          <div class="absolute w-full flex items-center justify-center -top-2 left-0" v-if="addingStory || loading">
            <div class="loader"></div>
          </div>
          <span v-else>{{ $t('share_to_story') }} </span>
        </button>

      </div>

    </div>
  </div>
</template>

<script>
import CloseIcon from "./../../components/CloseIcon.vue"
import {mapState} from "vuex"

export default {
  components: {
    CloseIcon
  },
  computed: {
    ...mapState('auth', ['imgUrl', 'addingStory']),
    ...mapState('setting', ['darkMode']),
    ...mapState('upload', ['loading'])
  },
  methods: {
    closeAddStory() {
      this.$emit("closeAddStory")
    },
    shareStory() {
      this.$emit("shareStory")
    }
  }
}
</script>