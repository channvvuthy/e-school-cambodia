<template>
  <div :class="className">
    <div class="max-w-2xl">
      <div :class="closeIcon"
           class="bg-secondary"
           @click="()=>{this.$emit('closeIcon')}">
        <CloseIcon fill="#909090"></CloseIcon>
      </div>
      <img :src="imgUrl" alt="photo" class="max-h-ful">
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState('setting', ['className']),
  },
  name: "PreviewPhoto",
  components: {CloseIcon},
  props: {
    imgUrl: {
      default: () => null
    }
  },
}
</script>

<style scoped>

</style>