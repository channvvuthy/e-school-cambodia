<template>
  <div class="p-5">
    <div class="relative relative w-28">
      <div
          @click="removeSticker"
          :class="darkMode ? `bg-button` : `bg-forum`"
          class="absolute right-0 top-0 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer shadow">
        <CloseIcon :fill="darkMode ?`#909090` : `#000000`" :width="18"></CloseIcon>
      </div>
      <img
          :class="`w-${stickerHeight}`"
          :src="stickerUrl"
      />
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
import {mapState} from "vuex";

export default {
  name: "StickerView",
  components: {CloseIcon},
  props: {
    stickerUrl: {
      default: () => ''
    },
    stickerHeight: {
      default: () => 20
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    removeSticker() {
      this.$emit("removeSticker")
    }
  }
}
</script>

<style scoped>

</style>