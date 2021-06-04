<template>
    <div class="fixed w-full h-full left-0 top-0 z-50 bg-black bg-opacity-90 flex items-center justify-center" style="z-index:56">
        <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="rounded-xl">
             <div class="px-5 mt-3 text-center">{{$t('2304')}}</div>
            <div class="px-5">
                <input type="text" class="focus:outline-none border h-9 mt-3 rounded-md w-full pl-3 font-normal py-2" :class="darkMode?`bg-youtube border-active`:``" ref="coupon" id="coupon" v-model="coupon">
            </div>
             <div class="flex justify-between items-center px-5 h-10 text-sm border-t mt-4" :class="darkMode?`text-white border-button`:`text-primary`">
                <button class="focus:outline-none flex-1 font-semibold" @click="cancel">{{$t('1011')}}</button>
                <div class="border-l h-full w-0" :class="darkMode?`border-button`:``"></div>
                <button class="focus:outline-none flex-1 font-semibold" @click="yes">{{$t('1008')}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import helper from "./../../helper/helper"
export default {
    data(){
        return{
            coupon: ""
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('cart', ['addCoupon','getCart']),
        setFocus(){
            this.$refs.coupon.focus()
        },
        yes(){
            if(!this.coupon.length){
                helper.errorMessage('please_enter_coupon')
                this.setFocus()
            }else{
                this.addCoupon({code:this.coupon}).then(response =>{
                    if(response.data.status === 1){
                        helper.errorMessage(response.data.msg)
                        this.setFocus()
                    }else{
                        this.cancel()
                        this.$emit("addedCoupon")
                    }
                })
            }
        },
        cancel(){
            this.$emit("closeCoupon")
        }
    },
    mounted(){
        this.setFocus()
    }
}
</script>