<template>
  <div :class="className">
    <div class="shadow rounded-xl w-2/5"
         :class="darkMode ? `bg-secondary`: `bg-white`">
      <div
          :class="darkMode ?`border-b border-facebook`: `border-b`"
          class="h-14 flex items-center justify-between px-5 text-lg">

        <div class="cursor-pointer" @click="()=>{this.$emit('dismissPost')}">
          <CloseIcon :fill="darkMode ? `#909090` : `#000000`"></CloseIcon>
        </div>
        <div class="w-full text-center">
          <div>
            {{ $t('2113') }}
          </div>
        </div>
        <button @click="post" :disabled="loading" class="outline-none bg-transparent flex items-center">

          <div v-if="loading" class="relative">
            <span v-if="progress < 100">
              {{ progress }}%
            </span>
            <span v-else>
              <LoadingWhite></LoadingWhite>
            </span>
          </div>
          <div class="cursor-pointer" :class="darkMode? `` : `text-primary`" v-else>
            {{ $t('post') }}
          </div>
        </button>
      </div>
      <div class="m-5">
        <textarea
            :placeholder="$t('2113')"
            @input="resize($event)"
            class="w-full outline-none bg-transparent" style="resize: none"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import mode from "@/mixins/mode";
import {mapState} from "vuex";
import LoadingWhite from "@/components/LoadingWhite";
import CloseIcon from "@/components/CloseIcon";

export default {
  name: "PhotoView",
  mixins: [mode],
  components: {
    LoadingWhite,
    CloseIcon
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('upload', ['progress'])
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    resize(e) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
      if (this.payload.caption) {
        this.canPost = true
      }
    },
    post() {

    }
  }
}
</script>

<style scoped>

</style>