<template>
  <div class="fixed z-50 flex items-center justify-center h-full w-full bg-black bg-opacity-80 left-0 top-0">
    <div class="rounded-xl shadow-md relative p-5 relative max-w-xs"
         :class="darkMode ? `bg-secondary text-textSecondary shadow`: `bg-white`"
    >
      <div
          @click="closeMessage"
          :class="darkMode ? `bg-secondary text-textSecondary`: `bg-gray-50`"
          class="flex items-center justify-center absolute -top-4 -right-2 shadow z-50 rounded-full cursor-pointer">
        <CloseIcon :fill="darkMode ? `#909090`: `#000000`"></CloseIcon>
      </div>
      <div class="text-center text-lg">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
import {mapState} from "vuex";

export default {
  name: "Message",
  components: {CloseIcon},
  props: {
    message: {
      type: String,
      default: () => {
        return 'សូមធ្វើការទិញថ្នាក់នេះជាមុនសិន'
      }
    },
    hide: {
      type: Boolean,
      default: function () {
        return false
      }
    },
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    closeMessage($event) {
      this.$emit("closeMessage", $event);
    },

    showCart($event) {
      this.$emit("showCart", $event);
    }
  }
}
</script>