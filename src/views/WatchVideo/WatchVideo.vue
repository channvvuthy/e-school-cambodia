<template>
    <div>
        <eHeader></eHeader>
        <div class="mt-5">
            <BoxFilter @enableUserScroll="enableUserScroll($event)"></BoxFilter>
        </div>
        <div class="px-5 overflow-y-scroll pb-40 h-screen mt-5">
            <div class="grid md:grid-cols-3 2xl:grid-cols-4 gap-5">
                <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow-md`" class="rounded-xl p-5 flex items-center justify-center flex-col cursor-pointer" v-for="i in 13" :key="i">
                <div class="progressVideo">
                        <div class="progressVideo">
                            <div class="relative z-50 relative flex justify-between" style="top:120px;">
                                <div class="text-xs -ml-1" :class="darkMode?`text-gray-400`:`text-gray-500`">0%</div>
                                <div class="text-xs -mr-3" :class="darkMode?`text-gray-400`:`text-gray-500`">100%</div>
                            </div>
                            <div class="barOverflowVideo">
                                <div class="barVideo"></div>
                            </div>
                            <span class="text-3xl font-black relative -top-5">100%</span>
                        </div>
                    </div>
                    <div class="w-full h-1 border-t border-gray-400 mt-5 border-dashed"> </div>
                    <div class="font-semibold flex justify-start mt-4 w-full text-left text-base" :class="darkMode?`text-gray-400`:`text-primary`">គណិតវិទ្យា</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "./../Activity/components/eHeader.vue"
import Loading from "./../../components/Loading.vue"
import BoxFilter from "./../Video/components/Filter.vue"
import {mapActions, mapState} from "vuex"
export default {
    components:{
        eHeader,
        Loading,
        BoxFilter
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile'])
    },
    data(){
        return{
            loading: false,
        }
    },
    methods:{
        ...mapActions('summary', ['getSummaryDetail']),
        enableUserScroll(){

        }
    },
    created(){

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
        transform: rotate(135deg);
    }
</style>