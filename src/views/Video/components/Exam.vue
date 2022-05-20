<template>
    <div>
        <div class="absolute left-0 top-0  h-full z-50 pt-10 e-shadow"
             :class="darkMode?`bg-youtube text-gray-300`:`bg-white text-black`" style="width:99%;">
            <div class="absolute right-3 top-3 cursor-pointer w-7 h-7 rounded-full flex items-center justify-center"
                 :class="darkMode?`bg-button`:`bg-gray-400`" @click="closeExam">
                <CloseIcon fill="#FFF" :width="20"/>
            </div>
            <div class="text-center bg-transparent overflow-y-scroll h-85 pb-40">
                <div class="text-base max-w-xl m-auto">
                    <div class="mb-5">
                        {{ $t('2121') }}
                    </div>
                    <div class="flex items-center justify-center font-semibold">
                        <div class="relative" style="top:-2px;">
                            <LoadingTimeIcon :fill="darkMode?`#E5E7EB`:`#000000`" :size="16"/>
                        </div>
                        <div class="ml-5 text-sm" v-if="isStart">
                            <span ref="hour" id="hour">{{ hour }}</span>
                            <span>:</span>
                            <span ref="min" id="min">{{ min }}</span>
                            <span>:</span>
                            <span ref="sec" id="sec">{{ sec }}</span>
                            {{ $t('minute') }}
                        </div>
                    </div>
                    <!-- Quiz -->

                    <div class="text-sm mt-10 ">
                        <div v-for="(quizzes, index) in quiz.list" :key="index" :class="order != index?`hidden`:``">
                            <div :class="darkMode?`bg-secondary`:`bg-gray-50`"
                                 class="shadow rounded-md py-5 px-10 rgba flex-col overflow-y-scroll my-scroll">
                                <math xmlns="http://www.w3.org/1998/Math/MathML">
                                    <div v-for="(content, index) in quizzes.content" :key="index">
                                        <template v-if="content.type == 1">
                                            <katex-element :expression="toLatex(content.value)"/>
                                        </template>
                                        <template v-else>
                                            <img :src="content.value" class="max-w-lg">
                                        </template>
                                    </div>
                                </math>
                                <div class="mt-8">
                                    <div v-for="(list,key) in quizzes.check_list" :key="key">
                                        <label class="flex items-center relative">
                                            <div class="relative">
                                                <input type="checkbox" class="mr-5 hidden"
                                                       @change="selectAnswer($event,quizzes,list)">
                                                <div class="h-5 w-5 rounded border mr-5 relative"
                                                     :class="darkMode?`border-`:`border-gray-400`"
                                                     :id="list._id"></div>
                                            </div>
                                            <div>
                                                <template v-if="list.type == 1">
                                                    <katex-element :expression="toLatex(list.value)"/>
                                                    <!-- <span class="absolute bg-red-400">
                                                        {{ (list.value) }}
                                                    </span> -->
                                                </template>
                                                <template v-else>
                                                    <img :s១១១១១១rc="list.value" class="max-w-lg">
                                                </template>
                                            </div>
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
                            <button class="focus:outline-none rounded px-5 py-1 flex items-center"
                                    :class="darkMode?`bg-button`:`bg-gray-400 text-white shadow`" @click="previous">
                                <div class="transform rotate-90 relative -left-1">
                                    <ChevronIcon fill="#fff" :size="18"/>
                                </div>
                                <div>{{ $t('2126') }}</div>
                            </button>
                        </div>
                        <div>{{ order + 1 }}/{{ quiz.total }}</div>
                        <div :class="isNext?``:`invisible`">
                            <button class="focus:outline-none rounded px-5 py-1 flex items-center"
                                    :class="darkMode?`bg-button`:`bg-primary text-white`" @click="next">
                                <div>{{ $t('2125') }}</div>
                                <div class="transform -rotate-90 relative -right-1">
                                    <ChevronIcon fill="#fff" :size="18"/>
                                </div>
                            </button>
                        </div>
                    </div>
                    <!-- Finish -->
                    <div v-if="!isNext || isLastQuestion">
                        <button class="focus:outline-none w-full relative text-white mt-5 rounded-md py-2 h-10"
                                :class="darkMode?`bg-button`:`bg-primary`" :disabled="checkingResult" @click="submit">
                            <div class="absolute w-full flex justify-center items-center -top-2" v-if="checkingResult">
                                <div class="loader"></div>
                            </div>
                            <span v-else>{{ $t('2127') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <FailExam v-if="fail" :result="result" @exit="exit" @checkResult="checkResult"/>
        <PassExam v-if="pass" :result="result" @exit="exit" @checkResult="checkResult"/>
        <ViewExam :quiz="quiz" :result="result" v-if="showResult" :selectedQuiz="selectedQuiz" @exit="exit"/>
    </div>
</template>
<script>
    import {mapState, mapActions} from "vuex"
    import LoadingTimeIcon from "./../../../components/LoadingTimeIcon.vue"
    import ChevronIcon from "./../../../components/ChevronIcon.vue"
    import CloseIcon from "./../../../components/CloseIcon.vue"
    import toHHMMSS from "./../../../helper/toHHMMSS"
    import helper from "./../../../helper/helper"
    import FailExam from "./FailExam.vue"
    import PassExam from "./PassExam.vue"
    import ViewExam from "./ViewExam.vue"
    import Vue from 'vue';
    import VueKatex from 'vue-katex';
    import 'katex/dist/katex.min.css';

    Vue.use(VueKatex, {
        globalOptions: {
            displayMode: true,
            strict: "ignore",
            output: "htmlAndMathml"
        }
    });

    export default {
        components: {
            LoadingTimeIcon,
            ChevronIcon,
            FailExam,
            PassExam,
            ViewExam,
            CloseIcon
        },
        data() {
            return {
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
                },
            }
        },

        computed: {
            ...mapState('setting', ['darkMode', 'isHide']),
            ...mapState('quiz', ['quiz'])
        },
        methods: {
            ...mapActions('quiz', ['submitQuiz']),
            toLatex(string) {
                let str = string.toString()
                return str.replace(/\[math]/g, "").replace(/\[\/math]/g, "").replace(/&nbsp;/g, "").replace("។", "")
                    .replace(/ℜ/g, "\\Re").replace(/\\left{/, "\\left\\{").replace(/\\right}/, "\\right\\}")
                    .replace(/lorx/, 'lor x').replace(/intx/, 'int x').replace('timesf', 'times f')
                    .replace(/{\\begin{matrix}/, "(\\begin{matrix}").replace(/\\end{matrix}\\right/g, "\\end{matrix}\\right)")
                    .replace(/\\pitk/g, "{\\pi}tk").replace(/&ne;/g, "\\neq").replace(/&plusmn;/g, "\\pm")
                    .replace(/&times;/, "\\times ").replace(/&alpha;/g, "\\alpha").replace(/&beta;/g, "\\beta")
                    .replace(/&theta;/g, "\\theta").replace(/&divide;/g, "\\divide ").replace(/&pi;/g, "\\pi ")

            },
            setTimer() {
                let seconds = this.seconds
                seconds = seconds.toString()
                let times = toHHMMSS.toHHMMSS(seconds);
                this.hour = times.hours
                this.min = times.minutes
                this.sec = times.seconds
            },
            next() {
                this.isPrevious = true

                if (this.order < this.quiz.total) {
                    this.order++
                    if (this.order + 1 === this.quiz.total) {
                        this.isNext = false
                        this.isLastQuestion = true
                    }
                } else {
                    this.isNext = false
                    this.isLastQuestion = true
                }
            },
            previous() {
                this.isNext = true
                if (this.order) {
                    this.order--
                }
                if (this.order <= 0) {
                    this.isPrevious = false
                }
            },
            selectAnswer(event, quizzes, list) {
                var id = document.getElementById("video").value
                this.quizzes.id = id
                this.quizzes.duration = this.duration / 60
                let quiz = {
                    id: quizzes._id,
                    answer: list._id
                }
                if (event.target.checked) {
                    this.selectedQuiz = this.selectedQuiz.filter(item => item.id != quizzes._id)
                    this.selectedQuiz.push(quiz)
                    event.target.nextSibling.className += " active-checkbox"
                    let esc = quizzes.check_list.filter(item => item._id != list._id)
                    for (let i = 0; i < esc.length; i++) {
                        document.getElementById(`${esc[i]._id}`).classList.remove("active-checkbox");
                    }

                } else {
                    this.selectedQuiz = this.selectedQuiz.filter(item => item.answer !== quiz.answer)
                    event.target.nextSibling.classList.remove("active-checkbox");
                }

                this.quizzes.quiz = this.selectedQuiz
            },
            submit() {
                this.checkingResult = true
                this.submitQuiz(this.quizzes).then(response => {
                    this.checkingResult = false
                    this.checkingResult = false

                    if (response.data.status === 1) {
                        helper.errorMessage(response.data.msg)
                    } else {
                        if (response.data.data.is_pass) {
                            this.pass = true
                        } else {
                            this.fail = true
                        }
                        this.result = response.data.data
                    }
                    clearInterval(this.startingCount)
                })
            },
            exit() {
                this.$emit("exit")
            },
            checkResult() {
                this.showResult = true
            },
            closeExam() {
                this.exit()
            }
        },
        mounted() {
            this.seconds = Math.round(this.quiz.duration) * 60
            this.startingCount = setInterval(() => {
                this.seconds--
                this.duration++
                this.setTimer();

                if (this.seconds == 0) {
                    clearInterval(this.startingCount)
                    this.submit()
                }

            }, 1000)

            this.isStart = true

        },
        watch: {}

    }
</script>
<style lang="scss">
    .rgba {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .active-checkbox::before {
        content: "✓";
        position: absolute;
        font-weight: bold;
        left: 0;
        margin-left: 2.5px;
    }

    // .katex-display>.katex {
    //     white-space: normal !important;
    // }
</style>
