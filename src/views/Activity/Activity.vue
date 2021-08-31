<template>
    <div>
        <div class="h-screen pb-40 overflow-y-scroll">
            <div class="flex items-center my-5 px-5 h-32 text-sm" :class="darkMode?`bg-secondary text-white`:`bg-white`">
            <button class="flex flex-col items-center justify-center h-12  mr-5  focus:outline-none text-center " @click="filterSummary('this_month')">
                <div class="mb-5 flex items-center justify-center w-14 h-14 rounded-full" :class="activeClass('this_month')">
                    <CalendarIcon :size="30" :fill="colorIcon('this_month', '#0f3c7a')"></CalendarIcon>
                </div>
                <div :class="darkMode?`${active === `this_month`?`text-fb`:``}`:`${active === `this_month`?`text-primary`:``}`">
                    {{$t('this_month')}}
                </div>
                <BorderBottom :class="darkMode?`bg-fb relative top-3`:`bg-primary relative top-3`" v-if="active === `this_month`"></BorderBottom>
                 
            </button>
            <button class="flex flex-col items-center justify-center h-12  mr-5  focus:outline-none text-center " @click="filterSummary('last_month')">
                 <div class="mb-5 flex items-center justify-center w-14 h-14 rounded-full" :class="activeClass('last_month')">
                    <CalendarIcon :size="30" :fill="colorIcon('last_month', '#f7b616')"></CalendarIcon>
                </div>
                <div :class="darkMode?`${active === `last_month`?`text-fb`:``}`:`${active === `last_month`?`text-primary`:``}`">
                    {{$t('last_month')}}
                </div>
                <BorderBottom :class="darkMode?`bg-fb relative top-3`:`bg-primary relative top-3`" v-if="active === `last_month`"></BorderBottom>
            </button>
             <button class="flex flex-col items-center justify-center h-12  mr-5  focus:outline-none text-center " @click="filterSummary('last_3_month')">
                <div class="mb-5 flex items-center justify-center w-14 h-14 rounded-full" :class="activeClass('last_3_month')">
                    <CalendarIcon :size="30" :fill="colorIcon('last_3_month', '#189faf')"></CalendarIcon>
                </div>
                <div :class="darkMode?`${active === `last_3_month`?`text-fb`:``}`:`${active === `last_3_month`?`text-primary`:``}`">
                     {{$t('last_3_month')}}
                </div>
                <BorderBottom :class="darkMode?`bg-fb relative top-3`:`bg-primary relative top-3`" v-if="active === `last_3_month`"></BorderBottom>
            </button>
             <button class="flex flex-col items-center justify-center h-12  mr-5  focus:outline-none text-center " @click="filterSummary('last_6_month')">
                 <div class="mb-5 flex items-center justify-center w-14 h-14 rounded-full" :class="activeClass('last_6_month')">
                    <CalendarIcon :size="30" :fill="colorIcon('last_6_month', '#c95a5c')"></CalendarIcon>
                </div>
                <div :class="darkMode?`${active === `last_6_month`?`text-fb`:``}`:`${active === `last_6_month`?`text-primary`:``}`">
                     {{$t('last_6_month')}}
                </div>
                <BorderBottom :class="darkMode?`bg-fb relative top-3`:`bg-primary relative top-3`" v-if="active === `last_6_month`"></BorderBottom>
            </button>
            <button class="flex flex-col items-center justify-center h-12  mr-5  focus:outline-none text-center " @click="filterSummary('this_year')">
                <div class="mb-5 flex items-center justify-center w-14 h-14 rounded-full" :class="activeClass('this_year')">
                    <CalendarIcon :size="30" :fill="colorIcon('this_year', '#759F4B')"></CalendarIcon>
                </div>
                <div :class="darkMode?`${active === `this_year`?`text-fb`:``}`:`${active === `this_year`?`text-primary`:``}`">
                    {{$t('this_year')}}
                </div>
                <BorderBottom :class="darkMode?`bg-fb relative top-3`:`bg-primary relative top-3`" v-if="active === `this_year`"></BorderBottom>
            </button>
            </div>
            <div class="m-5 rounded-lg e-shadow w-3/4 py-10" :class="darkMode?`bg-secondary`:`bg-white`">
                <div v-if="loading" class="px-5">
                    <Loading></Loading>
                </div>
                <div class="text-center" v-else>
                    <div class="font-bold text-3xl" :class="darkMode?`text-white`:`text-primary`">
                        {{$t('study_graph')}}
                    </div>
                    <div class="flex w-2/3 m-auto mt-10">
                        <div class="grid grid-cols-3 gap-10 w-full text-lg text-white">
                            <div style="background-color:#f7b616" class="rounded-xl py-7 shadow cursor-pointer" @click="summaryDetail('activity-detail',1,active)">
                                <div class="text-5xl font-black mb-5">
                                    {{summaries.watch_video}}
                                </div>
                                <div>
                                    {{$t('1117')}}
                                </div>
                            </div>
                            <div style="background-color:#bfca33" class="rounded-xl py-7 shadow cursor-pointer" @click="summaryDetail('activity-detail',2,active)">
                                <div class="text-5xl font-black mb-5">
                                    {{summaries.read_book}}
                                </div>
                                <div>
                                    {{$t('1118')}}
                                </div>
                            </div>
                            <div style="background-color:#189faf" class="rounded-xl py-7 shadow cursor-pointer" @click="summaryDetail('activity-detail',3,active)">
                                <div class="text-5xl font-black mb-5">
                                    {{summaries.do_quiz}}
                                </div>
                                <div>
                                    {{$t('1119')}}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-7 flex items-center justify-center overflow-x-hidden" v-if="(summaries.watch_video || summaries.read_book || summaries.do_quiz)" :class="darkMode?`text-white`:``">
                        <div>
                            <fusioncharts
                                :type="type"
                                :width="width"
                                :height="height"
                                :dataFormat="dataFormat"
                                :dataSource="dataSource" 
                                ref="fc"
                            >
                            </fusioncharts>
                        </div>
                    </div>
        
                </div>
            </div>     
        </div>
    </div>
