<template>
    <div class="h-screen">
        <eHeader></eHeader>
        <div class="flex mt-5 px-5">
            <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                    <div class="w-36 h-36 rounded-full bg-gray-300"></div>
                </div>
                <div class="w-full bg-red-100 bg-cover h-40" style="background-image:url('cover.jpg');background-repeat:no-repeat;background-position:0px -5px;">
                
                </div>
                <div class="h-36 pt-14" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="text-base pt-5 text-center">Bernd Pfefferberg</div>
                    <div class="text-center">
                        Grade 12
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3 ml-5 w-full">
                <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                            {{$t('location')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <MarkerIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></MarkerIcon>
                            </div>
                            <div class="mt-2">
                                Phnom Penh
                            </div>
                        </div>
                    </div>
                </div>
                <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                            {{$t('2123')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <SchoolIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></SchoolIcon>
                            </div>
                            <div class="mt-2">
                                E-School
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                            {{$t('summary')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <QuizIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></QuizIcon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                           {{$t('1117')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <WatchIcon :fill="darkMode?`#909090`:`#0f3c7a`" :width="50" :height="50"></WatchIcon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                           {{$t('1118')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <BookIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></BookIcon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                    <div class="flex items-center justify-between px-10 py-3">
                        <div>
                           {{$t('attendant')}}
                        </div>
                        <div class="transform -rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                        </div>
                        <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                            <div class="mt-8">
                                <AttendantIcon :fill="darkMode?`#909090`:`#0f3c7a`" :width="50" :height="50"></AttendantIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
import MarkerIcon from "./../../components/MarkerIcon.vue"
import SchoolIcon from "./../../components/SchoolIcon.vue"
import QuizIcon from "./../../components/QuizIcon.vue"
import WatchIcon from "./../../components/YoutubeIcon.vue"
import BookIcon from "./../../components/BookIcon.vue"
import AttendantIcon from "./../../components/AttendantIcon.vue"
import {mapState} from "vuex"
export default {
    components:{
        eHeader,
        ChevronIcon,
        MarkerIcon,
        SchoolIcon,
        QuizIcon,
        WatchIcon,
        BookIcon,
        AttendantIcon
    },

    computed:{
        ...mapState('setting', ['darkMode'])
    }
    

}
</script>