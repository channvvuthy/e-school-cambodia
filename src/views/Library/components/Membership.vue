<template>
  <div>
    <div class="px-5">
      <div v-if="loading">
        <div class="grid grid-cols-4 gap-4">
          <div class="flex items-center justify-between" v-for="i in 4" :key="i">
            <div class="rounded-full w-14 h-14 bg-gray-300 mr-3 line"></div>
            <div class="w-full flex-1">
              <div class="h-3 bg-gray-300 w-1/2 mb-2 line"></div>
              <div class="h-3 bg-gray-300 w-4/5 mb-2 line"></div>
              <div class="h-3 bg-gray-300 w-full line"></div>
            </div>
          </div>
        </div>
      </div>
      <vue-horizontal v-else :button="false">
        <section v-for="(pk, index) in libraries.package" :key="index" class="mr-5">
          <div class="flex items-end rounded-xl h-44 w-80 bg-cover relative bg-center"
               :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"
               :style="{backgroundImage:`url(${pk.thumbnail})`}">
            <div class="absolute top-3 left-3 z-50" v-if="pk.is_buy">
              <div class="h-7 w-7 rounded-full flex justify-center items-center text-white text-base"
                   :class="darkMode?`bg-primary`:`bg-primary`">
                <span>✓</span>
              </div>
            </div>
            <div
                class="absolute w-full h-full bg-gradient-to-t from-black  rounded-xl cursor-pointer"
                @click="showConfirm(pk)"></div>
            <div class="px-5 py-3 text-white relative z-50 w-full">
              <div class="text-base">{{ pk.title }}</div>
              <div class="flex mt-1 items-center justify-between w-full">
                <div class="font-extralight">
                  <span> {{ pk.total_item }} {{ $t('2202') }}{{ plurals(pk.total_item) }}</span>
                </div>
                <div class="h-3 w-0 border-l border-white mx-4"></div>
                <div class="font-extralight">
                  <template v-if="pk.is_buy === 0">
                    <span v-if="pk.price.year">
                        {{ $t('1006') }}: <span
                        class="text-base font-bold text-heart ml-2 text-lg font-mono shadow">
                        {{ pk.price.year }}$</span>
                    </span>
                    <span v-else class="text-base font-bold text-heart ml-2 text-lg font-mono shadow">
                        {{ $t('1007') }}
                    </span>
                  </template>
                  <div class="text-xs" v-else>{{ $t('date_expired') }} : <span>{{ formatDate(pk.deadline) }}</span>
                  </div>
                </div>
                <div class="flex-1 flex justify-end">
                  <span class="cursor-pointer"
                        v-if="pk.price.year"
                        @click="addToCart(pk)" :id="pk._id">
                      <CartIcon fill="#FFFFFF"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </vue-horizontal>
    </div>
    <BuyMsg v-if="showMsg"
            @cancelModal="() => {this.showMsg = false}"
            @yes="yes()" :msg="msg"/>
    <!-- Receipt info -->
    <ReceiptInfo v-if="showReceipt"
                 :receiptDetail="receiptDetail"
                 @closeInfo="() =>{this.showReceipt = false}"/>
    <Cart v-if="showCart"
          @closeCart="() => {this.showCart = false}"
          @showInvoice="showInvoice($event)"/>
  </div>
</template>
<script>
import VueHorizontal from 'vue-horizontal';
import CartIcon from "./../../../components/CartIcon.vue"
import {mapState, mapActions} from "vuex"
import BuyMsg from "./../../../views/Component/BuyMsg.vue"
import Cart from "./../../../views/Component/Cart.vue"
import moment from "moment"
import ReceiptInfo from "./../../MyCourse/components/ReceiptInfo.vue"

export default {
  components: {
    VueHorizontal,
    CartIcon,
    BuyMsg,
    Cart,
    ReceiptInfo,
  },
  data() {
    return {
      showMsg: false,
      showCart: false,
      pk: {},
      receiptDetail: {},
      showReceipt: false,
      msg: "4008"
    }
  },
  computed: {
    ...mapState('library', ['libraries', 'loading']),
    ...mapState('setting', ['darkMode', 'localize']),

  },
  methods: {
    ...mapActions('cart', ['addCart', 'getCart']),
    async addToCart(pk) {

      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        this.msg = '2006'
        return;
      }
      let payload = {}

      payload.id = pk._id
      await this.addCart(payload).then(() => {
        this.getCart()
      })
    },
    yes() {
      if (localStorage.getItem('token') === null) {
        this.$router.push('/login')
        return;
      }
      this.showMsg = false
      this.addToCart(this.pk).then(() => {
        this.showCart = true;
      })
    },
    plurals(total) {
      if (this.localize == 'en') {
        if (total > 1) {
          return "s"
        }
      }
      return ""
    },
    formatDate(date) {
      moment.locale('en');
      return moment(date).format('ll');
    },
    showInvoice(data) {
      this.receiptDetail = data
      this.showReceipt = true
      this.showCart = false
    },
    showConfirm(pk) {
      this.getDetail(pk)
    },
    getDetail(pk) {
      this.$emit("getDetail", pk)
    }
  }
}
</script>

<style>
.line {
  animation: box 1s infinite;
}

@keyframes box {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}
</style>