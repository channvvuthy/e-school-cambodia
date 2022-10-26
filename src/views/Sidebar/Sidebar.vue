<template>
  <div :class="darkMode?'bg-secondary text-gray-300':'bg-white text-black'"
       :style="isHide?{marginLeft:'-350px'}:{marginLeft:'0px'}"
       class="fixed font-khmer_os z-50"
       style="width: 350px;"

  >
    <div class="sidebar relative h-screen shadow">
      <div
          :class="!isHide?`pl-5 pr-2 -right-8 ${darkMode?`bg-darkBlue`:`bg-primary`}`:`pl-2 pr-6 -right-12 ${darkMode?`bg-darkBlue`:`bg-primary`}`"
          class="toggle absolute rounded py-4 top-8 cursor-pointer"
          @click="switchSidebar">
        <template v-if="!isHide">
          <div class="bg-white rounded-full absolute h-3 w-3 left-0 top-5 flex justify-center items-center">
            <BackIcon :height="8" :width="8"/>
          </div>
          <img class="h-5" src="/icon/Menu/menu.png">
        </template>
        <template v-else>
          <div
              class="bg-white rounded-full absolute h-3 w-3 right-2 top-5 flex justify-center items-center transform rotate-180">
            <BackIcon :height="8" :width="8"/>
          </div>
          <img class="h-5" src="/icon/Menu/menu-rotate.png">
        </template>
      </div>
      <div :class="darkMode?`bg-darkBlue`:`bg-primary`"
           class="profile px-10 py-8 flex items-end text-white justify-between">
        <div class="flex flex-col justify-center items-center" style="padding: 1px 0;">
          <div :style="{backgroundImage:`url(${token?stProfile['photo']:'/profile.png'})`}"
               class="w-20 h-20 rounded-full bg-cover bg-center m-auto bg-white cursor-pointer relative"
               @click="() => {token? this.$router.push('/profile').catch(err=>{}):``}">
          </div>
          <div :class="localize==='en'?'text-xs':'text-xs'"
               class="flex justify-between items-end mt-3  cursor-pointer">
            <p class="name font-PoppinsMedium">
              {{ token ? stProfile.first_name + " " + stProfile.last_name : $t('unname') }}
            </p>
          </div>
        </div>
        <div v-if="token" class="cursor-pointer flex flex-col justify-center items-center" @click="getMyQr()">
          <div class="rounded-full border w-12 h-12 flex items-center justify-center">
            <ScanIcon fill="#FFFFFF" :size="30"/>
          </div>
          <div class="text-sm mt-2 font-PoppinsMedium">
            {{ $t('scan') }}
          </div>
        </div>
      </div>

      <div class="overflow-y-scroll h-screen pb-40 flex flex-col justify-between">
        <template v-if="token">
          <MyBalance v-if="isMerchant"/>
        </template>
        <div class="h-5"></div>
        <div class="px-5 flex-1">
          <template v-if="token">
            <Study/>
            <div class="h-10"></div>
            <Report/>
            <div class="h-10"></div>
            <Privacy/>
            <div class="h-10"></div>
          </template>
          <eSchool/>
          <div class="h-5"></div>
        </div>
        <div v-if="ads">
          <div v-if="ads.banner" class="relative max-w-full">
            <div
                class="absolute right-2 top-2 ads z-50 bg-primary flex items-center justify-center w-8 h-6 text-white bg-opacity-70 rounded text-xs">
              Ads
            </div>
            <img :src="ads.banner" class="cursor-pointer max-h-full" @click="openLink(ads.link)"/>
          </div>
        </div>
      </div>
    </div>
    <!-- QR -->
    <Modal v-if="showQr" :class="className" width="w-2/6">
      <div class="relative">
        <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
             @click="()=>{
               this.showQr = false;
               this.isPay = false;
               this.modalTitle = 'scan'}">
          <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
        </div>
        <div>
          <div :class="darkMode ? `border-facebook`: ``" class="px-5 py-3 font-Ubuntu text-center border-b">
            {{ $t(modalTitle) }}
          </div>
          <!--Content-->
          <div :class="darkMode ?`border-facebook` : ``" class="border-b">
            <!-- Profile -->
            <div v-if="modalTitle == 'profile'" class="text-center">
              <div class="font-Ubuntu text-primary mt-5">{{ $t('0019') }}</div>
              <div class="font-UbuntuLight mb-5">{{ $t('0020') }}</div>
              <div class="flex items-center justify-center">
                <qrcode-vue :size="270" :value="encrypt()" level="H"/>
              </div>

              <div class="flex items-center justify-center my-7">
                <input id="qrCode" :value="profile_url" class="absolute focus:outline-none" style="z-index:-10"
                       type="text">
                <div
                    :class="darkMode ? `bg-wallet1` : `bg-gray-100`"
                    class=" text-primary shadow cursor-pointer font-UbuntuLight rounded-md h-10 px-10 flex items-center justify-center"
                    @click="copyText">
                  <CopyIcon :size="22"/>
                  <div class="w-2"></div>
                  <div>{{ $t('copy_link') }}</div>
                </div>
                <div class="w-10"></div>
                <div
                    @click="downoad()"
                    :class="darkMode ? `bg-wallet1` : `bg-gray-100`"
                    class="text-primary shadow cursor-pointer font-UbuntuLight rounded-md h-10 px-10 flex items-center justify-center">
                  <DownloadIcon :size="22"/>
                  <div class="w-2"></div>
                  <div>{{ $t('download') }}</div>
                </div>
              </div>
            </div>
            <!-- Scan -->
            <div v-if="modalTitle == 'scan'" class="text-center">
              <template v-if="isPay">
                <div class="pt-3 pl-2 cursor-pointer" @click="()=>{this.isPay = false}">
                  <BackIcon :width="20"/>
                </div>
                <div class="flex items-center justify-center mt-5">
                  <PaymentIcon/>
                </div>
                <div class="text-primary font-UbuntuLight my-5">{{ action == 2 ? $t('0031') : $t('0025') }}</div>
                <div class="flex justify-center items-center my-5">
                  <div class="flex flex-col rounded-md px-5 py-3 font-Ubuntu text-primary"
                       :class="darkMode ?'bg-wallet1' : 'bg-gray-100'">
                    <div class="font-Ubuntu text-primary text-lg">
                      $<input type="number" class="bg-transparent outline-none w-12" @keypress="isNumber($event)"
                              v-model="pay.price" min="1">
                    </div>
                  </div>
                </div>
                <div class="border-b-2 border-dotted" :class="darkMode ? 'border-facebook': 'border-red-600'">
                  <span class=" font-UbuntuLight relative top-3"
                        :class="darkMode ?'bg-secondary text-primary' :'bg-white text-red-600'">
                    {{ action == 2 ? $t('0032') : $t('0026') }}</span>
                </div>
                <div class="flex justify-center items-center my-10">
                  <div class="flex flex-col rounded-md px-5 py-3 font-Ubuntu text-primary"
                       :class="darkMode ?'bg-wallet1' : 'bg-gray-100'">
                    <div>
                      {{ pay.name }}
                    </div>
                    <div>
                      0{{ pay.receipt_id }}
                    </div>
                  </div>
                </div>
                <div class="font-khmer_os">
                  <SwipeButton
                      ref="swipeButton"
                      class="swipe-button"
                      @actionConfirmed="onActionConfirmed"
                  />
                </div>
              </template>
              <template v-else>
                <div class="font-Ubuntu text-primary mt-5">{{ $t('0021') }}</div>
                <div class="font-UbuntuLight mb-5">
                  {{ $t('0022') }}
                </div>
                <div class="hidden">
                  <qrcode-capture ref="qrcode" @decode="onDecode"></qrcode-capture>
                </div>
                <div class="mb-7">
                  <qrcode-stream @decode="onScan" @init="onInit"/>
                </div>
                <div class="flex justify-center items-center">
                  <div
                      :class="darkMode ? `bg-wallet1` : `bg-gray-100`"
                      class="text-primary shadow cursor-pointer font-UbuntuLight rounded h-10 px-10 flex items-center justify-center"
                      @click="browse()">
                    <ImageIcon :size="22" fill="#055174"/>
                    <div class="w-4"></div>
                    <div class="flex items-center justify-center" v-if="loading">
                      <div class="loader"></div>
                    </div>

                    <div>{{ $t('browse') }}</div>
                  </div>
                </div>
              </template>
              <div class="h-7"></div>
            </div>

            <!-- Wallet -->
            <div v-if="modalTitle == '0030'" class="text-center">
              <div class="font-Ubuntu text-primary mt-5">{{ $t('0023') }}</div>
              <div class="font-UbuntuLight mb-5">
                {{ $t('0024') }}
              </div>
              <div class="flex justify-center items-center my-5">
                <div class="bg-gray-100 flex rounded-lg px-5 py-3 font-Ubuntu">
                  <div>$</div>
                  <div class="w-2"></div>
                  <input v-model="price" class="bg-transparent outline-none" type="number" @keypress="isNumber($event)">
                </div>
              </div>
              <div class="flex justify-center items-center">
                <qrcode-vue :size="270" :value="encrypt()" level="H" v-if="price > 0"/>
                <div style="width:270px; height:270px;" v-else class="bg-primary flex items-center justify-center text-white rounded">
                  {{ $t('6006') }}
                </div>
              </div>
              <div class="flex justify-center items-center my-5">
                <div class="bg-gray-100 flex flex-col rounded-md px-5 py-3 font-Ubuntu text-primary">
                  <div>
                    {{ stProfile.first_name + ' ' + stProfile.last_name }}
                  </div>
                  <div>
                    0{{ stProfile.phone }}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <!--Tap-->
          <div :class="darkMode ? `bg-secondary` : `bg-gray-50`"
               class="flex justify-between items-center px-10 py-3 font-UbuntuLight rounded-b-lg">
            <div class=" flex-col flex justify-center items-center text-center cursor-pointer"
                 @click="onTap('profile')">
              <UserIcon :fill="modalTitle == 'profile' ? `#055174`: `#4A4A4A`"/>
              <div :class="modalTitle == 'profile' ? `text-primary`: ``" class="text-sm">
                {{ $t('profile') }}
              </div>
            </div>
            <div class="flex-col flex justify-center items-center text-center cursor-pointer"
                 @click="onTap('scan')">
              <ScanIcon :fill="modalTitle == 'scan' ? `#055174`: `#4A4A4A`"/>
              <div :class="modalTitle == 'scan' ? `text-primary`: ``" class="text-sm">
                {{ $t('scan') }}
              </div>
            </div>
            <div class="flex-col flex justify-center items-center text-center cursor-pointer" @click="onTap('0030')" v-if="isMerchant">
              <EpayIcon v-if="modalTitle == '0030'"/>
              <EpayIcon fill1="#9b9b9b" fill2="#e2bb16" fill3="#9b9b9b" v-else/>
              <div :class="modalTitle == '0030' ? `text-primary`: ``" class="text-sm">
                {{ $t('0030') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Pin -->
    <PinCodeModal
        v-if="isPin" @closeModal="()=>{this.isPin = false}"
        :modal-title="$t('passcode_lock')"
        :title="$t('input_your_passcode')"
        :sub_title="$t('the_passcode_that_you_have_set')"
        :is-invalid="isInvalid"
        :error="$t('invalid_confirm_passcode')"
        @code="passcodeChange($event)"
    >
      <div class="font-UbuntuLight pb-2 text-center text-primary mt-5 cursor-pointer"
           @click="()=>{
             this.isPin = false;
             this.isResetPin = true;
             this.isInvalid = false;
           }">{{ $t('forget_password') }}?
      </div>
    </PinCodeModal>

    <PinCodeModal
        v-if="isNewPin" @closeModal="()=>{this.isNewPin = false}"
        :modal-title="$t('set_passcode')"
        :title="$t('input_new_passcode')"
        :is-invalid="isInvalid"
        :error="$t('invalid_passcode')"
        @code="newPasscodeChange($event)"
    />

    <PinCodeModal
        v-if="isConfirmPin" @closeModal="()=>{this.isConfirmPin = false}"
        :modal-title="$t('set_passcode')"
        :title="$t('confirm_your_passcode')"
        :is-invalid="isInvalid"
        :error="$t('invalid_confirm_passcode')"
        :is-confirm="true"
        @confirmCode="confirmCodeChange($event)"
    />
    <!-- Reset pin -->
    <ResetPin
        v-if="isResetPin"
        @resetPin="resetPin()"
        @password="watchPassword($event)"
        :is-invalid="isInvalid"
        :loading="loading"
        @closeModal="()=>{this.isPin = true; this.isResetPin = false;}"
    />
  </div>
</template>
<script>
import BackIcon from "./../../components/BackIcon"
import CloseIcon from "./../../components/CloseIcon.vue"
import Study from "./components/Study.vue"
import Report from "./components/Report.vue"
import Privacy from "./components/Privacy.vue"
import eSchool from "./components/eSchool.vue"
import {mapActions, mapState} from "vuex"
import helper from "./../../helper/helper"
import MyBalance from "@/views/MyBalance/Balance"
import Modal from "@/components/Modal";
import UserIcon from "@/components/UserIcon";
import ScanIcon from "@/components/ScanIcon";
import EpayIcon from "@/components/EpayIcon";
import CopyIcon from "@/components/CopyIcon";
import DownloadIcon from "@/components/DownloadIcon";
import ImageIcon from "@/components/ImageIcon";
import {QrcodeCapture, QrcodeStream} from 'vue-qrcode-reader'
import QrcodeVue from 'qrcode.vue'
import PaymentIcon from "@/components/PaymentIcon";
import SwipeButton from 'vue-swipe-button'
import 'vue-swipe-button/dist/swipeButton.css'
import PinCodeModal from "@/views/Component/PinCodeModal";
import axios from "axios";
import config from "@/config";
import ResetPin from "@/views/Component/ResetPin";

const {ipcRenderer} = require('electron')
export default {
  components: {
    ResetPin,
    PinCodeModal,
    SwipeButton,
    QrcodeStream,
    PaymentIcon,
    QrcodeVue,
    QrcodeCapture,
    ImageIcon,
    DownloadIcon,
    CopyIcon,
    EpayIcon,
    ScanIcon,
    Modal,
    MyBalance,
    BackIcon,
    Privacy,
    Report,
    Study,
    eSchool,
    CloseIcon,
    UserIcon,
  },
  data() {
    return {
      showQr: false,
      loading: false,
      isNewPin: false,
      newPasscode: "",
      isConfirmPin: false,
      confirmPasscode: "",
      qrUrl: "",
      qrImage: "",
      profile_url: "",
      modalTitle: "scan",
      price: 0,
      qr: {},
      isPay: false,
      action: 0,
      result: "",
      error: "",
      pay: {
        price: 0,
        name: "",
        receipt_id: "",
      },
      isPin: false,
      passcode: '',
      isInvalid: false,
      isResetPin: false,
      inputType: "password",
      password: "",
      isNoPin: false,
    }
  },
  computed: {
    ...mapState('auth', ['token', 'stProfile','isMerchant']),
    ...mapState('setting', ['localize', 'darkMode', 'isHide', 'className']),
    ...mapState('home', ['ads']),
    ...mapState('wallet', ['wallet_loading'])
  },

  methods: {
    ...mapActions('auth', ['changeProfilePhotoPhoto', 'getQr']),
    ...mapActions('upload', ['singleUpload']),
    ...mapActions('wallet', ['walletTransfer', 'billPay']),
    isNumber(evt) {
      return helper.isNumber(evt)
    },
    watchPassword(password) {
      this.password = password
    },
    confirmCodeChange(passcode) {
      this.confirmPasscode = passcode
    },
    newPasscodeChange(passcode) {
      this.newPasscode = passcode
    },
    passcodeChange(passcode) {
      this.passcode = passcode
    },
    onActionConfirmed() {
      this.showQr = false
      this.isPin = true
    },
    onScan(result) {
      this.result = result;
    },
    resetPin() {
      if (this.password) {
        this.loading = true
        this.$store.dispatch('wallet/getPin', this.password).then(res => {
          if (res.msg == undefined) {
            this.isNewPin = true
            this.isResetPin = false
          }
          this.loading = false
        })
      } else {
        this.$refs.password.focus()
      }
    },
    downoad() {
      let canvas = document.getElementsByTagName('canvas')[0]
      this.qrImage = canvas.toDataURL("image/png");
      let a = document.createElement("a");
      a.href = this.qrImage;
      a.download = "myQrcode.png";
      a.click()
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: cannot access your camera device";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
        helper.errorMessage(this.error)
      }
    },
    onDecode(text) {
      this.loading = true
      try {
        let decrypt = this.decrypt(text)
        let data = JSON.parse(decrypt)
        switch (data.type) {
          case 0:
            this.showQr = false
            this.$router.push({
              name: "user",
              params: {user_id: data.user_id}
            })
            break;
          default:
            if(this.isMerchant == 0){
              helper.errorMessage("6007")
              return;
            }
            this.action = data.type
            this.loading = false
            this.isPay = true
            this.pay = data
            break;
        }
      } catch (err) {
        this.showQr = false
        helper.errorMessage(err)
      }
    },
    encrypt() {
      let text = JSON.stringify(this.qr)
      return helper.encrypt(text)
    },
    decrypt(text) {
      return helper.decrypt(text)
    },
    browse() {
      let e = this.$refs.qrcode
      e.$el.click()
    },

    switchSidebar() {
      if (this.isHide) {
        this.$store.commit('setting/toggleSidebar', false)
      } else {
        this.$store.commit('setting/toggleSidebar', true)
      }
    },
    onTap(title) {
      this.modalTitle = title
      switch (title) {
        case "0030":
          this.qr = {
            type: 1,
            user_id: this.stProfile._id,
            name: this.stProfile.first_name + ' ' + this.stProfile.last_name,
            price: parseFloat(this.price),
            receipt_id: "0" + this.stProfile.phone
          }
          break
        default:
          this.qr = {
            type: 0,
            user_id: this.stProfile._id,
            name: "",
          }
          break
      }
    },
    openLink(link) {
      ipcRenderer.send('openLink', link)
    },
    getMyQr() {
      if (localStorage.getItem('pin') == null) {
        this.isNewPin = true
        this.isNoPin = true
        return
      }

      this.loading = true
      this.getQr().then(res => {
        this.loading = false
        if (res.data.msg) {
          helper.errorMessage(res.data.msg)
          return;
        }
        this.qrUrl = res.data.data.qrcode_url
        this.profile_url = res.data.data.profile_url
        this.showQr = true
      }).catch(err => {
        helper.errorMessage(err.res.data.msg)
      })
    },
    copyText() {
      let copyText = document.getElementById("qrCode");
      copyText.select();
      copyText.setSelectionRange(0, 99999)
      document.execCommand("copy");
      helper.success("Copied the text: " + copyText.value)
    },
    onSelectedPhoto(event) {
      if (event.target.value) {
        this.loading = true
        const file = event.target.files[0];
        let formData = new FormData();
        formData.append("photo", file)

        this.singleUpload(formData).then(res => {
          if (res.data) {
            let photo = new FormData()
            photo.append("photo", res.data.url)
            this.changeProfilePhotoPhoto(photo).then(res => {
              if (res.data) {
                let stProfile = localStorage.getItem("stProfile")
                stProfile = JSON.parse(stProfile)
                stProfile['photo'] = res.data.photo
                this.$store.commit("auth/studentProfile", stProfile)
                localStorage.setItem("stProfile", JSON.stringify(stProfile))
              }
              this.loading = false
            })
          }
          this.loading = false
        })
      }
    },
  },
  updated() {
    if (this.isPay) {
      try {
        document.getElementsByClassName('slide-text')[0].innerText = this.$i18n.t('0027')
      } catch (e) {
        this.error = e
      }
    }
  },

  created(){
    if(this.isMerchant == 0){
      this.modalTitle = 'profile'
    }
  },
  
  watch: {
    'price': function () {
      this.qr.price = parseFloat(this.price)
    },
    'result': function (text) {
      if (text) {
        this.onDecode(text)
      }
    },
    'passcode': function (val) {
      let pin = this.decrypt(localStorage.getItem("pin"))
      if (val.length == 4) {
        if (pin == val) {
          this.isInvalid = false
          let data = new FormData()
          if (this.action == 2) {
            data.append("bill_number", this.pay.receipt_id)
            this.billPay(data).then(res => {
              if (res.data.msg == undefined) {
                helper.success('bill_success')
                this.isPay = false
              } else {
                this.isPay = true
                this.showQr = true
              }
              this.isPin = false
            }).catch(err => {
              console.log(err)
            })
          } else {
            data.append("id", this.pay.user_id)
            data.append("amount", this.pay.price)

            this.walletTransfer(data).then(res => {
              if (res.data.msg == undefined) {
                helper.success('transfer_success')
                this.isPay = false
              } else {
                this.isPay = true
                this.showQr = true
              }
              this.isPin = false
            }).catch(err => {
              console.log(err)
            })
          }

        } else {
          this.isInvalid = true
        }
      }

    },
    'pay.price': function (val) {
      if (val == 0) {
        this.pay.price = 1
      }
    },
    'newPasscode': function (val) {
      if (val.length == 4) {
        this.isConfirmPin = true
        this.isNewPin = false
      }
    },
    'confirmPasscode': function (val) {
      if (val.length == 4) {
        if (this.newPasscode == val) {
          this.isInvalid = false
          let form = new FormData()
          form.append("pin", helper.encrypt(this.newPasscode))
          this.loading = true
          axios.post(config.apiUrl + 'wallet/pin', form).then(() => {
            localStorage.setItem("pin", helper.encrypt(this.newPasscode))
            this.loading = false
            this.isConfirmPin = false

            if (this.isNoPin) {
              this.isNoPin = false
              this.getMyQr()
              return;
            }
            this.isPin = true
          }).catch(err => {
            this.loading = false
            helper.errorMessage(err.response.data.msg)
          })
        } else {
          this.isInvalid = true
        }
      }
    },
  }
}
</script>


