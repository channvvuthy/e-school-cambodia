<template>
    <div class="text-sm" :class="darkMode?`text-gray-400`:``">
        <div>
             <eHeader :title="title"></eHeader>
        </div>
       <div class="mt-5 px-5 h-screen pb-40 overflow-y-scroll" @scroll="onScroll">
           <div v-if="loading">
               <loading></loading>
           </div>
           <div v-else>
               <div v-if="summariesDetail.length == 0" class="h-screen items-center pb-40">
                    <Empty></Empty>
                </div>
                <div v-for="(summary, index) in summariesDetail" :key="index" class="mb-5 max-w-screen-lg rounded-lg shadow-md" :class="darkMode?`bg-secondary`:`bg-white`">
                    <div class="rounded-t-lg h-14 flex items-center justify-start pl-5 text-base" :class="darkMode?`bg-primary text-white`:`bg-dadada`">
                        {{formatDate(summary.date)}}
                    </div>
                    <!-- List -->
                        <div class="px-5 py-9">
                            <div class="flex items-center">
                                <!-- Video -->
                                <template v-if="$route.params.type == 1">
                                    
                                    <div class="rounded-full h-14 w-14 flex items-center justify-center" style="background-color:#f7b616">
                                        <svg height="34" viewBox="-21 -117 682.66672 682" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="#FFF">
                                                <path d="m626.8125 64.035156c-7.375-27.417968-28.992188-49.03125-56.40625-56.414062-50.082031-13.703125-250.414062-13.703125-250.414062-13.703125s-200.324219 0-250.40625 13.183593c-26.886719 7.375-49.03125 29.519532-56.40625 56.933594-13.179688 50.078125-13.179688 153.933594-13.179688 153.933594s0 104.378906 13.179688 153.933594c7.382812 27.414062 28.992187 49.027344 56.410156 56.410156 50.605468 13.707031 250.410156 13.707031 250.410156 13.707031s200.324219 0 250.40625-13.183593c27.417969-7.378907 49.03125-28.992188 56.414062-56.40625 13.175782-50.082032 13.175782-153.933594 13.175782-153.933594s.527344-104.382813-13.183594-154.460938zm-370.601562 249.878906v-191.890624l166.585937 95.945312zm0 0"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <div class="ml-5 text-lg">
                                        {{$t('watch_video')}} {{summary.count}} {{$t('time')}}
                                    </div>      
                                </template>
                                <template v-if="$route.params.type == 2">
                                    <div class="rounded-full h-14 w-14 flex items-center justify-center" style="background-color:#bfca33">
                                       <BookIcon></BookIcon>
                                    </div>
                                    <div class="ml-5 text-lg">
                                        {{$t('read_book')}} {{summary.count}} {{$t('time')}}
                                    </div> 
                                </template>
                                <template v-if="$route.params.type == 3">
                                    <div>
                                         <TestIcon></TestIcon>
                                    </div>
                                    <div class="ml-5 text-lg">
                                        {{$t('read_book')}} {{summary.count}} {{$t('time')}}
                                    </div> 
                                </template>
                            </div>
                            <div v-for="(list, key) in summary.list" :key="key" class="flex justify-start items-center py-5">
                                <div class="w-32" :class="darkMode?``:`text-primary`">
                                    <div class="flex items-center">
                                        <div class="mr-2"><ClockIcon :size="20" :fill="darkMode?`#909090`:`#0f3c7a`"></ClockIcon></div>
                                        <div>{{formatTime(list.time)}}</div>
                                    </div>
                                </div>
                                <div>
                                    : {{list.title}}
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
import {mapState,mapActions} from "vuex"
import ClockIcon from "./../../components/ClockIcon.vue"
import YoutubeIcon from "./../../components/YoutubeIcon.vue"
import TestIcon from "./components/TestIcon.vue"
import moment from "moment"
import Loading from "./../../components/Loading.vue"
import BookIcon from "./components/BookIcon.vue"
import Empty from "./../Component/Empty.vue"

export default {
    components:{
        eHeader,
        ClockIcon,
        YoutubeIcon,
        Loading,
        BookIcon,
        TestIcon,
        Empty
    },
    data(){
        return{
            enableScroll: true,
            page: 1,
            title: "",
        }
    },
    computed:{
        ...mapState('summary', ['summariesDetail','loading']),
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('summary', ['getSummaryDetail', 'getSummaryDetailPagination']),
        getReportDetail(){
            let payload = {}
            payload.id = this.$route.params.user_id
            payload.filter = this.$route.params.filter
            payload.type = this.$route.params.type
            this.getSummaryDetail(payload)
        },
        formatDate(date){
            moment.locale("en")
            if(this.$i18n.locale =='en'){
                return "Date " +  moment(date).format('DD-MM-YYYY');
            }
            return "ថ្ងៃទី " + moment(date).format('DD') + " ខែ "+moment(date).format('MM')+" ឆ្នាំ "+moment(date).format('YYYY');
        },
        formatTime(date){
            moment.locale(this.$i18n.locale === 'en'?`en`:`km`);
            return moment(date).format('h:mm A');
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                this.page ++ 

                let payload = {}
                payload.id = this.$route.params.user_id
                payload.filter = this.$route.params.filter
                payload.type = this.$route.params.type
                payload.p = this.page

                if(this.enableScroll){
                    this.getSummaryDetailPagination(payload).then(res =>{
                        if(res.data.data.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
    },
    created(){
        this.getReportDetail()
        if(this.$route.params.type == 1){
            this.title = 'video_summary'
        }
        if(this.$route.params.type == 2){
            this.title = 'read_book_summary'
        }
        if(this.$route.params.type == 3){
            this.title = 'quiz_summary'
        }
    }
}
</script>