<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{ $t('1115') }}
        </div>
        <div class="px-3 mt-7">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('activity')">
                    <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
                         :class="activeClass('activity activity-detail')">
                        <div>
                            <ActivityIcon
                                    fill="#FFFFFF"
                                    :size="24"
                                    v-if="$route.name === `activity` || $route.name === `activity-detail`"/>
                            <ActivityIcon
                                    :fill="darkMode?`#FFFFFF`:`#4A4A4A`" :size="24"
                                    v-else/>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{ $t('summary') }}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('watch-video')">
                    <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
                         :class="activeClass('watch-video watch-detail')">
                        <div>
                            <WatchVideoIcon
                                    fill="#FFFFFF"
                                    v-if="$route.name === `watch-video` || $route.name === `watch-detail`"/>
                            <WatchVideoIcon
                                    :fill="darkMode?`#FFFFFF`:`#4A4A4A`"
                                    v-else/>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{ $t('1117') }}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('read-book')">
                    <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
                         :class="activeClass('read-book')">
                        <div>
                            <BookIcon
                                    fill="#FFFFFF"
                                    :size="24"
                                    v-if="$route.name === `read-book`"/>
                            <BookIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else/>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{ $t('1118') }}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('relative')">
                    <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
                         :class="activeClass('relative')">
                        <div>
                            <RelativeIcon
                                    fill="#FFFFFF"
                                    :size="24"
                                    v-if="$route.name === `relative`"/>
                            <RelativeIcon
                                    :fill="darkMode?`#FFFFFF`:`#4A4A4A`"
                                    v-else/>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{ $t('relative') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import ActivityIcon from "./../../../components/ActivityIcon.vue"
    import RelativeIcon from "./../../../components/RelativeIcon.vue"
    import BookIcon from "./../../../components/BookIcon.vue"
    import QuizIcon from "./../../../components/QuizIcon.vue"
    import WatchVideoIcon from "./../../../components/WatchVideoIcon.vue"

    export default {
        components: {
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
        methods: {
            goTo(page) {
                this.$router.push({name: page, params: {user_id: this.stProfile._id}}).catch((err) => {
                    err
                });
            },
            activeClass(currentRoute) {
                let arr = currentRoute.split(' ')
                for (let i = 0; i < arr.length; i++) {
                    if (this.$route.name === arr[i]) {
                        if (this.darkMode) {
                            return "bg-button"
                        }
                        return "bg-primary"
                    }
                }
                if (this.darkMode) {
                    return "border border-roundBorder"
                }
                return "border border-roundBorder"
            }
        }
    }
</script>