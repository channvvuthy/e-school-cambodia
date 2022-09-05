<template>
  <Modal :class="className" width="w-96">
    <div class="relative">
      <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
           @click="closeModal()">
        <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
      </div>
      <div>
        <div :class="darkMode ? `border-facebook`: ``" class="px-5 py-3 font-Ubuntu text-center border-b">
          {{ ModalTitle }}
        </div>
        <div v-if="loading" class="flex items-center justify-center m-auto">
          <div class="loader"></div>
        </div>
        <div class="p-5">
          <div class="font-UbuntuLight pb-2 text-center">{{ title }}</div>
          <div class="font-UbuntuLight pb-2 text-center" v-if="sub_title">{{ sub_title }}</div>
          <div v-if="isInvalid" class="font-UbuntuLight text-center text-red-600 pb-2">{{ error }}</div>
          <div class="input-wrapper text-center">
            <PincodeInput
                v-if="!isConfirm"
                v-model="code"
                :secure="true"
                placeholder="0"
            />
            <PincodeInput
                v-else
                v-model="confirmCode"
                :secure="true"
                placeholder="0"
            />
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal";
import CloseIcon from "@/components/CloseIcon";
import {mapState} from "vuex";
import PincodeInput from 'vue-pincode-input';

export default {
  name: "PinCodeModal",
  components: {CloseIcon, Modal, PincodeInput},
  computed: {
    ...mapState('setting', ['darkMode', 'className'])
  },
  props: {
    ModalTitle: {
      default: function () {
        return "Modal Title"
      }
    },
    title: {
      default: function () {
        return "Title"
      }
    },
    sub_title: {
      default: function () {
        return ""
      }
    },
    error: {
      default: function () {
        return ""
      }
    },
    loading: {
      default: function () {
        return false
      }
    },
    isInvalid: {
      default: function () {
        return false
      }
    },
    isConfirm: {
      default: function () {
        return false
      }
    },
  },
  data() {
    return {
      code: "",
      confirmCode: "",
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    }
  },
  watch: {
    'code': function (val) {
      this.$emit('code', val)
    },
    'confirmCode': function (val) {
      this.$emit('confirmCode', val)
    }
  }
}
</script>
