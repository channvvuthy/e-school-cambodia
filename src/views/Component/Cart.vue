<template>
    <div>
        <div class="fixed w-full h-full left-0 top-0 flex justify-center items-center z-50 text-sm bg-black bg-opacity-90">
            <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"  class="rounded-2xl shadow relative py-3 w-4/12">
                <div @click="closeCart" class="absolute top-2 right-3 cursor-pointer">
                    <CloseIcon :fill="darkMode?`#D1D5DB`:`#000000`" :width="20"></CloseIcon>
                </div>
                <!-- Title -->
                <div class="w-full text-center h-12 flex items-center justify-center text-base">
                        <div>{{$t('2300')}}</div>
                </div>
                <div :class="darkMode?`border-button`:`border-gray-200`" class="border-b"></div>
                <div class="overflow-y-scroll max-h-100">
                    <!-- Unpaid invoice -->
                    <div :class="darkMode?`bg-youtube`:`bg-softGray`">
                        <!-- Invoice title -->
                        <div class="w-full text-center h-14 flex items-center justify-center">
                            <div>{{$t('2301')}}</div>
                        </div>
                        <div class="px-5 py-3" :class="darkMode?`border-t border-secondary`:`border-t border-gray-300`">
                            <div class="flex justify-between items-center">
                                <div class="mr-5"><InvoiceIcon :size="40" :fill="darkMode?`#D1D5DB`:`#000000`"></InvoiceIcon></div>
                                <div class="flex flex-col justify-betwen flex-1">
                                    <!-- Invoice ID -->
                                    <div>000024128</div>
                                    <div>05-04-2021 15:33</div>
                                </div>
                                <!-- Price & delete -->
                                <div class="text-bold mr-3">$20.0</div>
                                <div class="cursor-pointer"><DeleteIcon :fill="darkMode?`#D1D5DB`:`#c0272d`"></DeleteIcon></div>

                            </div>
                        </div>
                    </div>
                    <!-- End unpaid invoice -->
                    <!-- Cart -->
                    <div>
                        <div class="flex justify-between px-5 py-3 border-t" :class="darkMode?`border-button`:``" v-for="(cart, index) in carts.list" :key="index">
                            <div class="w-2/5 mr-3 bg-red-200">
                                <img :src="cart.thumbnail">
                            </div>
                            <div class="flex flex-col flex-1 py-1">
                                <!-- Title -->
                                <div class="mb-3">
                                    {{cart.title}}
                                </div>
                                <div class="text-xs" :class="darkMode?`text-gray-500`:``">
                                    {{cart.teacher.name}}
                                </div>
                            </div>
                            <!-- Price -->
                            <div class="flex flex-col items-end">
                                <div class="cursor-pointer flex-1" @click="confirmDeleteCart(cart._id)">
                                    <DeleteIcon :fill="darkMode?`#D1D5DB`:`#c0272d`"></DeleteIcon>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex items-center justify-between">
                                        <div :class="cart.price.month?'':`${darkMode?`text-white`:`text-heart`}`">
                                                {{durationCalculate((cart.price.duration ? cart.price.duration : 12), cart.price.month, cart.price.year)}}
                                        </div>
                                        <div class="flex flex-col ml-2">
                                            <div class="transform -rotate-180 cursor-pointer">
                                                <ChevronIcon :size="18" :fill="darkMode?`#D1D5DB`:`${cart.price.month?`#000000`:`#c0272d`}`"></ChevronIcon>
                                            </div>
                                            <div class="transform cursor-pointer ">
                                                <ChevronIcon :size="18" :fill="darkMode?`#D1D5DB`:`${cart.price.month?`#000000`:`#c0272d`}`"></ChevronIcon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Button -->
                <div class="border-t" :class="darkMode?`border-button`:``">
                    <div class="my-7 flex justify-center items-center flex-col ">
                        <div class="mb-5 cursor-pointer" :class="darkMode?`text-gray-300`:`text-youtube`" @click="showCouponForm" v-if="!carts.coupon">{{$t('2302')}}</div>
                        <div class="mb-5 cursor-pointer" :class="darkMode?`text-gray-300`:`text-youtube`" @click="confirmRemoveCoupon" v-else>{{$t('delete_coupon')}}</div>
                        <button class="focus:outline-none rounded-md shadow px-32 h-10" :class="darkMode?`bg-fb text-white`:`bg-primary text-white`">{{$t('2303')}}</button>
                    </div>
                </div>
            </div>
        </div>
        <BuyMsg v-if="showConfirm" :msg="`delete`" @cancelModal="cancelModal" @yes="yes"></BuyMsg>
        <AddCoupon @closeCoupon="closeCoupon" v-if="showCoupon"></AddCoupon>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import CloseIcon from "./../../components/CloseIcon"
import InvoiceIcon from "./../../components/BillInvoiceIcon.vue"
import DeleteIcon from "./../MyCourse/components/DeleteIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon"
import helper from "./../../helper/helper"
import BuyMsg from "./../Component/BuyMsg.vue"
import AddCoupon from "./../Component/AddCoupon"
export default {
    data(){
        return{
            id: '',
            showConfirm: false,
            showCoupon: false,
            isCoupon: false
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('cart', ['carts'])
    },
    components:{
        CloseIcon,
        InvoiceIcon,
        DeleteIcon,
        ChevronIcon,
        BuyMsg,
        AddCoupon
    },
    methods:{
        ...mapActions('cart', ['getCart', 'deleteCart','deleteCoupon']),
        confirmRemoveCoupon(){
            this.isCoupon = true
            this.showConfirm = true
        },
        confirmDeleteCart(id){
            this.id = id
            this.showConfirm = true
        },
        showCouponForm(){
            this.showCoupon = true
        },
        closeCoupon(){
            this.showCoupon = false
        },
        cancelModal(){
            this.showConfirm = false
        },
        yes(){
            if(this.isCoupon === false){
                this.deleteCart(this.id).then(() =>{
                    this.getCart()
                    this.showConfirm = false
                })
            }else{
                this. deleteCoupon({code: this.carts.coupon.code}).then(() =>{
                    this.getCart()
                    this.isCoupon = false
                    this.showConfirm = false
                })
            }
            
        },
        
        closeCart(){
            this.$emit("closeCart")
        },
        durationCalculate(duration, pricePerMonth, pricePerYear){
            return helper.durationCalculate(duration, pricePerMonth, pricePerYear)
        },
    }
}
</script>