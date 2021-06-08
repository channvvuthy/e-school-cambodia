<template>
    <div class="font-khmer_os font-14px h-screen pb-60 overflow-y-scroll">
        <div class="flex justify-center items-center h-90" v-if="loadingPartner">
            <div>
                <loading></loading>
            </div>
        </div>
        <div v-else>
            <div class="grid gap-6 md:grid-cols-3 2xl:grid-cols-4 px-5 mt-5" v-if="(partners && partners.length)">
               <div v-for="(partner, index) in partners" :key="index" class="rounded-xl shadow-md" :class="darkMode?`bg-secondary text-gray-300 ${partner.packages.length > 1?`col-span-2`:``}`:`bg-white ${partner.packages.length > 1?`col-span-2`:``}`">
                   <div>
                        <div class="flex items-center p-3">
                            <div class="h-14 w-14 bg-cover rounded-full" :class="darkMode?`bg-byline`:`bg-gray-300`" :style="{backgroundImage:`url(${partner.photo})`}"></div>
                            <div class="ml-3 text-sm font-semibold">{{partner.name}}</div>
                        </div>
                        <template v-if="partner.type === 2">
                            <vue-horizontal>
                                <section v-for="(pk, key) in partner.packages" :key="key" class="pb-3 px-3">
                                     <div class="bg-cover rounded cursor-pointer" :style="{backgroundImage:`url(${pk.thumbnail})`}" :class="isHide?`md:w-80 md:h-52`:`md:h-36 md:w-56`" @click="openWebView(pk)">
                                    </div>
                                    <div class="flex items-center h-14 justify-between mt-1">
                                        <div class="text-sm">{{$t('1006')}}: <del class="mx-2 font-semibold">${{pk.price.discount}}</del><span>${{pk.price.year}}</span></div>
                                        <div class="cursor-pointer" v-if="pk.is_buy === 0">
                                            <CartIcon :fill="darkMode?`#909090`:`#000000`" v-if="pk.is_in_cart === 0"></CartIcon>
                                        </div>
                                    </div>
                                </section>
                            </vue-horizontal>
                        </template>
                        <template v-else>
                            <div v-for="(pk, key) in partner.packages" :key="key" class="px-3 pb-3">
                                <div v-if="key === 0">
                                    <img :src="pk.thumbnail" class="rounded cursor-pointer" @click="openWebView(pk)">
                                </div>
                            </div>
                            <div class="flex px-3 items-center h-14 justify-between">
                                <div class="text-sm">{{$t('1006')}}: <del class="mx-2 font-semibold">${{partner.packages[0].price.discount}}</del><span>${{partner.packages[0].price.year}}</span></div>
                                <div class="cursor-pointer" v-if="partner.packages[0].is_buy === 0">
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
    // import err from "./../../helper/err"
    export default{
        components: {
            Loading,
            CartIcon,
            VueHorizontal,
            Cart,
            BuyMsg
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
                mutiPaginages: []
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

            addToCart(index, key, course_id){
                this.addCart(course_id).then(() => {
                    this.$store.commit("partner/addCartToPartner", {index, key})

                    this.afterAddToCart(course_id)
                    this.getCart()
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
                })
                this.errMessage = ""
            },
            openWebView(partner){
                this.id = partner._id
                this.openPartner(partner._id).then(response => {
                    console.log(response)
                    if (response.status !== undefined && response.status === 1) {
                        if (response.msg === 'វគ្គសិក្សាមិនត្រឹមត្រូវ') {
                            return
                        }
                        this.errMessage = response.msg
                    } else {
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
            }
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
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