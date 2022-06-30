<template>
  <div>
    <div
      class="w-1 h-1 rounded-full mb-1"
      :class="darkMode ? `bg-gray-400` : `bg-primary`"
    ></div>
    <div
      class="w-1 h-1 rounded-full mb-1"
      :class="darkMode ? `bg-gray-400` : `bg-primary`"
    ></div>
    <div
      class="w-1 h-1 rounded-full"
      :class="darkMode ? `bg-gray-400` : `bg-primary`"
    ></div>
  </div>
</template>
<script>

import { mapState } from 'vuex'
export default {
    computed:{
        ...mapState('setting', ['darkMode'])
    }
}
</script>