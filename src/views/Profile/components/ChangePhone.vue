<template>
    <Modal width="w-100">
        <div class="p-5 h-1/3 overflow-y-scroll">
            <div class="font-black flex justify-between">
                <div class="w-full text-center">
                    <div class="text-lg">
                        ទម្រង់ស្នើរសុំប្តូរលេខទូរសព្ទ
                    </div>
                    <div class="mt-2 text-center">
                        សូមធ្វើការបញ្ចូលលេខទូរសព្ទថ្មី
                    </div>
                </div>
                <div class="cursor-pointer" @click="()=>{this.$emit('close')}">
                    <CloseIcon/>
                </div>
            </div>
            <div class="mt-5">
                <input type="text" class="bg-transparent border-b w-full"
                       :class="darkMode ? `border-button` : ``"
                       v-model="payload.phone"
                       ref="phoneNumber"
                       :placeholder="$t('phone_number')">
            </div>
            <div class="my-10">
                <div
                        :class="darkMode ? `border-button` : ``"
                        class="border-b py-3">លេខទូរសព្ទចាស់
                </div>
                <div v-if="phones.length">
                    <div v-for="(name, index) in phones" :key="index"
                         :class="darkMode ? `border-button` : ``"
                         class="border-b py-2 flex justify-between items-center">
                        <div>
                            <div class="font-black">(+855){{name.phone}}</div>
                            <div
                                    :class="darkMode ? `` : `text-gray-400`"
                                    class="text-sm">{{dateFormat(name.date)}}
                            </div>
                        </div>
                        <div class="w-2 h-2 rounded-full" :class="status(name.status)"></div>
                    </div>
                </div>
            </div>
            <button
                    :disabled="loading"
                    @click="updatePhone"
                    class="relative bg-primary w-full rounded-lg text-white py-3 text-center outline-none">
                <div v-if="!loading">
                    {{$t('submit')}}
                </div>
                <div v-else>
                    <div>&nbsp;</div>
                    <div class="absolute -top-1 flex items-center justify-center w-full">
                        <div class="loader"></div>
                    </div>
                </div>
            </button>
        </div>
    </Modal>
</template>

<script>
    import Modal from "../../../components/Modal";
    import CloseIcon from "../../../components/CloseIcon";
    import helper from "../../../helper/helper";
    import moment from "moment";
    import {mapState} from "vuex"


    export default {
        components: {
            CloseIcon,
            Modal
        },
        data() {
            return {
                loading: false,
                phones: [],
                payload: {
                    phone: null
                }
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            updatePhone() {
                if (!this.payload.phone || this.payload.phone == '' || !this.payload.phone.length) {
                    this.$refs.phoneNumber.focus()
                    return
                }
                this.loading = true
                this.$store.dispatch("auth/updatePhone", this.payload).then(res => {
                    this.loading = false
                    this.$emit('close')
                    if (res.msg) {
                        helper.errorMessage(res.msg)
                        return
                    }
                    helper.success('review_change_name')
                })
            },
            dateFormat(date) {
                return moment(date).format('MMM DD YYYY')
            },
            status(status) {
                if (status == 1) {
                    return "bg-primary"
                }
                if (status == 2) {
                    return "bg-yellow-500"
                }
                if (status == 3) {
                    return "bg-red-500"
                }
            },
        },
        mounted() {
            this.$store.dispatch("auth/getPhoneUpdate").then(res => {
                if (res.data) {
                    this.phones = res.data
                }
            })
        }
    }
</script>

<style scoped>

</style>