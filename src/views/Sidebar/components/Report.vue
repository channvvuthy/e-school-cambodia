
<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1115')}}
        </div>
        <div class="px-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/activity.png" class="h-5 m-auto"> -->
                        <div><ActivityIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ActivityIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1116')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/watch-video.png" class="h-5 m-auto"> -->
                        <div><WatchVideoIcon :fill="darkMode?`#909090`:`#0f3c7a`"></WatchVideoIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1117')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/read-book.png" class="h-5 m-auto"> -->
                        <div><BookIcon :fill="darkMode?`#909090`:`#0f3c7a`"></BookIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1118')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/quiz-result.png" class="h-5 m-auto"> -->
                        <div><QuizIcon :fill="darkMode?`#909090`:`#0f3c7a`"></QuizIcon></div>

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
    import ActivityIcon from "./../../../components/ActivityIcon"
    import WatchVideoIcon from "./../../../components/WatchVideoIcon"
    import BookIcon from "./../../../components/BookIcon"
    import QuizIcon from "./../../../components/QuizIcon"

    export default{
        components:{
            ActivityIcon,
            WatchVideoIcon,
            BookIcon,
            QuizIcon
        },
        computed: {
            ...mapState('setting', ['darkMode'])
        },
    }
</script>