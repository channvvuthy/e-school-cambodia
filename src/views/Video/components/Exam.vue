<template>
    <div>
        <div class="absolute left-0 top-0 w-full h-full z-50 pt-10" :class="darkMode?`bg-youtube text-gray-300`:`bg-white text-black`">
            <div class="text-center bg-transparent">
                <div class="text-base max-w-md m-auto">
                    <div class="mb-5">
                        {{$t('2121')}}
                    </div>
                    <div class="flex items-center justify-center font-semibold">
                        <div class="relative" style="top:-2px;"><LoadingTimeIcon :fill="darkMode?`#E5E7EB`:`#000000`" :size="16"></LoadingTimeIcon></div>
                        <div class="ml-5 text-sm" v-if="isStart">
                            <span ref="hour" id="hour">{{hour}}</span>
                            <span>:</span>
                            <span ref="min" id="min">{{min}}</span>
                            <span>:</span>
                            <span ref="sec" id="sec">{{sec}}</span>
                            {{$t('minute')}}
                        </div>
                    </div>
                    <!-- Quiz -->
                    
                    <div class="text-sm mt-10">
                        <div v-for="(quizzes, index) in quiz.list" :key="index" :class="order != index?`hidden`:``">
                            <div :class="darkMode?`bg-secondary`:`bg-gray-50`" class="shadow rounded-md py-5 px-10 rgba flex-col">
                                <math xmlns = "http://www.w3.org/1998/Math/MathML">
                                    <div v-html="quizzes.title" class="mb-5"></div>
                                </math>
                                <div class="mt-8">
                                    <div v-for="(list,key) in quizzes.check_list" :key="key" class="my-5">
                                        <label class="flex">
                                            <div class="relative">
                                                <input type="checkbox" class="mr-5 hidden" @change="selectAnswer($event,quizzes,list)">
                                                <div class="h-5 w-5 rounded border mr-5 relative"></div>
                                            </div>
                                            <div v-html="list.value" class="text-left"></div>
                                        </label>
                                        
                                    </div>
                                </div>
                                <div></div>
                            </div>
                            
                        </div>
                    </div>
                    <!-- Next & Previous -->
                    <div class="flex justify-between items-center mt-5 text-sm">
                        <div :class="isPrevious?``:`invisible`">
                            <button class="focus:outline-none rounded px-5 py-1 flex items-center" :class="darkMode?`bg-button`:`bg-gray-400 text-white shadow`" @click="previous">
                                <div class="transform rotate-90 relative -left-1"><ChevronIcon fill="#fff" :size="18"></ChevronIcon></div>
                                <div>{{$t('2126')}}</div>
                            </button>
                        </div>
                        <div>{{order + 1}}/{{quiz.total}}</div>
                        <div :class="isNext?``:`invisible`">
                            <button class="focus:outline-none rounded px-5 py-1 flex items-center" :class="darkMode?`bg-button`:`bg-primary text-white`" @click="next">
                                <div>{{$t('2125')}}</div>
                                <div class="transform -rotate-90 relative -right-1"><ChevronIcon fill="#fff" :size="18"></ChevronIcon></div>
                            </button>
                        </div>
                    </div>
                    <!-- Finish -->
                    <div v-if="!isNext || isLastQuestion">
                        <button class="focus:outline-none w-full relative text-white mt-5 rounded-md py-2 h-10" :class="darkMode?`bg-button`:`bg-primary`" :disabled="checkingResult" @click="submit">
                            <div class="absolute w-full flex justify-center items-center -top-2" v-if="checkingResult">
                                <div class="loader"></div>
                            </div>
                            <span v-else>{{$t('2127')}}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <FailExam v-if="fail" :result="result" @exit="exit" @checkResult="checkResult"></FailExam>
        <PassExam v-if="pass" :result="result" @exit="exit" @click="checkResult"></PassExam>
        <ViewExam :quiz="quiz" :result="result" v-if="showResult" :selectedQuiz="selectedQuiz" @exit="exit"></ViewExam>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import LoadingTimeIcon from "./../../../components/LoadingTimeIcon.vue"
import ChevronIcon from "./../../../components/ChevronIcon.vue"
import toHHMMSS from "./../../../helper/toHHMMSS"
import helper from "./../../../helper/helper"
import FailExam from "./FailExam"
import PassExam from "./PassExam"
import ViewExam from "./ViewExam"

export default {
    components:{
        LoadingTimeIcon,
        ChevronIcon,
        FailExam,
        PassExam,
        ViewExam
    },
    data(){
        return{
            duration: 0,
            hour: "00",
            min: "00",
            sec: "",
            isStart: false,
            order: 0,
            isNext: true,
            isPrevious: false,
            isLastQuestion: false,
            selectedQuiz: [],
            checkingResult: false,
            fail: false,
            pass: false,
            result: {},
            showResult: false,
            startingCount: null,
            quizzes: {
                id: "",
                duration: 0,
                quiz: []
            }
        }
    },

    computed:{
        ...mapState('setting', ['darkMode', 'isHide']),
        ...mapState('quiz', ['quiz'])
    },
    methods:{
        ...mapActions('quiz', ['submitQuiz']),
        setTimer(){
            let seconds = this.seconds
            seconds = seconds.toString()
            let times = toHHMMSS.toHHMMSS(seconds);
            this.hour = times.hours
            this.min = times.minutes
            this.sec = times.seconds
        },
        next(){
            this.isPrevious = true

            if(this.order  < this.quiz.total){
                this.order++
                if(this.order + 1 === this.quiz.total){
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
           
            var id = document.getElementById("video").value
            this.quizzes.id = id
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
        submit(){
            this.checkingResult = true    
            this.submitQuiz(this.quizzes).then(response =>{
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
            this.$emit("exit")
        },
        checkResult(){
            this.showResult = true
        }
    },
    mounted(){
        this.seconds = Math.round(this.quiz.duration) * 60
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
    watch:{
    
    }
    
}
</script>
<style lang="scss">
    .rgba{
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .active-checkbox::before{
        content: "✓";
        position: absolute;
        font-weight: bold;
        left:0;
        margin-left: 2.5px;
    }
</style>