<template>
    <div class="ml-5 h-screen flex pb-40 items-center justify-center"
         :class="darkMode?`bg-secondary text-gray-300`:`bg-white border`">
        <div v-if="loading">
          <div class="flex justify-center items-center"></div>
        </div>
        <div v-else>
            <div v-if="err" class="">{{$t(err)}}</div>
            <!-- Box note -->
            <div class="rounded-xl px-10 py-5"
                 :class="darkMode?`bg-button shadow`:`bg-white shadow-md border`" v-else>
                <div class="text-lg font-semibold mb-7">{{$t('2116')}}</div>
                <div class="mb-5 text-sm flex justify-between items-center">
                    <div>{{$t('2118')}} {{$t('colon')}}</div>
                    <div>{{quiz.total}} {{$t('2115')}}</div>
                </div>
                <div class="flex mb-5 text-sm justify-between flex justify-between items-center">
                    <div>{{$t('2119')}} {{$t('colon')}}</div>
                    <div>{{quiz.duration}}​ {{$t('minute')}}</div>

                </div>
                <div class="flex text-sm justify-between flex justify-between items-center">
                    <div>{{$t('2120')}} {{$t('colon')}}</div>
                    <div>{{quiz.pass_point}}/{{quiz.total}}</div>
                </div>
                <div class="mt-7">
                    <button  class="focus:outline-none text-white rounded-md px-6 py-3 text-sm​​ w-full" :class="darkMode?`bg-black`:`bg-primary shadow-2xl`" @click="startExam()">
                        {{$t('2121')}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState } from "vuex";
// import toHHMMSS from "./../../../helper/toHHMMSS"

export default {
    data(){
        return{
            loading: false,
            quiz: "",
            err: "",
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('quiz', ['getQuiz']),
        getQuizToUser(){
            this.loading = true
            let id = document.getElementById('video').value
            this.getQuiz({id}).then(res=>{
                this.loading = false
                if(res.data.status === 1){
                    this.err = res.data.msg
                }else{
                    this.quiz = res.data.data
                }
                
            })
        },
        startExam(){
            this.$emit('startingExam', this.quiz)
        }
    },
    mounted(){
        this.getQuizToUser()
    }
}
</script>