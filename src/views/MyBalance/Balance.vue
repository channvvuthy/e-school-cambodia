<template>
  <div
      :class="darkMode ? `bg-primary` : `bg-wallet`"
      class="px-5 flex items-center justify-between font-Ubuntu font-black py-4 relative z-50">
    <div class="flex items-center">
      <div>
        <DollarIcon :size="18" :fill="darkMode ? `#FFF` : `#000`"/>
      </div>
      <div class="tracking-widest px-1">
        <span class="relative text-lg" :class="isShowPin ?`` : `top-1`">
          {{ isShowPin ? parseFloat(balance).toFixed(2) : '************' }}
          </span>
      </div>
      <div class="cursor-pointer" @click="setPin('view_balance')" v-if="!isShowPin">
        <EyeSecureIcon :fill="darkMode ? `#FFF`: `#055174`"/>
      </div>
      <div class="cursor-pointer" v-else
           @click="()=>{this.isShowPin = false; this.passcode = ''; this.isInvalid = false;}">
        <ViewBlanceIcon :fill="darkMode ? `#FFF`: `#055174`"/>
      </div>
    </div>
    <div class="flex items-center bg-wallet1 px-4 py-2 rounded-md cursor-pointer" @click="setPin('view_wallet')" id="wallet">
      <div>
        <EpayIcon/>
      </div>
      <div class="px-1"></div>
      <div class="text-primary">{{ $t('wallet') }}</div>
    </div>
    <!-- Set new pin-->
    <PinCodeModal
        v-if="isSetPin" :modal-title="$t('set_passcode')"
        :title="$t('input_new_passcode')"
        @code="codeChange($event)"
        @closeModal="()=>{this.isSetPin = false}"
        :loading="loading"/>

    <PinCodeModal
        :error="err"
        :is-confirm="true"
        v-if="isConfirmPin" :modal-title="$t('set_passcode')"
        :title="$t('confirm_your_passcode')"
        @confirmCode="confirmModel($event)"
        @closeModal="()=>{this.isConfirmPin = false}"
        :is-invalid="isInvalid"
        :loading="loading"/>

    <!-- Input your pin-->
    <PinCodeModal
        :error="$t('invalid_passcode')"
        v-if="isAlreadyPin" :modal-title="$t('input_your_passcode')"
        :title="$t('passcode_that_you_set_previously')"
        @code="passcodeChange($event)"
        :is-invalid="isInvalid"
        @closeModal="()=>{this.isAlreadyPin = false}"
        :loading="loading">
      <div class="font-UbuntuLight pb-2 text-center text-primary mt-5 cursor-pointer"
           @click="()=>{
             this.isReset = true;
             this.isAlreadyPin = false;
           }">{{ $t('forget_password') }}?
      </div>
    </PinCodeModal>

    <!-- Reset pin -->
    <ResetPin v-if="isReset"
              :loading="loading"
              @resetPin="resetPin"
              @password="passwordChange($event)"
              @closeModal="()=>{this.isReset = false}"/>

    <!-- View wallet-->
    <Modal v-if="isWallet" :class="className" width="w-96">
      <div class="relative">
        <div class="w-10 h-10 rounded-full items-center justify-center -right-0 top-2 absolute cursor-pointer"
             @click="()=>{this.isWallet = false}">
          <CloseIcon :fill="darkMode ? '#9999': `#000`"/>
        </div>
        <div>
          <div class="px-5 py-3 text-center border-b" :class="darkMode ? `border-facebook`: ``">
            {{ $t('transaction') }}
          </div>
          <ul class="font-khmer_os pb-5 overflow-y-scroll h-100" @scroll="onScroll">
            <li class="text-center py-2" :class="darkMode ? `bg-secondary`: `bg-gray-50`">
              <div>{{ $t('my_balance') }}</div>
              <span class="font-Ubuntu text-primary"
                    :class="darkMode ? `text-green-600` : ``">${{ parseFloat(balance).toFixed(2) }}</span>
            </li>
            <li class="flex items-center justify-center" v-if="loading">
              <div class="loader"></div>
            </li>

            <li v-for="(trans, index) in groupTransaction" :key="index">
              <div class="px-5 py-2 font-UbuntuLight mb-2"
                   :class="darkMode ? `bg-primary text-textSecondary` : `bg-wallet`">
                {{ trans.date }}
              </div>
              <div class="flex items-center px-5 justify-between py-2 border-b"
                   :class="darkMode ? `border-facebook`: ``" v-for="(l, key) in trans.transaction" :key="key">
                <div class="h-16 w-16 rounded-full flex items-center justify-center text-white font-Ubuntu text-lg"
                     :style="{backgroundColor:`${colorRandom()}`}">
                  {{ l.short_name }}
                </div>
                <div class="font-UbuntuLight flex-1 text-left pl-5" :class="darkMode ? `text-textSecondary`: ``">
                  <div>{{ $t(getType(l.type)) }} <span class="font-Ubuntu">{{ l.user.name }}</span></div>
                  <div class="text-sm mt-1">{{ getTime(l.date) }}</div>
                </div>
                <div class="font-Ubuntu" :class="!transactionStatus(l.type) ? `text-red-600`: `text-green-600`">
                  <span v-if="!transactionStatus(l.type)">-{{ l.amount }}$</span>
                  <span v-else>{{ l.amount }}$</span>
                </div>
              </div>
            </li>
            <li class="flex items-center justify-center" v-if="isPaging">
              <div class="loader"></div>
            </li>
          </ul>
        </div>
      </div>
    </Modal>

  </div>
