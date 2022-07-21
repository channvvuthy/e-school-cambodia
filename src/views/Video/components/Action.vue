<template>
  <div>
    <div class="flex flex-col space-y-1 cursor-pointer">
      <div
        class="h-1 w-1 rounded-full"
        :class="darkMode ? `bg-textSecondary` : `bg-black`"
      ></div>
      <div
        class="h-1 w-1 rounded-full"
        :class="darkMode ? `bg-textSecondary` : `bg-black`"
      ></div>
      <div
        class="h-1 w-1 rounded-full"
        :class="darkMode ? `bg-textSecondary` : `bg-black`"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Action",
  computed: {
    ...mapState("setting", ["darkMode"]),
  },
};
</script>

<style scoped>
</style>