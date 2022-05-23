<template>
    <div class="fixed w-full h-full left-0 top-0 flex justify-center items-center bg-black bg-opacity-95"
         style="z-index:70;">
        <div class="rounded-xl w-80" :class="darkMode?`bg-secondary text-gray-300`:`bg-white text-youtube`">
            <div class="p-4 flex justify-between items-center">
                <div class="flex-1 text-center">
                    {{$t('2303')}}
                </div>
                <div class="relative -top-2 left-1 cursor-pointer" @click="closePay">
                    <CloseIcon :fill="darkMode?`#909090`:`#000000`" :width="20"/>
                </div>
            </div>
            <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
            <div class="flex items-center justify-between px-5 pb-7 pt-4 cursor-pointer" @click="checkout">
                <img src="icon/Payment/Bill.png" class="mt-3 w-20"/>
                <div class="flex-1 text-left pl-5">{{$t('create_receipt')}}</div>
            </div>
            <div class="px-5">
                <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
            </div>
            <div class="h-10"></div>
        </div>
    </div>
</template>
<script>
    import CloseIcon from "./../../components/CloseIcon.vue"
    import {mapActions, mapState} from "vuex"

    export default {
        data() {
            return {
                checkoutData: {}
            }
        },
        components: {
            CloseIcon
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            ...mapState('cart', ['carts'])
        },
        methods: {
            ...mapActions('cart', ['cartCheckout']),
            ...mapActions('receipt', ['getReceiptDetail']),

            closePay() {
                this.$emit("closePay")
            },
            checkout() {
                let courses = []
                for (let i = 0; i < this.carts.list.length; i++) {
                    let course = {}
                    course.id = this.carts.list[i]._id
                    if (this.carts.list[i].price.duration) {
                        course.month = this.carts.list[i].price.duration
                    } else {
                        course.month = 12
                    }
                    courses.push(course)

                }

                let checkoutCourse = {courses}
                this.cartCheckout(checkoutCourse).then(response => {
                    this.getReceiptDetail(response.data.data.e_code).then(response => {
                        this.$emit("showInvoice", response.data.data)
                    })
                })
            },

        }
    }
</script>