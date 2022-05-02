<template>
  <Modal
      width="w-64"
  >
    <div class="flex justify-center items-center">
      <div class="text-center">
        <div class="mt-2 py-4 px-2">
          <p class="text-base text-black font-khmer_os" v-html="message"></p>
        </div>
      </div>
    </div>
    <hr>
    <div class="flex flex-row text-sm font-khmer_os h-10 justify-between items-center text-blue-700">
      <button type="button" @click="closeMessage"
              class="w-full">
        {{ $t('1011') }}
      </button>
      <div class="h-10 border border-gray-300 border-l-0 border-t-0 border-b-0" style="width:0;"></div>
      <button type="button" @click="ConfirmDelete"
              class="w-full">
        {{ $t('1010') }}
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";

export default {
  components: {
    Modal
  },
  props: {
    message: {
      default: () => {
        return 'តើអ្នកចង់លុបវាមែនទេ?'
      }
    },
  },
  methods: {
    closeMessage($event) {
      this.$emit("closeMessage", $event);
    },

    ConfirmDelete($event) {
      this.$emit("ConfirmDeleteCart", $event);
    }
  }
}
</script>