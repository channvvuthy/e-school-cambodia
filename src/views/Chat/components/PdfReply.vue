<template>
  <div :class="darkMode?`text-gray-500`:`text-gray-500`"
       class="border-l-2 pl-1 border-gray-500 mb-2">
    {{ message.reply.text }}
  </div>
</template>
<script>
import {mapState} from "vuex"

export default {
  props: {
    message: {
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
}
</script>