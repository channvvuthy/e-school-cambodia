<template>
  <div :class="className" id="dismiss" @click="dismiss" style="z-index: 70;">
    <div :class="width">
      <div v-if="isTransparent">
        <slot></slot>
      </div>
      <div
          v-else
          :class="`shadow ${radius}  ${darkMode ? `bg-secondary text-textSecondary`: `bg-white`}`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Modal",
  computed: {
    ...mapState('setting', ['darkMode', 'className'])
  },
  props: {
    isTransparent: {
      default: () => false
    },
    radius: {
      default: () => 'rounded-xl'
    },
    width: {
      default: () => 'w-1/2'
    }
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