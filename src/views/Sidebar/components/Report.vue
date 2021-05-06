
<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-textSecondary':''">
            {{$t('1115')}}
        </div>
        <div class="px-3 my-3 mt-5">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-10 cursor-pointer w-full">
                        <img src="/icon/icon/activity.png" class="h-5 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1116')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-10 cursor-pointer w-full">
                        <img src="/icon/icon/watch-video.png" class="h-5 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1117')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-10 cursor-pointer w-full">
                        <img src="/icon/icon/read-book.png" class="h-5 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1118')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-10 cursor-pointer w-full">
                        <img src="/icon/icon/quiz-result.png" class="h-5 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1119')}}
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
            ...mapState('setting', ['darkMode'])
        },
    }
</script>