<template>
  <div class="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
    <div class="inline-block align-bottom text-left  shadow-xl rounded-xl text-sm"
         :class="darkMode?`bg-secondary text-gray-300`:``">
      <div class="rounded-2xl">
        <div class="flex justify-center items-center">
          <div class="text-center">
            <div class="py-4">
              <p class="text-sm font-khmer_siemreap px-5">
                {{ $t(message) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-1 border-b" :class="darkMode?`border-button`:`border-gray-300`"></div>
      <div class="flex justify-center items-center font-khmer_siemreap py-3">
        <button type="button" @click="closeMessage" class="w-full justify-center  px-4  focus:outline-none"
                :class="darkMode?`text-white`:`text-primary`">
          {{ $t('1008') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"

export default {
  name: "ForgotPassword",
  props: {
    message: {
      default: () => {
        return null
      }
    },
    size: {
      default: () => {
        return 60;
      }
    }
  },
  data() {
    return {
      phone: null
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    closeMessage($event) {
      this.$emit("closeMessage", $event);
    }
  }
}
</script>