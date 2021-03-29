<template>
    <div class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-96"
                 role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white">
                    <iframe :srcdoc="htmlDoc"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CloseIcon from "./../components/CloseIcon"
    import {mapActions, mapState} from "vuex"

    export default{
        name: "WebViewPayment",
        components: {
            CloseIcon,
        },
        props: {
            htmlDoc
        },
        computed: {
            ...mapState('payment', ['loadingCheckout', 'checkoutData', 'transaction']),
            ...mapState('cart', ['cart'])
        },
        methods: {
            ...mapActions('payment', ['checkout', 'getTransaction', 'abaPay', 'wingPay']),
        }
    }
</script>