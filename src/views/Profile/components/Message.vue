<template>
  <div
      class="fixed z-50  overflow-y-auto flex items-center justify-center w-full h-full bg-black bg-opacity-90 top-0 left-0">
    <div class="rounded-xl overflow-hidden shadow-xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div>
        <div class="flex justify-center items-center">
          <div class="text-center mt-0 mx-4 px-3">
            <div class="mt-2 py-4">
              <p class="text-sm text-sm font-khmer_siemreab">
                {{ $t(message) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-1 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
      <div class="flex flex-row text-sm  h-10 justify-center items-center">
        <button type="button" @click="closeMessage"
                v-if="!hide"
                class="w-full inline-flex justify-center  px-4   text-base font-medium text-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
          <span :class="darkMode?`text-white`:`text-youtube`">{{ $t('1010') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "./../../../helper/helper"
import {mapState} from "vuex"

export default {
  name: "ForgotPassword",
  props: {
    message: {
      default: () => {
        return 'សូមធ្វើការទិញថ្នាក់នេះជាមុនសិន'
      }
    },
    size: {
      default: () => {
        return 60;
      }
    },
    hide: {
      default: function () {
        return false
      }
    },
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    gender() {
      return helper.gender()
    }
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