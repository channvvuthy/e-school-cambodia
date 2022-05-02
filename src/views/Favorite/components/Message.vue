<template>
    <div class="fixed inset-0 overflow-y-auto flex items-center justify-center w-full h-full bg-black bg-opacity-90 top-0 left-0" style="z-index:122;">
            <div class="relative rounded-xl shadow-md" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" >
                <div>
                    <div class="absolute right-3 top-3  cursor-pointer" @click="close">
                        <CloseIcon :width="20" :height="20" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                    </div>
                    <div class="flex justify-center items-center p-5">
                        <div class="text-center mt-0 mx-4 ">
                            <div class="mt-2 py-4">
                                <p class="text-base text-sm font-khmer_siemreap">
                                    {{ message }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-1 border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                <div class="sm:flex sm:flex-row text-sm font-khmer_siemreap h-12 justify-center items-center">
                    <button type="button" @click="deleteFavorite"
                            class="w-full inline-flex justify-center  px-4   text-base font-medium  focus:outline-none">
                        <span class="text-base">{{$t('1008')}}</span>
                    </button>
                </div>
            </div>
    </div>
</template>

<script>
    import helper from "./../../../helper/helper"
    import CloseIcon from "./../../../components/CloseIcon"
    import {mapState} from "vuex"
    export default{
        name: "ForgotPassword",
        components: {
            CloseIcon
        },
        props: {
            message: {
                type: String,
                default: () => {
                    return 'តើអ្នកចង់លុបវាមែនទេ?'
                }
            },
            size: {
                type: Number,
                default: () => {
                    return 60;
                }
            },
            hide: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
        },
        computed:{
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            deleteFavorite($event){
                this.$emit("deleteFavorite", $event);
            },
            close($event){
                this.$emit("close", $event)
            },
            gender(){
                return helper.gender()
            }
        }
    }
</script>