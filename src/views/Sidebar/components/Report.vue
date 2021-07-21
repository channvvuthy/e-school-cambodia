
<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1115')}}
        </div>
        <div class="px-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center z-50" @click="goTo('activity')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `activity` || $route.name === `activity-detail`?`bg-byline`:`bg-button`}`:`${$route.name === `activity` || $route.name === `activity-detail`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <ActivityIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `activity` || $route.name === `activity-detail`"></ActivityIcon>
                            <ActivityIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></ActivityIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('summary')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center z-50" @click="goTo('watch-video')" >
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full"  :class="darkMode?`${$route.name === `watch-video`?`bg-byline`:`bg-button`}`:`${$route.name === `watch-video`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <WatchVideoIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `watch-video`"></WatchVideoIcon>
                            <WatchVideoIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></WatchVideoIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1117')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center z-50" @click="goTo('read-book')" >
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `read-book`?`bg-byline`:`bg-button`}`:`${$route.name === `read-book`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <BookIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `read-book`"></BookIcon>
                            <BookIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></BookIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1118')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="doQuizzess()">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `quizzes`?`bg-byline`:`bg-button`}`:`${$route.name === `quizzes`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <QuizIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `quizzes`"></QuizIcon>
                            <QuizIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></QuizIcon>
                        </div>

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
        methods:{
             goTo(page) {
                this.$router.push({ name: page });
            },
            doQuizzess(){
               this.$router.push({ name: 'quizzes' });
            }
        }
    }
</script>