<template>
  <div>
    <div
        class="px-5 h-screen py-5 overflow-y-scroll pb-40" :class="darkMode?`bg-youtube text-gray-300`:``"
        @scroll="onScroll">
      <div v-if="receipts && receipts.length<=0" class="flex justify-center h-screen">
        <Empty/>
      </div>
      <div v-if="takingReceipt" class="flex justify-center items-center h-screen relative -top-5">
        <h1 class="text-sm font-semibold font-khmer_os relative -top-10">
          <loading/>
        </h1>
      </div>
      <div v-else>
        <div class="grid gap-4" :class="isHide?`md:grid-cols-2 2xl:grid-cols-2`:`md:grid-cols-2 2xl:grid-cols-2`">
          <div v-for="(receipt,key) in receipts" :key="key"
               :class="darkMode?`bg-secondary rounded-xl py-5`:`bg-white rounded-xl py-5 shadow-md`">
            <div class="flex items-center px-7">
              <div class="flex flex-1 z-40  cursor-pointer" @click="viewReceipt(receipt)">
                <div class="mr-3 rounded-full w-20 h-20 flex items-center justify-center bg-pass"
                     v-if="receipt.status == 1">
                  <InvoiceIcon size="40" fill="#FFFFFF"/>
                </div>
                <div class="mr-3 rounded-full w-20 h-20 flex items-center justify-center"
                     :class="darkMode?`bg-primary`:`bg-softGray`" v-else>
                  <InvoiceIcon size="40" :fill="darkMode?`#FFFFFF`:`#055174`"/>
                </div>
                <div></div>
                <div class="py-3">
                  <div class="flex justify-between items-center">
                    <div class="w-26">{{ $t('invoce_no') }}</div>
                    <div class="w-5 text-center">:</div>
                    <div class="flex-1 text-leff font-semibold">{{ receipt._id }}</div>
                  </div>
                  <div class="h-3"></div>
                  <div class="flex justify-between items-center">
                    <div class="w-28">{{ $t('2308') }}</div>
                    <div class="w-5 text-center">:</div>
                    <div class="flex-1 text-left font-semibold">{{ formatDate(receipt.date) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-5 my-4">
              <div class="border-b-2 border-dashed w-full h-1" :class="darkMode?`border-gray-500`:``"></div>
            </div>
            <div class="flex justify-between px-5">
              <div class="flex-1">
                <div class="cursor-pointer" style="margin-top:3px;" @click="removeReceipt(receipt._id)"
                     v-if="receipt.status !==1">
                  <DeleteIcon :fill="darkMode?`#909090`:`#c0272d`"/>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div>{{ $t('total_price') }} : <span class="text-heart font-semibold ml-5">${{ receipt.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReceiptInfo
          @onPay="onPay($event)"
          @closeModal="this.closeInfo"
          v-if="showInfo"
          :receiptDetail="receiptDetail"
          :message="message"
          :success="success"/>
      <ConfirmDelete
          v-if="showConfirm"
          @cancelModal="closeMessage"
          @yes="ConfirmDelete" :msg="msg"/>
      <Bill
          :receiptDetail="receiptDetail"
          v-if="isBill"
          @closeModal="()=>{this.isBill = false; this.showInfo = true;}"/>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import InvoiceIcon from "./../../components/BillInvoiceIcon.vue"
import DeleteIcon from "./../MyCourse/components/DeleteIcon"
import ReceiptInfo from "./../MyCourse/components/ReceiptInfo"
import ConfirmDelete from "./../Component/BuyMsg.vue"
import moment from "moment"
import Loading from "./../../components/Loading"
import eHeader from "./../Video/components/Header.vue"
import Empty from "./../Component/Empty.vue"
import Bill from "@/views/Component/Bill";

export default {
  name: "Invoice",
  components: {
    Bill,
    InvoiceIcon,
    DeleteIcon,
    ReceiptInfo,
    ConfirmDelete,
    Loading,
    eHeader,
    Empty
  },
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      isBill: false,
      showConfirm: false,
      receiptId: "",
      showInfo: false,
      active: 1,
      success: false,
      msg: "delete",
      page: 1,
      enableScroll: true,
      message: "ពត៍មានបង់ប្រាក់",
    }
  },
  computed: {
    ...mapState('receipt', ['receipts', 'takingReceipt', 'receiptDetail', 'loadingReceipt', 'id']),
    ...mapState('setting', ['darkMode', 'isHide'])
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions('receipt', ['deleteReceipt', 'getReceipt', 'getReceiptDetail']),
    onPay(rc) {
      this.isBill = true
      this.showInfo = false
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    viewReceipt(receipt) {
      this.success = receipt.status === 1;
      this.message = "ពត៍មានបង់ប្រាក់"
      this.getReceiptDetail(receipt._id).then(() => {
        this.showInfo = true
      })

    },
    closeInfo() {
      this.showInfo = false
      this.$store.commit('receipt/getId', "")
    },
    removeReceipt(receiptId) {
      this.showConfirm = true
      this.receiptId = receiptId
    },
    closeMessage() {
      this.showConfirm = false
    },
    ConfirmDelete() {
      this.deleteReceipt(this.receiptId).then(() => {
        this.showConfirm = false
      })
    },
    formatDate(date) {
      moment.locale('en')
      if (!date) {
        return
      }
      return moment(date).format("DD-MM-YYYY")
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= (scrollHeight - 2)) {
        this.page++

        let payload = {}
        payload.p = this.page
        payload.type = 'all'

        if (this.enableScroll) {
          this.getReceipt(payload).then(res => {
            if (res.data.data.length <= 0) {
              this.enableScroll = false
            }
          })
        }
      }
    },
  },
  created() {
    if (this.id) {
      this.showInfo = true
    }
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getReceipt({
      type: 'all',
      p: this.page
    })
  },
  watch: {
    'id': function (id) {
      if (id) {
        this.showInfo = true
      }
    }
  }
}
</script>