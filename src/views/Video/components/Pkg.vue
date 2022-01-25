<template>
    <div class="p-5 border-b border-dashed">
        <vue-horizontal :button="false">
                <section v-for="(pkg, index) in packages" :key="index" class="mr-5">
                    <div class="flex items-end h-44 w-80 bg-cover relative" :style="{backgroundImage:`url(${pkg.thumbnail})`}">
                        <div class="absolute w-full h-full bg-gradient-to-t from-black cursor-pointer"></div>
                        <div class="px-5 py-3 text-white relative z-50 w-full">
                            <div class="text-base">{{pkg.title}}</div>
                            <div class="flex mt-1 items-center justify-between w-full">
                                <div class="font-semibold">{{pkg.total_item}} {{$t('2202')}}</div>
                                <div class="h-3 w-0 border-l border-white mx-4"></div>
                                <div class="font-semibold">
                                    {{ $t('1006') }}: <span class="text-red-500 text-lg">{{pkg.price.year}}$</span>
                                </div>
                                <div class="flex-1 flex justify-end">
                                    <span class="cursor-pointer" :id="pkg._id" @click="addToCart(pkg)">
                                        <CartIcon fill="#FFFFFF" v-if="!pkg.is_in_cart"></CartIcon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </vue-horizontal>
    </div>
</template>
<script>
import moment from "moment"
import VueHorizontal from 'vue-horizontal';
import CartIcon from "./../../../components/CartIcon.vue"
import {mapState,mapActions} from "vuex"
export default {
    components:{
         VueHorizontal,
         CartIcon
    },
    props:{
        packages:{
            type: Array,
            default:()=>{
                return []
            }
        }
    },
    methods:{
        ...mapActions('cart', ['addCart', 'getCart']),
        formatDate(date){
            moment.locale('en');
            return moment(date).format('ll');
        },
        async addToCart(pk){
            let payload = {}

            payload.id = pk._id
            await this.addCart(payload).then(() =>{
                this.getCart()
            })
        },
    },
    created(){

    }
}
</script>