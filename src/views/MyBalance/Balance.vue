<template>
  <div
      :class="darkMode ? `bg-primary` : `bg-wallet`"
      class="px-5 flex items-center justify-between font-Ubuntu font-black py-4">
    <div class="flex items-center">
      <div>
        <DollarIcon :size="18" :fill="darkMode ? `#FFF` : `#000`"/>
      </div>
      <div class="tracking-widest px-1">
        <span class="relative text-lg" :class="isShowPin ?`` : `top-1`">
          {{ isShowPin ? balance : '************' }}
          </span>
      </div>
      <div class="cursor-pointer" @click="setPin()" v-if="!isShowPin">
        <EyeSecureIcon :fill="darkMode ? `#FFF`: `#055174`"/>
      </div>
      <div class="cursor-pointer" v-else
           @click="()=>{this.isShowPin = false; this.passcode = ''; this.isInvalid = false;}">
        <ViewBlanceIcon :fill="darkMode ? `#FFF`: `#055174`"/>
      </div>
    </div>
    <div class="flex items-center bg-wallet1 px-4 py-2 rounded-md cursor-pointer">
      <div>
        <WalletIcon/>
      </div>
      <div class="px-1"></div>
      <div class="text-primary">Wallet</div>
    </div>
    <!-- Set new pin-->
    <Modal v-if="isSetPin" :class="className" width="w-96">
      <div class="relative">
        <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
             @click="()=>{this.isSetPin = false}">
          <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
        </div>
        <div>
          <div class="px-5 py-3 font-Ubuntu text-center border-b" :class="darkMode ? `border-facebook`: ``">Set
            Passcode
          </div>
          <div class="flex items-center justify-center m-auto" v-if="loading">
            <div class="loader"></div>
          </div>
          <div class="p-5">
            <template v-if="!isConfirmPin">
              <div class="font-UbuntuLight pb-2 text-center">Input new passcode</div>
              <div class="input-wrapper text-center">
                <PincodeInput
                    :secure="true"
                    v-model="code"
                    placeholder="0"
                />
              </div>
            </template>
            <template v-else>
              <div class="font-UbuntuLight text-center" :class="isInvalid ? `` : `pb-2`">Confirm your passcode</div>
              <div class="font-UbuntuLight text-center text-red-600 pb-2" v-if="isInvalid">Invalid confirm passcode
              </div>
              <div class="input-wrapper text-center">
                <PincodeInput
                    :secure="true"
                    v-model="confirmCode"
                    placeholder="0"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Modal>
    <!-- Input your pin-->
    <Modal v-if="isAlreadyPin" :class="className" width="w-96">
      <div class="relative">
        <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
             @click="()=>{this.isAlreadyPin = false}">
          <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
        </div>
        <div>
          <div class="px-5 py-3 font-Ubuntu text-center border-b" :class="darkMode ? `border-facebook`: ``">Input your
            Passcode
          </div>
          <div class="flex items-center justify-center m-auto" v-if="loading">
            <div class="loader"></div>
          </div>
          <div class="p-5">
            <template>
              <div class="font-UbuntuLight text-center" :class="isInvalid ? `` : `pb-2`">Passcode that you set
                previously
              </div>
              <div class="font-UbuntuLight text-center text-red-600 pb-2" v-if="isInvalid">Invalid passcode</div>
              <div class="input-wrapper text-center">
                <PincodeInput
                    :secure="true"
                    v-model="passcode"
                    placeholder="0"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import DollarIcon from "@/components/DollarIcon";
import EyeSecureIcon from "@/components/EyeSecureIcon";
import WalletIcon from "@/components/WalletIcon";
import Modal from "@/components/Modal";
import {mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";
import PincodeInput from 'vue-pincode-input';
import axios from "axios";
import config from "@/config";
import helper from "@/helper/helper";
import ViewBlanceIcon from "@/components/ViewBlanceIcon";

export default {
  name: "MyWallet",
  computed: {
    ...mapState('setting', ['darkMode', 'className'])
  },
  components: {
    ViewBlanceIcon,
    CloseIcon,
    Modal,
    WalletIcon,
    EyeSecureIcon,
    DollarIcon,
    PincodeInput
  },
  data() {
    return {
      isShowPin: false,
      isSetPin: false,
      isAlreadyPin: false,
      isConfirmPin: false,
      isInvalid: false,
      code: "",
      passcode: "",
      confirmCode: "",
      loading: false,
      balance: ""

    }
  },

  methods: {
    getPin() {
      axios.get(config.apiUrl + 'wallet/pin?password=098909472').then(res => {
        console.log(res)
      }).catch(err => {
        helper.errorMessage(err.response.data.msg)
      })
    },
    setPin() {
      if (this.checkPin()) {
        this.isAlreadyPin = true
      } else {
        this.isSetPin = true

      }
    },
    checkPin() {
      return localStorage.getItem("pin") != null
    }
  },
  mounted() {
  },
  watch: {
    'code': function (val) {
      if (val.length == 4) {
        this.isConfirmPin = true
      }
    },

    'confirmCode': function (val) {
      if (val.length == 4) {
        if (this.code == val) {
          this.isInvalid = false
          let form = new FormData()
          form.append("pin", this.code)
          this.loading = true
          axios.post(config.apiUrl + 'wallet/pin', form).then(() => {
            localStorage.setItem("pin", this.code)
            this.loading = false
            this.isSetPin = false
          }).catch(err => {
            this.loading = false
            helper.errorMessage(err.response.data.msg)
          })
        } else {
          this.isInvalid = true
        }
      }
    },

    'passcode': function (val) {
      let pin = localStorage.getItem("pin")
      if (val.length == 4) {
        if (pin == val) {
          this.loading = true
          axios.get(config.apiUrl + 'me/balance').then(res => {
            this.balance = res.data.data.balance
            this.isShowPin = true
            this.isAlreadyPin = false
            this.loading = false
          }).catch(err => {
            helper.errorMessage(err.response.data.msg)
            this.loading = false
          })
        } else {
          this.isInvalid = true
        }
      }

    }
  }
}
</script>