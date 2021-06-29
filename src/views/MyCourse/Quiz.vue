<template>
    <div>
        <eHeader :title="$route.params.course.title" :isExam="true" @exit="exit"></eHeader>
        <div class="h-screen pb-40 overflow-y-scroll flex items-center justify-center" :class="darkMode?`bg-youtube`:``">
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
        </div>
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import {mapState, mapActions} from "vuex"
export default {
    data(){
        return{
            isExam: false
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('quiz', ['certificatesQuiz'])
    },
    components:{
        eHeader
    },
    created(){
         this.$store.commit('setting/toggleSidebar', false)
    },
    methods:{
        exit(){
           this.$router.push({ name: 'video-detail', params: { course: this.$route.params.course } })
        },
        startExam(){
            this.isExam = true
        }
    }
    
}
</script>