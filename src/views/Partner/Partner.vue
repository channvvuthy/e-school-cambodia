<template>
    <div class="font-khmer_os font-14px h-90 overflow-y-scroll">
        <div class="flex justify-center items-center h-90" v-if="loadingPartner">
            <div>
                <loading></loading>
            </div>
        </div>
        <div v-else>
            <div class="grid gap-6 px-5 mt-5" :class="window.width <= 1366?`grid-cols-3`:`grid-cols-4`" v-if="(partners && partners.length)">
               
            </div>
           
        </div>
        <Message v-if="errMessage" :message="errMessage" @closeMessage="closeMessage" @showCart="showCart"></Message>
        <Cart v-if="showCartForm" @closeCart="closeCart"></Cart>
    </div>
</template>
<script>
    import {mapState, mapActions} from "vuex"
    import Loading from "./../../components/Loading"
    import CartIcon from "./../../components/CartIcon"
    import VueHorizontal from "vue-horizontal";
    import Message from "./../MyCourse/components/Message"
    import Cart from "./../MyCourse/components/Cart"
    const {ipcRenderer} = require('electron')
    import err from "./../../helper/err"
    export default{
        components: {
            Loading,
            CartIcon,
            VueHorizontal,
            Message,
            Cart
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
                course_id: "",
                showCartForm: false,
                index: "",
                key: "",
                singlePackages: [],
                mutiPaginages: []
            }
        },
        computed: {
            ...mapState('partner', ['partners', 'loadingPartner']),
            ...mapState('setting', ['darkMode']),
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
            openWebView(index, key, partner){
                this.course_id = partner._id
                this.index = index
                this.key = key

                this.openPartner(partner._id).then(response => {
                    if (response.status !== undefined && response.status === 1) {
                        if (response.msg === 'វគ្គសិក្សាមិនត្រឹមត្រូវ') {
                            return
                        }
                        this.errMessage = response.msg
                    } else {
                        if (response.data.msg !== undefined) {
                            err.congratulation(response.data.msg, response.data.url)
                        } else {
                            ipcRenderer.send("openLink", response.data.url)
                        }

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
                this.window.height = window.innerHeight;
            },
            receiveParther(){
                this.getPartner().then((response) => {
                    console.log(response)
                    // let interval = setInterval(() => {
                    //     let img = document.getElementsByClassName('img')[0].height
                    //     if (img) {
                    //         clearInterval(interval)
                    //         this.image.height = img
                    //     }
                    // }, 100)
                })
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