<template>
    <div class="absolute left-0 top-0 w-full h-full z-50 pt-10 px-10" :class="darkMode?`bg-youtube text-gray-300`:`bg-white text-black`">
        <div class="w-full flex justify-center item-center text-base font-semibold">
            {{$t('2128')}}
        </div>
        <div class="h-screen overflow-y-scroll pb-72 mt-10">
            <div class="grid grid-cols-3 gap-10 text-sm">
                <div v-for="(quizzes, index) in quiz.list" :key="index">
                    <div :class="darkMode?`bg-secondary shadow-md`:`bg-gray-50`" class="rounded-xl shadow-md p-5 my-scroll view overflow-x-scroll" :style="minHeight?{minHeight:`${minHeight}px`}:``">
                        <div class="flex mb-5 items-center">
                            <span>{{index + 1}}.</span>
                            <div v-for="(content, index) in quizzes.content" :key="index">
                                <template v-if="content.type === 1">
                                    <katex-element :expression="toLatex(content.value)" />
                                </template>
                                <template v-else>
                                    <img :src="content.value" class="max-w-lg">
                                </template>
                            </div>
                        </div>
                        <div v-for="(list,key) in quizzes.check_list" :key="key">
                            <div class="inline-flex items-center mb-5 relative" :class="correctAnswer(list._id)?`text-pass`:answer(list._id)?`delete`:``">
                                <div class="h-5 w-5 rounded border mr-5 relative" :class="correctAnswer(list._id)?`active-checkbox border-pass`:answer(list._id)?`incorrect`:``"></div>
                                <template v-if="list.type === 1">
                                    <katex-element :expression="toLatex(list.value)"/>
                                </template>
                                <template v-else>
                                    <img :src="list.value" class="max-w-lg">
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-auto flex justify-center mt-10">
                <button class="focus:outline-none px-40 py-2 rounded-md" :class="darkMode?`bg-button text-gray-300`:`bg-primary text-white`" @click="exit">
                    {{$t('2132')}}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"
import Vue from 'vue';
import VueKatex from 'vue-katex';
import 'katex/dist/katex.min.css';
Vue.use(VueKatex, {
  globalOptions: {
    displayMode: true,
    output: 'html'
  }
});
export default {
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    props:{
        quiz:{
            default:() =>{
                return []
            }
        },
        result:{
            default:() =>{
                return {}
            }
        },
        selectedQuiz:{
            default: () =>{
                return []
            }
        }
    },
    data(){
        return{
            minHeight: 0,
        }
    },
    methods:{
        correctAnswer(id){
            for(let i = 0; i < this.result.detail.length; i++){
                if(this.result.detail[i].answer === id){
                    return true
                }
            }
            return false
        },
        toLatex(str){
            var str = str.toString()
            return str.replace(/\[math]/g,"").replace(/\[\/math]/g,"").replace(/&nbsp;/g,"").replace("។","")
            .replace(/ℜ/g,"\\Re").replace(/\\left{/,"\\left\\{").replace(/\\right}/,"\\right\\}")
            .replace(/lorx/,'lor x').replace(/intx/,'int x').replace('timesf','times f')
            .replace(/{\\begin{matrix}/,"(\\begin{matrix}").replace(/\\end{matrix}\\right/g,"\\end{matrix}\\right)")
            .replace(/\\pitk/g,"{\\pi}tk").replace(/&ne;/g,"\\neq").replace(/&plusmn;/g,"\\pm")
            .replace(/&times;/,"\\times").replace(/&alpha;/g,"\\alpha").replace(/&beta;/g,"\\beta")

        },

        answer(id){
            for(let i = 0; i < this.selectedQuiz.length; i++){
                if(this.selectedQuiz[i].answer === id){
                    return true
                }
            }
            return false
        },
        
        exit(){
            this.$emit("exit")
        }
    },
    created(){
        let arr = []
        let interval = setInterval(() => {
            let box = document.getElementsByClassName('view')
            if (box) {
                clearInterval(interval)
                for(let i = 0; i < box.length; i++){
                    arr.push(box[i].offsetHeight)
                }
                this.minHeight = Math.max(...arr)
            }
        }, 100)
    }
}
</script>
<style>
.incorrect::before{
    content: "✓";
    position: absolute;
    font-weight: bold;
    left:0;
    margin-left: 2.5px;
}
.delete::before{
    position: absolute;
    content: "";
    width: 100%;
    height: 1px;
    border-top:1px solid #c0272d;
    left:0;
    z-index: 100;

}
 /* .katex-display>.katex {
    white-space: normal !important;
} */
.my-scroll::-webkit-scrollbar {
    height: 0px;              /* width of the entire scrollbar */
}

/* .my-scroll::-webkit-scrollbar-track {
  background: orange;      
  height: 1px;
}

.my-scroll::-webkit-scrollbar-thumb {
    height: 1px;
  background-color: blue;    
  border-radius: 20px;       
  border: 3px solid orange;  
} */
</style>