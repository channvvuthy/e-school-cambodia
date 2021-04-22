<template>
    <div class="bg-white w-full">
        <div class="pl-12 pr-5 flex justify-between items-center">
            <div class="grid grid-cols-5 gap-6">
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Group 3@2x.png" class="h-6"/>
                    <p class="mt-2  color-primary" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1101')}}
                    </p>
                    <div class="border border-primary border-r-0 border-l-0 bg-primary w-full"></div>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Video@2x.png" class="h-6"/>
                    <p class="mt-2 " :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('2108')}}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Library@2x.png" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('2200')}}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Partner@2x.png" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1104')}}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Support.svg" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1105')}}
                    </p>
                </div>
            </div>
            <div class="flex justify-end">
                <div class="flex justify-between items-end flex-1">
                    <div class="flex flex-col justify-center items-center cursor-pointer ">
                        <img src="/icon/Home/Cart@2x.png" class="h-6"/>
                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-12">
                        <img src="/icon/Home/Chat@2x.png" class="h-6"/>
                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-12">
                        <img src="/icon/Home/Notification@2x.png" class="h-6"/>
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
        }
    }
</script>