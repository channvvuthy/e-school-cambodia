<template>
    <div class="font-khmer_os font-14px h-screen pb-60 overflow-y-scroll" @scroll="onScroll">
        <div class="flex justify-center items-center h-90" v-if="loadingPartner">
            <div>
                <loading></loading>
            </div>
        </div>
        <div v-else>
            <div v-if="partners.length == 0" class="h-screen pb-10" style="display:block;">
                <Empty></Empty>
            </div>
            <div class="grid gap-6 md:grid-cols-3 2xl:grid-cols-4 px-5 mt-5" v-if="(partners && partners.length)">
               <div v-for="(partner, index) in partners" :key="index" class="rounded-xl shadow-md" :class="darkMode?`bg-secondary text-gray-300 ${partner.packages.length > 1?`col-span-2`:``}`:`bg-white ${partner.packages.length > 1?`col-span-2`:``}`">
                   <div>
                        <div class="flex items-center p-3">
                            <div class="h-12 w-12 bg-cover rounded-full" :class="darkMode?`bg-byline`:`bg-gray-300`" :style="{backgroundImage:`url(${partner.photo})`}"></div>
                            <div class="ml-3 text-sm font-semibold">{{partner.name}}</div>
                        </div>
                        <template v-if="partner.type === 2">
                            <vue-horizontal>
                                <section v-for="(pk, key) in partner.packages" :key="key" class="pb-3 px-3">
                                     <div class="bg-cover rounded cursor-pointer overflow-hidden" @click="openWebView(pk)">
                                         <img :src="pk.thumbnail" :style="minHeight?{height:`${minHeight}px`}:{}">
                                    </div>
                                    <div class="flex items-center h-14 justify-between relative top-3">
                                        <div class="text-sm">{{$t('1006')}}: <del class="mx-2 font-semibold">${{pk.price.discount}}</del><span>${{pk.price.year}}</span></div>
                                        <div class="cursor-pointer" v-if="pk.is_buy === 0" @click="addToCart(partner,pk)">
                                            <CartIcon :fill="darkMode?`#909090`:`#000000`" v-if="pk.is_in_cart === 0"></CartIcon>
                                        </div>
                                    </div>
                                </section>
                            </vue-horizontal>
                        </template>
                        <template v-else>
                            <div v-for="(pk, key) in partner.packages" :key="key" class="px-3 pb-3">
                                <div v-if="key === 0">
                                    <img :src="pk.thumbnail" class="rounded cursor-pointer match-height m-auto" @click="openWebView(pk)" :style="minHeight?{height:`${minHeight}px`}:{}">
                                </div>
                            </div>
                            <div class="flex px-3 items-center h-14 justify-between">
                                <div class="text-sm">{{$t('1006')}}: <del class="mx-2 font-semibold">${{partner.packages[0].price.discount}}</del><span>${{partner.packages[0].price.year}}</span></div>
                                <div class="cursor-pointer" v-if="partner.packages[0].is_buy === 0" @click="addToCart(partner,partner.packages[0])">
                                    <CartIcon :fill="darkMode?`#909090`:`#000000`" v-if="partner.packages[0].is_in_cart === 0"></CartIcon>
                                </div>
                            </div>
                        </template>
                   </div>
               </div>
            </div>
           
        </div>
        <Cart v-if="showCartForm" @closeCart="closeCart"></Cart>
        <BuyMsg v-if="errMessage" :msg="errMessage" @cancelModal="() =>{this.errMessage = ``}" @yes="yes"></BuyMsg>
    </div>
</template>
<script>
    import {mapState, mapActions} from "vuex"
    import Loading from "./../../components/Loading"
    import CartIcon from "./../../components/CartIcon"
    import VueHorizontal from "vue-horizontal";
    import Cart from "./../MyCourse/components/Cart"
    const {ipcRenderer} = require('electron')
    import BuyMsg from "./../Component/BuyMsg.vue"
    import Empty from "./../Component/Empty.vue"
    import helper from "./../../helper/helper"
    export default{
        components: {
            Loading,
            CartIcon,
            VueHorizontal,
            Cart,
            BuyMsg,
            Empty
        },
        data(){
            return {
                image: {
                    height: 0
                },
                window: {
                    width: 0,
                },
                errMessage: "",
                id: "",
                showCartForm: false,
                singlePackages: [],
                mutiPaginages: [],
                minHeight: null
            }
        },
        computed: {
            ...mapState('partner', ['partners', 'loadingPartner']),
            ...mapState('setting', ['darkMode', 'isHide']),
            removedCart(){
                return this.$store.state.cart.removedCart
            },
        },
        methods: {
            ...mapActions('partner', ['getPartner', 'openPartner']),
            ...mapActions('cart', ['addCart', 'getCart']),
            ...mapActions('course', ['afterAddToCart']),

            addToCart(partner, pk){
                let payload = {}
                payload.id = pk._id

                this.addCart(payload).then(() => {
                    this.afterAddToCart(pk._id)
                    this.getCart()
                    this.$store.commit("partner/addToCart",pk._id)

                })
            },
            colSpan(length){
                if(length > 1){
                    return 2
                }else if(length > 2 ){
                    return 3
                }else{
                    return 4
                }
            },
            getPathFromUrl(url) {
                return url.split("?")[0];
            },

            yes(){
                let payload = {}
                payload.id = this.id

                this.addCart(payload).then(() =>{
                    this.getCart()
                    let myCart = document.getElementById("myCart")
                    myCart.click()
                })
                this.errMessage = ""
            },
            openWebView(partner){
                this.id = partner._id
                this.openPartner(partner._id).then(response => {
                    if (response.status !== undefined && response.status === 1) {
                        if (response.msg === 'វគ្គសិក្សាមិនត្រឹមត្រូវ') {
                            return
                        }
                        this.errMessage = response.msg
                    } else {
                        if(response.data.free_month){
                            helper.success('4111')
                        }
                        ipcRenderer.send("openLink", response.data.url)
                    }
                })
            },
            closeMessage(){
                this.errMessage = ""
            },
            showCart(){
                this.errMessage = ""
                this.addCart(this.course_id).then(() => {

                    this.showCartForm = true
                    this.$store.commit("partner/addCartToPartner", {index: this.index, key: this.key})
                    this.afterAddToCart(this.course_id)
                    this.getCart()
                })
            },
            closeCart(){
                this.showCartForm = false
            },
            handleResize() {
                this.window.width = window.innerWidth;
            },
            receiveParther(){
                this.getPartner()
            },
            onScroll(){
                 this.$nextTick(() => {
                    this.matchHeight()
                })
            },
            matchHeight(){
            let arr = []
            let interval = setInterval(() => {
                let box = document.getElementsByClassName('match-height')
                if (box != null || box !== '-Infinity') {
                    for(let i = 0; i < box.length; i++){
                        arr.push(box[i].clientHeight)
                    }
                    this.minHeight = Math.max(...arr)
                    clearInterval(interval)
                    
                }
            }, 1000)
        },
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        mounted(){
            this.$nextTick(() => {
                this.matchHeight()
            })
        },
        created(){
            this.receiveParther();
            window.addEventListener('resize', this.handleResize);

            this.handleResize();
        },
        watch: {
            removedCart: function (id) {
                if (id) {
                    this.receiveParther()
                }
            }
        }
    }
</script>