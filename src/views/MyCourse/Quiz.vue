<template>
    <div>
        <eHeader :title="$route.params.course.title" :isExam="true" @exit="exit"></eHeader>
        <div class="flex justify-center h-screen" :class="darkMode?`bg-youtube text-gray-300 p-5 ${isExam?``:`items-center`}`:`bg-white m-5 shadow ${isExam?``:`items-center`}`">
            <!-- Note -->
            <div class="rounded-2xl px-10 py-5" :class="darkMode?`bg-secondary text-gray-300 shadow`:`bg-white shadow-md border-t border-gray-100`" v-if="!isExam">
                <div class="text-base font-semibold mb-7">{{$t('2116')}}</div>
                <div class="mb-5 text-sm flex justify-between items-center">
                    <div>{{$t('2118')}} {{$t('colon')}}</div>
                    <div>{{certificatesQuiz.total}} {{$t('2115')}}</div>
                </div>
                <div class="flex mb-5 text-sm justify-between flex justify-between items-center">
                    <div>{{$t('2119')}} {{$t('colon')}}</div>
                    <div>{{certificatesQuiz.duration}}​ {{$t('minute')}}</div>

                </div>
                <div class="flex text-sm justify-between flex justify-between items-center">
                    <div>{{$t('2120')}} {{$t('colon')}}</div>
                    <div>{{certificatesQuiz.pass_point}}/{{certificatesQuiz.total}}</div>
                </div>
                <div class="mt-7">
                    <button  class="focus:outline-none text-white rounded-md px-6 py-3 text-sm​​ w-full" :class="darkMode?`bg-black`:`bg-primary shadow-2xl`" @click="startExam()">
                        {{$t('2121')}}
                    </button>
                </div>
            </div>
            <!--  -->
            <!-- Box exam -->
            <div v-else class="overflow-y-scroll h-full pb-40">
                <div class="text-base w-96 m-auto flex flex-col justify-center items-center">
                    <div class="mb-5">
                        {{$t('2116')}}
                    </div>
                    <div class="flex items-center justify-center font-semibold">
                        <div class="relative" style="top:-2px;">
                            <LoadingTimeIcon :fill="darkMode?`#E5E7EB`:`#000000`" :size="16"></LoadingTimeIcon>
                        </div>
                        <div class="ml-5 text-sm">
                            <span ref="hour" id="hour">{{hour}}</span>
                            <span>:</span>
                            <span ref="min" id="min">{{min}}</span>
                            <span>:</span>
                            <span ref="sec" id="sec">{{sec}}</span>
                            {{$t('minute')}}
                        </div>
                    </div>
                </div>
                <!-- Quiz -->
                <div class="text-sm mt-10">
                    <div v-for="(quizzes, index) in certificatesQuiz.list" :key="index" :class="order != index?`hidden`:``">
                        <div :class="darkMode?`bg-secondary`:`bg-gray-50`" class="shadow rounded-md py-5 px-10 rgba flex-col overflow-y-scroll my-scroll max-w-xl">
                            <math xmlns = "http://www.w3.org/1998/Math/MathML">
                            <!-- {{}} -->
                                <katex-element :expression="toLatex(quizzes.title)" />
                            </math>
                            <div class="mt-8">
                                <div v-for="(list,key) in quizzes.check_list" :key="key">
                                    <label class="flex items-center relative">
                                        <div class="relative">
                                            <input type="checkbox" class="mr-5 hidden" @change="selectAnswer($event,quizzes,list)">
                                            <div class="h-5 w-5 rounded border mr-5 relative" :class="darkMode?`border-`:`border-gray-400`"></div>
                                        </div>
                                        <div>
                                            <katex-element :expression="toLatex(list.value)"/>
                                              <!-- <span class="bg-red-400 absolute top-0 "> {{toLatex(list.value)}}</span> -->

                                        </div>
                                    </label>
                                    
                                </div>
                            </div>
                            <div></div>
                        </div>
                        
                    </div>
                </div>
                <!--  -->

                <!-- Next & Previous -->
                <div class="flex justify-between items-center mt-5 text-sm">
                    <div :class="isPrevious?``:`invisible`">
                        <button class="focus:outline-none rounded px-5 py-1 flex items-center" :class="darkMode?`bg-button`:`bg-gray-400 text-white shadow`" @click="previous">
                            <div class="transform rotate-90 relative -left-1"><ChevronIcon fill="#fff" :size="18"></ChevronIcon></div>
                            <div>{{$t('2126')}}</div>
                        </button>
                    </div>
                    <div>{{order + 1}}/{{certificatesQuiz.total}}</div>
                    <div :class="isNext?``:`invisible`">
                        <button class="focus:outline-none rounded px-5 py-1 flex items-center" :class="darkMode?`bg-button`:`bg-primary text-white`" @click="next">
                            <div>{{$t('2125')}}</div>
                            <div class="transform -rotate-90 relative -right-1"><ChevronIcon fill="#fff" :size="18"></ChevronIcon></div>
                        </button>
                    </div>
                </div>
                <!--  -->

                <!-- Finish -->
                <div v-if="!isNext || isLastQuestion">
                    <button class="focus:outline-none w-full relative text-white mt-5 rounded-md py-2 h-10" :class="darkMode?`bg-button`:`bg-primary`" :disabled="checkingResult" @click="submit">
                        <div class="absolute w-full flex justify-center items-center -top-2" v-if="checkingResult">
                            <div class="loader"></div>
                        </div>
                        <span v-else>{{$t('2127')}}</span>
                    </button>
                </div>
                <!--  -->
            </div>
            <!--  -->
        </div>
        <input type="hidden" id="course" :value="$route.params.course._id">
        <FailExam v-if="fail" :result="result" @exit="exit" @checkResult="checkResult"></FailExam>
        <PassExam v-if="pass" :result="result" @exit="exit" @checkResult="checkResult"></PassExam>
        <ViewExam :quiz="certificatesQuiz" :result="result" v-if="showResult" :selectedQuiz="selectedQuiz" @exit="exit"></ViewExam>



    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import toHHMMSS from "./../../helper/toHHMMSS"