</template>
<script>
import DollarIcon from "@/components/DollarIcon";
import EyeSecureIcon from "@/components/EyeSecureIcon";
import EpayIcon from "@/components/EpayIcon";
import Modal from "@/components/Modal";
import {mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";
import PincodeInput from 'vue-pincode-input';
import axios from "axios";
import config from "@/config";
import helper from "@/helper/helper";
import ViewBlanceIcon from "@/components/ViewBlanceIcon";
import moment from "moment";
import PinCodeModal from "@/views/Component/PinCodeModal";
import ResetPin from "@/views/Component/ResetPin";

const crypto = require('crypto')

export default {
  name: "MyWallet",
  computed: {
    ...mapState('setting', ['darkMode', 'className'])
  },
  components: {
    ResetPin,
    PinCodeModal,
    ViewBlanceIcon,
    CloseIcon,
    Modal,
    EpayIcon,
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
      isWallet: false,
      isReset: false,
      code: "",
      passcode: "",
      confirmCode: "",
      loading: false,
      isPaging: false,
      balance: "",
      action: 'view_balance',
      err: "Invalid Passcode",
      p: 1,
      enableScroll: true,
      wallet_transaction: [],
      password: "",
      groupTransaction: [],
      color: ['#713f12', '#7f1d1d', '#064e3b', '#7c2d12', '#2dd4bf', '#86efac', '#164e63', '#5eead4', '#0c4a6e', '#1e3a8a'
        , '#312e81', '#4c1d95', '#581c87', '#701a75', '#831843', '#881337']

    }
  },

  methods: {
    resetPin() {
      if (this.password) {
        this.loading = true
        this.$store.dispatch('wallet/getPin', this.password).then(res => {
          if (res.msg == undefined) {
            this.isSetPin = true
            this.isReset = false
          }
          this.loading = false
        })
      } else {
        this.$refs.password.focus()
      }
    },
    passwordChange(password) {
      this.password = password
    },
    passcodeChange(passcode) {
      this.passcode = passcode
    },
    codeChange(code) {
      this.code = code
    },
    confirmModel(confirmCode) {
      this.confirmCode = confirmCode
    },

    encrypt(text) {
      return helper.encrypt(text)
    },
    decrypt(text) {
      return helper.decrypt(text)
    },
    setPin(action = 'view_balance') {
      this.code = ""
      this.p = 1
      this.enableScroll = true
      this.action = action

      if (this.checkPin()) {
        if (action == 'view_wallet' && this.isShowPin) {
          this.getWallet()
          return
        }
        this.isAlreadyPin = true
      } else {
        this.isSetPin = true
      }
    },
    checkPin() {
      return localStorage.getItem("pin") != null
    },
    getBalance() {
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
    },
    colorRandom() {
      let index = Math.floor(Math.random() * this.color.length);
      return this.color[index]
    },
    getTime(date) {
      return moment(date).format('HH:mm a')
    },
    getType(type) {
      let str = ""
      switch (type) {
        case 1:
          str = "top_up"
          break;
        case 2:
          str = "receive_from"
          break;
        case  3:
          str = "send_to"
          break
        default:
          str = "paid"

      }
      return str
    },
    transactionStatus(type) {
      return !(type == 3 || type == 4);

    },
    onScroll: function ({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        this.p++
        if (this.enableScroll) {
          this.getWallet()
        }
      }
    },
    getWallet() {
      switch (this.p) {
        case 1:
          this.loading = true
          axios.get(config.apiUrl + `wallet`).then(res => {
            this.balance = res.data.data.balance
            this.wallet_transaction = res.data.data.list
            this.groupBy()
            this.isAlreadyPin = false
            this.loading = false
            this.isWallet = true
          }).catch(err => {
            this.loading = false
            if (err.response) {
              helper.errorMessage(err.response.data.msg)
            }

          })
          break;
        default:
          this.isPaging = true
          axios.get(config.apiUrl + `wallet?p=${this.p}`).then(res => {
            if (!res.data.data.list.length) {
              this.enableScroll = false
            }
            for (let i = 0; i < res.data.data.list.length; i++) {
              this.wallet_transaction.push(res.data.data.list[i])
            }
            this.groupBy()
            this.isAlreadyPin = false
            this.isPaging = false
            this.isWallet = true
          }).catch(err => {
            helper.errorMessage(err.response.data.msg)
            this.isPaging = false
          })
      }

    },

    groupBy() {
      let myTransaction = this.wallet_transaction.filter(item => {
        item.transactionDate = moment(item.date).format()
        return item
      })
      const groups = myTransaction.reduce((groups, transaction) => {
        const date = transaction.transactionDate.split('T')[0]
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(transaction)
        return groups
      }, {})
      this.groupTransaction = Object.keys(groups).map((date) => {
        return {
          date,
          transaction: groups[date]
        }
      })
    }
  },
  mounted() {
  },
  watch: {
    'code': function (val) {
      if (val.length == 4) {
        this.isConfirmPin = true
        this.isSetPin = false
      }
    },

    'confirmCode': function (val) {
      if (val.length == 4) {
        if (this.code == val) {
          this.isInvalid = false
          let form = new FormData()
          form.append("pin", this.encrypt(this.code))
          this.loading = true
          axios.post(config.apiUrl + 'wallet/pin', form).then(() => {
            localStorage.setItem("pin", this.encrypt(this.code))
            this.loading = false
            this.isConfirmPin = false
            this.getBalance()
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
      let pin = this.decrypt(localStorage.getItem("pin"))
      if (val.length == 4) {
        if (pin == val) {
          switch (this.action) {
            case 'view_balance':
              this.getBalance()
              break
            default:
              this.getWallet()
          }
        } else {
          this.isInvalid = true
        }
      }

    }
  }
}
</script>