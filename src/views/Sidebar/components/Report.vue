
<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1115')}}
        </div>
        <div class="px-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('activity')">
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
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('watch-video')" >
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full"  :class="darkMode?`${$route.name === `watch-video` || $route.name === `watch-detail`?`bg-byline`:`bg-button`}`:`${$route.name === `watch-video` || $route.name === `watch-detail`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <WatchVideoIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `watch-video` || $route.name === `watch-detail`"></WatchVideoIcon>
                            <WatchVideoIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></WatchVideoIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1117')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('read-book')" >
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
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('relative')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `relative`?`bg-byline`:`bg-button`}`:`${$route.name === `relative`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <RelativeIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `relative`"></RelativeIcon>
                            <RelativeIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></RelativeIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('relative')}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import ActivityIcon from "./../../../components/ActivityIcon.vue"
    import WatchVideoIcon from "./../../../components/WatchVideoIcon.vue"
    import RelativeIcon from "./../../../components/RelativeIcon.vue"
    import BookIcon from "./../../../components/BookIcon.vue"
    import QuizIcon from "./../../../components/QuizIcon.vue"

    export default{
        components:{
            ActivityIcon,
            WatchVideoIcon,
            BookIcon,
            QuizIcon,
            RelativeIcon
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            ...mapState('auth', ['stProfile'])
        },
        methods:{
            goTo(page) {
                this.$router.push({ name: page, params:{user_id:this.stProfile._id} }).catch((err)=>{err});
            },
        }
    }
</script>