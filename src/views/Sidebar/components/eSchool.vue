<template>
    <div>
        <div class="text-primary font-semibold text-sm">
            {{$t('1127')}}
        </div>
        <div class="px-3 my-3 mt-5">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/chat.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1128')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/policy.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1129')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/help.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1130')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/about.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1131')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/share.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1132')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/mode.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1133')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 w-full cursor-pointer"
                         @click="setLocalization(localize==='kh'?'en':'kh')">
                        <img src="/icon/icon/en.png" class="h-5 m-auto"
                             v-if="localize==='kh'">
                        <img src="/icon/icon/kh.png" class="h-6 m-auto" v-else>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1134')}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    export default{
        computed: {
            ...mapState('setting', ['localize'])
        },
        methods: {
            setLocalization(lang){
                this.$store.commit('setting/setLocalize', lang)
            }
        }
    }
</script>