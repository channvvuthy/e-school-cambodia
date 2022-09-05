<template>
  <Modal :class="className" width="w-96">
    <div class="relative">
      <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
           @click="()=>{this.$emit('closeModal')}"
      >
        <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
      </div>
      <div>
        <div class="px-5 py-3 font-Ubuntu text-center border-b" :class="darkMode ? `border-facebook`: ``">
          {{$t('confirm_password')}}
        </div>

        <div class="p-5">
          <div class="font-UbuntuLight pb-2 text-center">{{$t('0015')}}</div>
          <div class="font-UbuntuLight text-center text-red-600 pb-2" v-if="isInvalid">{{$t('0016')}}</div>
          <div class="relative font-UbuntuLight">
            <input
                ref="password"
                :type="inputType" class="h-10 border rounded-md w-full px-3 mt-3" :placeholder="$t('2010')"
                v-model="password">
            <div
                @click="()=>{this.$emit('resetPin')}"
                class="bg-primary text-center text-white h-10 rounded-md mt-5 flex cursor-pointer items-center justify-center">
              <span>{{ loading ? `Checking...` : $t('0018') }}</span>
            </div>
            <div class="absolute right-3 top-5">
              <div v-if="inputType == 'password'" @click="()=>{this.inputType ='text'}">
                <ViewBlanceIcon/>
              </div>
              <div v-else @click="()=>{this.inputType ='password'}">
                <EyeSecureIcon/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal";
import ViewBlanceIcon from "@/components/ViewBlanceIcon";
import EyeSecureIcon from "@/components/EyeSecureIcon";
import {mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";

export default {
  name: "ResetPin",
  components: {CloseIcon, EyeSecureIcon, ViewBlanceIcon, Modal},
  props: {
    loading: {
      default: function () {
        return false
      }
    },
    isInvalid: {
      default: function () {
        return false
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode', 'className'])
  },
  data() {
    return {
      password: "",
      inputType: "password",
    }
  },
  watch: {
    'password': function (val) {
      this.$emit('password', val)
    }
  }
}
</script>

<style scoped>

</style>