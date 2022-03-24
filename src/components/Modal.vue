<template>
  <div :class="className" id="dismiss" @click="dismiss">
    <div :class="width">
      <div
          :class="`shadow ${radius}  ${darkMode ? `bg-secondary text-textSecondary`: `bg-white`}`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import mode from "@/mixins/mode";
import {mapState} from "vuex";

export default {
  name: "Modal",
  mixins: [mode],
  props: {
    radius: {
      default: () => 'rounded-xl'
    },
    width: {
      default: () => 'w-1/2'
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    dismiss(event) {
      if (event.target.id == 'dismiss') {
        this.$emit('dismiss', true)
      }
    }
  }
}
</script>

<style scoped>

</style>