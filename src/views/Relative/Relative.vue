<template>
    <div class="h-screen">
        <eHeader :isRoute="false" @exit="exit"></eHeader>
        <template v-if="showDetail">
            <div class="flex mt-5 px-5">
                <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                    <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                        <div class="w-32 h-32 rounded-full bg-gray-300 bg-cover" :style="{backgroundImage:`url(${relative.photo})`}"></div>
                    </div>
                    <div class="w-full bg-red-100 bg-cover h-40" style="background-image:url('cover.jpg');background-repeat:no-repeat;background-position:0px -5px;">
                    
                    </div>
                    <div class="h-36 pt-14" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="text-base pt-5 text-center font-bold" :class="darkMode?``:`text-primary`">
                            {{relative.name}}
                        </div>
                        <div class="text-center" v-if="relative.grade">
                            {{relative.grade}}
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
                                    {{relative.province}}
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
                                    {{relative.school}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('activity', relative._id)">
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
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('watch-video', relative._id)">
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
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('read-book', relative._id)">
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
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('attendant', relative._id)">
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
        </template>
        <template v-else>
            <div class="mt-5 px-5">
                <div v-if="loading">
                    <Loading></Loading>
                </div>
                <div v-else>
                    <div v-if="relatives.length == 0" class="h-screen items-center pb-40">
                        <Empty></Empty>
                    </div>
                    <div class="grid md:grid-cols-2 2xl:grid-cols-3">
                        <div v-for="(relative, index) in relatives" :key="index" :class="darkMode?`bg-secondary`:`bg-white`" class="rounded-xl e-shadow p-5 flex items-center cursor-pointer" @click="relativeDetail(relative)">
                            <div class="w-24 h-24 rounded-full bg-gray-300 bg-cover" :style="{backgroundImage:`url(${relative.photo})`}"></div>
                            <div class="h-24 w-1 border-l mx-3 border-dashed" :class="darkMode?`border-button`:`border-gray-400`">
                            </div>
                            <div class="flex-1">
                                <div class="font-bold text-base" :class="darkMode?`text-gray-300`:`text-primary`">
                                    {{relative.name}}
                                </div>
                                <div class="text-sm mt-2" :class="darkMode?`text-gray-400`:`text-gray-500`">
                                    {{relative.school}}
                                </div>
                                <div class="text-sm mt-2" :class="darkMode?`text-gray-400`:`text-gray-500`">
                                    {{relative.province}}
                                </div>
                            </div>
                            <div class="transform -rotate-90">
                                <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
import Loading from "./../../components/Loading.vue"
import Empty from "./../Component/Empty.vue"
import {mapState, mapActions} from "vuex"
export default {
    components:{
        eHeader,
        ChevronIcon,
        MarkerIcon,
        SchoolIcon,
        QuizIcon,
        WatchIcon,
        BookIcon,
        AttendantIcon,
        Loading,
        Empty
    },
    data(){
        return{
            relatives: [],
            relative:{},
            loading: false,
            showDetail: false,
            
        }
    },

    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('auth', ['getRelative']),
        relativeDetail(relative){
            this.showDetail = true
            this.relative = relative
        },
        exit(){
            this.showDetail = false
        },
        reportDetail(page,user_id){
            this.$router.push({name: page, params:{user_id}})
        }
    },
    created(){
        this.loading = true
        this.getRelative().then(response => {
            this.relatives= response.data.data
            this.loading = false
        })
    }
    

}
</script>