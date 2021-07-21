<template>
    <div>
        <div class="mb-5">
            <eHeader></eHeader>
        </div>
        <div class="overflow-y-scroll pb-40 h-screen"  @scroll="onScroll">
            <div>
                <BoxFilter @enableUserScroll="enableUserScroll($event)" @closeFilter="closeFilter($event)" :filter_id="filter_id"></BoxFilter>
            </div>
            <div class="px-5 mt-5">
                <div v-if="loading">
                    <Loading></Loading>
                </div>
                <div class="grid md:grid-cols-3 2xl:grid-cols-4 gap-5" v-else>
                    <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow-md`" class="rounded-xl p-5 flex items-center justify-center flex-col cursor-pointer" v-for="(list, index) in course.list" :key="index">
                    <div class="progressVideo">
                            <div class="progressVideo">
                                <div class="relative z-50 relative flex justify-between" style="top:120px;">
                                    <div class="text-xs -ml-1" :class="darkMode?`text-gray-400`:`text-gray-500`">0%</div>
                                    <div class="text-xs -mr-3" :class="darkMode?`text-gray-400`:`text-gray-500`">100%</div>
                                </div>
                                <div class="barOverflowVideo">
                                    <div class="barVideo" :style="{transform:`rotate(${45+(Math.round(list.percentage)*1.8)}deg)`}"></div>
                                </div>
                                <span class="text-3xl font-black relative -top-5">
                                    {{Math.round(list.percentage)}}%
                                </span>
                            </div>
                        </div>
                        <div class="w-full h-1 border-t border-gray-400 mt-5 border-dashed"> </div>
                        <div class="font-semibold flex justify-start mt-4 w-full text-left text-base" :class="darkMode?`text-gray-400`:`text-primary`">
                            {{list.title}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "./../Activity/components/eHeader.vue"
import Loading from "./../../components/Loading.vue"
import BoxFilter from "../Component/BoxFilter.vue"
import {mapActions, mapState} from "vuex"
export default {
    components:{
        eHeader,
        Loading,
        BoxFilter
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('summary', ['loading', 'course'])
    },
    data(){
        return{
            page: 1 ,
            enableScroll: true,
            filter_id: ""
        }
    },
    methods:{
        ...mapActions('summary', ['getSummaryDetail', 'getCourse', 'getCoursePagination']),
        enableUserScroll(){

        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                this.page ++ 
                let payload = {}
                payload.p = this.page
                payload.id = this.stProfile._id
                payload.type = 1

                if(this.enableScroll){
                    this.getCoursePagination(payload).then(res =>{
                        if(res.data.data.list.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
        getCourses(){
            let payload = {}
            payload.id = this.stProfile._id
            payload.type = 1

            if(this.filter_id){
                payload.filter_id = this.filter_id
            }

            this.getCourse(payload).then(response =>{
                this.$store.commit("home/receiveList", response.data.data)
            })
        },
        closeFilter(event){
            if(event=== 'all'){
                this.filter_id = ``
            }else{
                this.filter_id = event._id
            }
            this.getCourses()
        }
    },
    created(){
        this.getCourses()
    }
}
</script>
<style>
   .progressVideo{
        position: relative;
        margin: 4px;
        float:left;
        text-align: center;
    }
    .barOverflowVideo{ /* Wraps the rotating .bar */
        position: relative;
        width: 200px; height: 100px; /* Half circle (overflow) */
        margin-bottom: -14px; /* bring the numbers up */
        overflow: hidden;
    }
    .barVideo{
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 10px solid #c9c9c9;
        border-bottom-color: #f7b616;
        border-right-color: #f7b616;
    }
</style>