</template>
<script>
import eHeader from "./components/eHeader.vue"
import {mapState,mapActions} from "vuex"
import CalendarIcon from "./../../components/CalendarIcon.vue"
import BorderBottom from "./../../components/BorderBottom.vue"
// import Vue from "vue"
// import VueApexCharts from 'vue-apexcharts'
// Vue.use(VueApexCharts)
import Loading from "./../../components/Loading.vue"
// Include Dependencies
import Vue from 'vue';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

export default {
    components:{
        eHeader,
        CalendarIcon,
        BorderBottom,
        Loading
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('summary', ['summaries'])
    },
    data(){
        return{
            active: "this_month",
            loading:false,
            type: "doughnut2d",
            width: "50%",
            height: "50%",
            dataFormat: "json",
            dataSource:{
                chart: {
                    lineThickness : "2",
                    showpercentvalues: "1",
                    aligncaptionwithcanvas: "0",
                    captionpadding: "0",
                    decimals: "1",
                    theme: "fusion",  
                },
                data: [
                        {
                            label: `${this.$i18n.t('1117')}`,
                            value: "1000",
                            color:"#f7b616"
                        },
                        {
                            label: `${this.$i18n.t('1118')}`,
                            value: "5300",
                            color:"#bfca33"
                        },
                        {
                            label: `${this.$i18n.t('1119')}`,
                            value: "10500",
                            color:"#189faf"
                        },
                ],
            }
        }
    },
    methods:{
        ...mapActions('summary', ['getSummary']), 
        filterSummary(filter){
            this.active = filter
            let payload = {}
            payload.id = this.$route.params.user_id
            payload.filter = filter
            this.loading = true
            this.getSummary(payload).then(response => {
                this.dataSource.data[0].value = response.data.data.watch_video
                this.dataSource.data[1].value = response.data.data.read_book
                this.dataSource.data[2].value = response.data.data.do_quiz
                this.loading = false
            })
        },
        colorIcon(active, color = ""){
            if(this.darkMode){
                if(this.active === active){
                    return "#fff"
                }else{
                    return color
                }
            }else{
                if(this.active === active){
                    return "#fff"
                }else{
                    return color
                }
            }
        },
        activeClass(active){
            if(this.darkMode){
                if(this.active === active){
                    return "bg-primary"
                }else{
                    return "bg-softGray text-gray-300"
                }
            }else{
                 if(this.active === active){
                    return "bg-primary"
                }else{
                    return "bg-gray-300 text-gray-300"
                }
            }
        },
        summaryDetail(name,type,filter){
            let user_id = this.$route.params.user_id
            this.$router.push({name,params:{user_id, type, filter}})
        },
    },
    created(){
        this.loading = true
        this.getSummary({
            filter:"this_month",
            id: this.$route.params.user_id
        }).then(response => {
           
            this.dataSource.data[0].value = response.data.data.watch_video
            this.dataSource.data[1].value = response.data.data.read_book
            this.dataSource.data[2].value = response.data.data.do_quiz
            this.loading = false
        })
        let body = document.getElementById("body")
        if(this.darkMode){
            body.classList.add("dark")
        }else{
            body.classList.remove('dark')
        }
        
        
    },
    watch:{
        'darkMode': (darkMode)=>{
            let body = document.getElementById("body")
            if(darkMode){
                body.classList.add("dark")
            }else{
                body.classList.remove('dark')
            }
        }
    }
}
</script>
<style>
    div[id^='fc-'] > span > svg > defs + g + g > g{
            display:none !important;
    }
    div[id^='fc-'] > span > svg > defs + g > g:nth-child(26) {
        display:none !important;
    }
    .dark rect {
        fill:#212121;
    }
    .dark text{
       fill:#ffffff;
    }


</style>