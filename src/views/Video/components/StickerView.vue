<template>
  <div class="p-5">
    <div class="relative w-28">
      <div
        @click="removeSticker"
        :class="darkMode ? `bg-button` : `bg-primary`"
        class="
          absolute
          right-4
          -top-3
          w-6
          h-6
          flex
          items-center
          justify-center
          rounded-full
          cursor-pointer
          shadow-md
        "
      >
        <CloseIcon :fill="darkMode ? `#909090` : `#FFFFFF`" :width="18" />
      </div>
      <img :class="`w-${stickerHeight}`" :src="stickerUrl"/>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
import { mapState } from "vuex";

export default {
  name: "StickerView",
  components: { CloseIcon },
  props: {
    stickerUrl: {
      default: () => "",
    },
    stickerHeight: {
      default: () => 20,
    },
  },
  computed: {
    ...mapState("setting", ["darkMode"]),
  },
  methods: {
    removeSticker() {
      this.$emit("removeSticker");
    },
  },
};
</script>