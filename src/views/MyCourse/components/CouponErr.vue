<template>
    <div class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <!--
              Background overlay, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle"
                 :class="`w-${size}`" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white">
                    <div class="flex justify-center items-center">
                        <div class="mt-2 py-3">
                            <p class="text-sm text-gray-500 text-sm font-khmer_os">
                                {{ message }}
                            </p>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="sm:flex sm:flex-row text-sm font-khmer_os h-10 justify-center items-center py-5">
                    <button type="button"
                            @click="closeCouponErr"
                            class="w-full inline-flex justify-center  px-4   text-base font-medium text-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        បាទ/ចាស់
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: "CouponErr",
        props: {
            message: {
                type: String
            },
            size: {
                type: Number
            }
        },
        methods: {
            closeCouponErr($event){
                this.$emit("closeCouponErr", $event)
            }
        }

    }
</script>