<template>
    <div class="fixed w-full h-full bg-black flex justify-center items-center z-50 bg-opacity-80">
        <div class="w-96 shadow rounded-xl shadow relative" :class="darkMode?`bg-youtube`:`bg-white`">
            <div
                    @click="cancel"
                    class="absolute w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center -right-2 -top-4 shadow cursor-pointer">
                <CloseIcon/>
            </div>
            <div class="py-3 border-b px-5 font-extrabold flex justify-between">
                <div class="text-lg">
                    {{ $t('2110') }}
                </div>
                <div v-if="uploading">
                    <LoadingWhite/>
                </div>
            </div>
            <div class="px-5">
                <img :src="imgUrl" class="max-h-52 m-auto my-3">
                <div class="relative my-5">
                <textarea
                        @keyup.enter.exact="send"
                        class="border px-3 text-sm w-full h-12 rounded-xl leading-10 py-1 focus:outline-none resize-none"
                        :placeholder="$t('2113')"
                        v-model="text"
                        :class="darkMode?`bg-transparent border-b border-secondary caret-white text-gray-300`:``"
                        ref="text"></textarea>
                    <div class="cursor-pointer absolute right-3 top-1" style="margin-top: 2px">
                        <div
                                @click="send"
                                style="background-color: rgba(5,81,116,0.2)"
                                class="rounded-full h-9 w-9 cursor-pointer">
                            <div class="rounded-full h-9 w-9 flex items-center justify-center">
                                <SendMessageIcon :fill="darkMode?`#909090`:`#055174`" :size="18"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import SvgLoading from "@/views/Video/components/SvgLoading";
    import SendMessageIcon from "@/components/SendMessageIcon";
    import CloseIcon from "@/components/CloseIcon";
    import LoadingWhite from "@/components/LoadingWhite";

    export default {
        name: "ModalPhoto",
        components: {
            CloseIcon,
            SvgLoading,
            SendMessageIcon,
            LoadingWhite
        },
        props: {
            imgUrl: {
                default: () => {
                    return "";
                }
            }
        },
        data() {
            return {
                text: "",
                loading: false
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            uploading() {
                return this.$store.state.upload.loading
            }
        },
        methods: {
            cancel() {
                this.$emit("cancel")
            },
            send() {
                this.$emit("send", this.text)
                this.loading = true
            }
        },
        mounted() {
            this.$refs.text.focus()
        }
    }
</script>
<style>
    .caret-white {
        caret-color: #fff;
    }
</style>