import helper from "./../../helper/helper"
import {mapState, mapActions} from "vuex"
import LoadingTimeIcon from "./../../components/LoadingTimeIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
import FailExam from "./../Video/components/FailExam.vue"
import PassExam from "./../Video/components/PassExam.vue"
import ViewExam from "./../Video/components/ViewExam.vue"


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
    data(){
        return{
            isExam: false,
            duration: 0,
            hour: "00",
            min: "00",
            sec: "",
            isStart: false,
            checkingResult: false,
            isNext: true,
            isPrevious: false,
            isLastQuestion: false,
            selectedQuiz: [],
            showResult: false,
            order: 0,
            fail: false,
            pass: false,
            result: {},
            quizzes: {
                course_id: "",
                duration: 0,
                quiz: []
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('quiz', ['certificatesQuiz'])
    },
    components:{
        eHeader,
        LoadingTimeIcon,
        ChevronIcon,
        FailExam,
        PassExam,
        ViewExam
    },
    created(){
         this.$store.commit('setting/toggleSidebar', false)
    },
    mounted(){
        this.seconds = Math.round(this.certificatesQuiz.duration) * 60
        this.startingCount = setInterval(()=>{
            this.seconds--
            this.duration++
            this.setTimer();

            if(this.seconds == 0){
                clearInterval(this.startingCount)
                this.submit()
            }
            
        },1000)

        this.isStart = true
    },
    methods:{
        ...mapActions('quiz', ['submitQuizCertificate']),
        checkResult(){
            this.showResult = true
        },
        next(){
            this.isPrevious = true

            if(this.order  < this.certificatesQuiz.total){
                this.order++
                if(this.order + 1 === this.certificatesQuiz.total){
                    this.isNext = false
                    this.isLastQuestion = true
                }
            }else{
                this.isNext = false
                this.isLastQuestion = true
            }
        },
        previous(){
            this.isNext = true
            if(this.order){
                this.order--
            } 
            if(this.order <= 0){
                this.isPrevious = false
            }
        },
        selectAnswer(event,quizzes,list){
            var course_id = document.getElementById("course").value
            this.quizzes.id = course_id
            this.quizzes.duration = this.duration / 60
            let quiz = {
                id: quizzes._id,
                answer: list._id
            }
            if(event.target.checked){
                this.selectedQuiz.push(quiz)
                event.target.nextSibling.className+= " active-checkbox"

            }else{
                this.selectedQuiz = this.selectedQuiz.filter(item => item.answer !== quiz.answer)
                event.target.nextSibling.classList.remove("active-checkbox");
            }
            
            this.quizzes.quiz = this.selectedQuiz
        },
        toLatex(str){
            var str = str.toString()
            return str.replace(/\[math]/g,"").replace(/\[\/math]/g,"").replace(/&nbsp;/g,"").replace("។","")
            .replace(/lorx/,'lor x').replace(/intx/,'int x').replace('timesf','times f').replace(/{\\begin{matrix}/,"(\\begin{matrix}").replace(/\\end{matrix}\\right/g,"\\end{matrix}\\right)")
            .replace(/\\pitk/g,"\\pi\\text{tk}")

        },
        setTimer(){
            let seconds = this.seconds
            seconds = seconds.toString()
            let times = toHHMMSS.toHHMMSS(seconds);
            this.hour = times.hours
            this.min = times.minutes
            this.sec = times.seconds
        },
        submit(){
            this.checkingResult = true    
            this.submitQuizCertificate(this.quizzes).then(response =>{
                this.checkingResult = false
                this.checkingResult = false    

                if(response.data.status === 1){

                    helper.errorMessage(response.data.msg)
                }else{
                    if(response.data.data.is_pass){
                        this.pass = true
                    }else{
                        this.fail = true
                    }
                    this.result = response.data.data
                }
                clearInterval(this.startingCount)
            })
        },
        exit(){
           this.$router.push({ name: 'video-detail', params: { course: this.$route.params.course } })
        },
        startExam(){
            this.isExam = true
        }
    }
    
}
</script>