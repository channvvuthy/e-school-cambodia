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
                    <div class="flex items-end rounded-xl h-44 w-80 bg-cover relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" :style="{backgroundImage:`url(${pk.thumbnail})`}">
                        <div class="absolute w-full h-full bg-gradient-to-t from-black  rounded-xl cursor-pointer" @click="showConfirm(pk)"></div>
                        <div class="px-5 py-3 text-white relative z-50 w-full">
                            <div class="text-base">{{pk.title}}</div>
                            <div class="flex mt-1 items-center justify-between w-full">
                                <div class="font-extralight">{{pk.total_book}} {{$t('2202')}}</div>
                                <div class="h-3 w-0 border-l border-white mx-4"></div>
                                <div class="font-extralight">{{$t('1006')}}: <span class="text-base font-bold text-heart ml-2 text-lg font-mono shadow">{{pk.price.year}}$</span></div>
                                <div class="flex-1 flex justify-end">
                                    <span class="cursor-pointer" @click="addToCart(pk)" :id="pk._id" v-if="pk.is_buy === 0">
                                        <CartIcon fill="#FFFFFF" v-if="!pk.is_in_cart"></CartIcon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </vue-horizontal>
        </div>
        <BuyMsg v-if="showMsg" @cancelModal="() => {this.showMsg = false}" @yes="yes()"></BuyMsg>
        <Cart v-if="showCart" @closeCart="() => {this.showCart = false}"></Cart>
    </div>
</template>
<script>
import VueHorizontal from 'vue-horizontal';
import CartIcon from "./../../../components/CartIcon.vue"
import {mapState,mapActions} from "vuex"
import BuyMsg from "./../../../views/Component/BuyMsg.vue"
import Cart from "./../../../views/Component/Cart.vue"
export default {
    components: {
        VueHorizontal,
        CartIcon,
        BuyMsg,
        Cart
    },
    data() {
        return{
            showMsg: false,
            showCart: false,
            pk: {}
        }
    },
    computed:{
        ...mapState('library', ['libraries', 'loading']),
        ...mapState('setting', ['darkMode']),

    },
    methods:{
        ...mapActions('cart', ['addCart', 'getCart']),
       async addToCart(pk){
            let payload = {}

            payload.id = pk._id
            await this.addCart(payload).then(() =>{
                this.getCart()
            })
        },
        yes(){
            this.showMsg = false
            this.addToCart(this.pk).then(() =>{
                this.showCart = true; 
            })
        },
        showConfirm(pk){
           if(pk.is_buy == 0){
            this.showMsg = true
            this.pk = pk
           }
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