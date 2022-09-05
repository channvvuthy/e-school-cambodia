<template>
  <Modal :class="className" width="w-96">
    <div class="relative">
      <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
           @click="()=>{this.$emit('closeModal')}"
      >
        <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
      </div>
      <div>
        <div :class="darkMode ? `border-facebook`: ``" class="px-5 py-3 font-Ubuntu text-center border-b">
          {{ $t(title) }}
        </div>
        <div class="text-center mb-5">
          <div class="font-Ubuntu text-primary mt-5">{{ $t('0023') }}</div>
          <div class="font-UbuntuLight mb-5">
            {{ $t('0028') }}
          </div>
        </div>
        <div class="flex justify-center items-center my-5">
          <div class="bg-gray-100 flex rounded-lg px-5 py-3 font-Ubuntu">
            <div>$</div>
            <div class="w-2"></div>
            <div>{{ receiptDetail.amount }}</div>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <qrcode-vue :size="270" :value="encrypt()" level="H"/>
        </div>
        <div class="flex justify-center items-center my-5">
          <div class="flex flex-col rounded-md px-5 py-3 font-Ubuntu text-primary items-center justify-center"
               :class="darkMode ?'bg-wallet1' : 'bg-gray-100'">
            <div>
              {{ qr.name }}
            </div>
            <div>
              {{ qr.receipt_id }}
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <div
              @click="downoad()"
              :class="darkMode ? `bg-wallet1` : `bg-gray-100`"
              class="text-primary shadow cursor-pointer font-UbuntuLight rounded-md h-10 px-10 flex items-center justify-center">
            <DownloadIcon :size="20"/>
            <div class="w-2"></div>
            <div>{{ $t('download') }}</div>
          </div>
        </div>
        <div class="h-5"></div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal";
import {mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";
import QrcodeVue from 'qrcode.vue'
import helper from "@/helper/helper";
import DownloadIcon from "@/components/DownloadIcon";

export default {
  name: "Bill",
  components: {DownloadIcon, CloseIcon, Modal, QrcodeVue},
  props: {
    title: {
      default: function () {
        return 'scan'
      },
    },
    receiptDetail: {
      type: Object
    }
  },

  computed: {
    ...mapState('setting', ['darkMode', 'className']),
    ...mapState('auth', ['stProfile'])
  },
  data() {
    return {
      qr: {
        type: 2,
        user_id: "",
        name: "",
        price: parseFloat(this.receiptDetail.amount),
        receipt_id: this.receiptDetail.receipt
      }
    }
  },
  methods: {
    downoad() {
      let canvas = document.getElementsByTagName('canvas')[0]
      this.qrImage = canvas.toDataURL("image/png");
      let a = document.createElement("a");
      a.href = this.qrImage;
      a.download = "myQrcode.png";
      a.click()
    },
    encrypt() {
      let text = JSON.stringify(this.qr)
      return helper.encrypt(text)
    }
  },
  mounted() {
    this.qr.user_id = this.stProfile._id
    this.qr.name = this.stProfile.first_name + ' ' + this.stProfile.last_name
  },
  created() {
    this.$store.commit('auth/studentProfile', JSON.parse(localStorage.getItem('stProfile')))
  }
}
</script>

<style scoped>

</style>