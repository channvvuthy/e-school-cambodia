<template>
    <div class="fixed inset-0 font-khmer_os w-full left-0 top-0 bg-black bg-opacity-90 flex justify-center items-center" style="z-index:70;">
            <div class="rounded-xl shadow-lg w-96" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <div class="py-5">
                    <div class="header text-center text-sm font-semibold pb-3">
                        {{$t('2306')}}
                    </div>
                    <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                    <div class="text-13px overflow-y-scroll" style="max-height: 550px;">
                        <div class="p-5">
                            <div class="flex justify-between items-center">
                                <input type="text" id="invoice_number"  class="absolute" :value="receiptDetail.receipt" style="z-index:-10">
                                <div>{{$t('invoce_no')}}</div>
                                <div class="flex-1 text-right" :class="darkMode?`text-gray-300`:`text-heart`">​{{receiptDetail.receipt}}</div>
                                <div class="ml-2 cursor-pointer" @click="copyText()"><CopyIcon :size="20" :fill="darkMode?`#D1D5DB`:`#000000`"></CopyIcon></div>
                            </div>
                            <div class="flex justify-between items-center mt-3">
                                <div>{{$t('2308')}}</div>
                                <div>{{formatDate(receiptDetail.date)}}</div>
                            
                            </div>

                            <div class="course mt-3">
                                <div class="font-black">{{$t('1102')}}</div>
                                <ul>
                                    <li class="flex justify-between items-center my-2"
                                        v-for="(receipt, key) in receiptDetail.detail" :key="key">
                                        <div>- {{receipt.title}}</div>
                                        <div class="text-placeholder">
                                            <span class="font-mono">${{parseFloat(receipt.amount)}}</span> {{duration(receipt.duration)}}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                        <div class="p-5 mt-1">
                            <div class="total flex justify-between items-center">
                                <div>{{$t('total')}}</div>
                                <div class="text-heart font-mono font-bold">${{parseFloat(receiptDetail.amount)}}</div>
                            </div>
                            <div v-if="!success">
                                <div class="mt-3 text-center text-13px">{{$t('payment_method')}}</div>
                                <div class="mt-6">
                                    <div class="flex justify-between items-center">
                                        <img src="/icon/Payment/ABA.png" class="w-20"/>
                                        <div class="flex-1 ml-5 text-left flex justify-start flex-col items-start">
                                            <div class="text-base font-semibold">ABA</div>
                                            <div class="text-center text-sm mt-2">E-SCHOOL</div>
                                        </div>
                                    </div>
                                    <div class="h-5"></div>
                                    <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                                    <div class="h-5"></div>
                                    <div class="flex justify-between items-center">
                                        <img src="/icon/Payment/Wing.png" class="w-20"/>
                                        <div class="flex-1 ml-5 text-left flex justify-start flex-col items-start">
                                            <div class="text-base font-semibold">Wing</div>
                                            <div class="text-center text-sm mt-2">E-School(5224)</div>
                                        </div>
                                    </div>
                                    <div class="h-5"></div>
                                    <div class="w-full h-0 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                                    <div class="h-5"></div>
                                    <div class="flex justify-between items-center">
                                        <img src="/icon/Payment/Truemoney.png" class="w-20"/>
                                        <div class="flex-1 ml-5 text-left flex justify-start flex-col items-start">
                                            <div class="text-base font-semibold">True Money</div>
                                            <div class="text-center text-sm mt-2">E-School(2121)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template v-else>
                                <div class="flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                         width="70" height="70"
                                         viewBox="0 0 172 172"
                                         style=" fill:#000000;">
                                        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1"
                                           stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"
                                           stroke-dasharray="" stroke-dashoffset="0" font-family="none"
                                           font-weight="none" font-size="none" text-anchor="none"
                                           style="mix-blend-mode: normal">
                                            <path d="M0,172v-172h172v172z" fill="none"></path>
                                            <g>
                                                <path d="M169.34609,86c0,-46.02344 -37.32266,-83.34609 -83.34609,-83.34609c-46.02344,0 -83.34609,37.32266 -83.34609,83.34609c0,46.02344 37.32266,83.34609 83.34609,83.34609c46.02344,0 83.34609,-37.32266 83.34609,-83.34609z"
                                                      fill="#2ecc71"></path>
                                                <path d="M131.88906,58.08359c-1.94844,-5.07266 -5.94609,-4.26641 -10.27969,-3.39297c-2.58672,0.5375 -14.10937,3.89687 -32.28359,23.1125c-7.55859,7.96172 -12.53047,14.31094 -15.82266,19.14844c-2.01562,-2.45234 -4.3,-5.10625 -6.71875,-7.49141c-7.42422,-7.42422 -15.72187,-12.53047 -16.05781,-12.73203c-3.46016,-2.11641 -7.99531,-1.04141 -10.14531,2.45234c-2.11641,3.46016 -1.04141,7.99531 2.41875,10.14531c0.06719,0.03359 7.18906,4.43438 13.30313,10.58203c6.24844,6.24844 11.92578,14.71406 11.99297,14.81484c1.37734,2.08281 3.69531,3.29219 6.14766,3.29219c0.40312,0 0.83984,-0.03359 1.27656,-0.10078c2.88906,-0.50391 5.17344,-2.65391 5.87891,-5.47578c0.03359,-0.06719 2.95625,-8.16328 18.37578,-24.42266c12.42969,-13.13516 20.72734,-17.30078 23.61641,-18.44297c0.03359,0 0.03359,0 0.10078,0c0,0 0.10078,-0.03359 0.26875,-0.13438c0.50391,-0.20156 0.77266,-0.26875 0.77266,-0.26875c-0.13437,0.03359 -0.20156,0.03359 -0.20156,0.03359v-0.03359c1.34375,-0.57109 3.82969,-1.64609 3.86328,-1.67969c3.72891,-1.6125 4.97187,-5.64375 3.49375,-9.40625z"
                                                      fill="#ffffff"></path>
                                            </g>
                                        </g>
                                    </svg>

                                </div>
                                <div class="flex justify-center items-center text-sm font-semibold mt-3">វិក្កយបត្របានបង់ប្រាក់ហើយ</div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="sm:flex sm:flex-row text-sm font-khmer_os h-10 justify-center items-center mb-5 px-5">
                    <button type="button" @click="closeInfo($event)"
                            class="w-full rounded-md bg-primary py-2 text-md text-white shadow-lg  font-semibold px-10 focus:outline-none">
                        {{$t('1010')}}
                    </button>
                </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment"
    import {mapState} from "vuex"
    import CopyIcon from "./../../../components/CopyIcon.vue"
    import helper from "./../../../helper/helper"
    export default{
        name: "ReceiptInfo",
        components:{
            CopyIcon
        },
        props: {
            success: {
                default: () => {
                    return false
                }
            },
            receiptDetail: {
                type: Object
            }
        },
        computed:{
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            closeInfo($event){
                this.$emit("closeInfo", $event);
            },
            formatDate(date){
                if (!date) {
                    return null
                }
                return moment(date).format("DD-MM-YYYY h:mm")
            },
            duration(duration){
                if (duration < 12) {
                    return `/ ${duration} ខែ`
                }
                return "/ ឆ្នាំ"
            },

            showCart($event){
                this.$emit("showCart", $event);
            },
            copyText() {
                var copyText = document.getElementById("invoice_number");
                copyText.select();
                copyText.setSelectionRange(0, 99999)
                document.execCommand("copy");
                helper.success("Copied the text: " + copyText.value)
            }
            
        }
    }
</script>