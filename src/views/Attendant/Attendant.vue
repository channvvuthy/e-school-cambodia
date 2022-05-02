<template>
    <div class="h-screen">
        <eHeader :user="attendant.user"></eHeader>    
        <div class="flex items-center mt-5 mx-5 overflow-y-scroll months pb-5">
            <div v-for="(month, index) in months" :key="index + Math.random()">
                <button :class="darkMode?`${currentMonth == month?`bg-pass text-white`:` bg-button text-gray-300`}`:`${currentMonth == month?`bg-primary text-white`:`bg-white`}`"
                @click="filterMonth(month)"
                v-if="month <= getMonth()"
                class="rounded-md whitespace-nowrap px-10 text-sm py-3 shadow-md mr-5 focus:outline-none font-semibold">
                    <span>{{$t(month)}} {{year()}}</span>
                </button>
            </div>
        </div>
        <div class="w-3/5 rounded-2xl shadow py-10 px-8 m-5" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="text-lg font-semibold text-center" :class="darkMode?``:`text-primary`">
                {{$t(currentMonth)}} {{year()}}
            </div>
           <div class="grid grid-cols-7 gap-5 mt-10">
               <div v-for="(date, index) in dates" :key="index + Math.random()">
                   <div class="text-base font-bold text-center">
                       {{$t(date)}}
                   </div>
               </div>
               <div v-for="(day, key) in days" :key="key + Math.random()">
                   <div class="text-base" :class="attendantActive(day)?`${darkMode?`text-pass`:`text-primary`} font-black`:`${darkMode?`text-gray-600`:`text-gray-400`}`">
                      <div class="text-center rounded py-3" :class="getCurrentDay(day,currentMonth)?`${darkMode?`bg-pass`:`bg-primary`} text-white font-black`:``">
                           {{day}}
                      </div>
                     
                   </div>
               </div>
           </div>
        </div>    
    </div>
</template>
<script>
import eHeader from "../Activity/components/eHeader.vue"
import Loading from "../../components/Loading.vue"
import BoxFilter from "../Video/components/Filter.vue"
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
        ...mapState('summary', ['attendant'])
    },
    data(){
        return{
            loading: false,
            months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            dates: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            currentMonth: "",
            days:[],
            payload: {}
        }
    },
    methods:{
        ...mapActions('summary', ['getAttendant']),
        year(){
            return new Date().getFullYear();
        },
        getMonth(month = null){
            if(month == null){
                var d = new Date();
                return d.getMonth() + 1
            }
            return month

        },
        daysInThisMonth(month) {
            var now = new Date();
            let dayOfMonth = new Date(now.getFullYear(), month, 0).getDate();
            for(let i = 1; i <= dayOfMonth; i++){
                this.days.push(i)
            }
        },
        getCurrentDay(day, month) {
           var d = new Date();
           return this.getMonth() === parseInt(month) &&  day === d.getDate()
        },

        filterMonth(month){
           
            this.days = []
            this.daysInThisMonth(month)
            this.currentMonth = month
            if(this.currentMonth < 10){
                this.payload.filter = `${this.year()}-0${this.currentMonth}`
            }else{
                this.payload.filter = this.year()+`-`+this.currentMonth
            }
            this.getAttendant(this.payload)
        },
        attendantActive(day){
            if(this.attendant.days != undefined && this.attendant.days.length){
                for(let i = 0; i < this.attendant.days.length; i ++){
                    let d = new Date(this.attendant.days[i])
                    d = parseInt(d.getDate())
                    
                    if(day === d){
                        return true;
                    }
                }
            }
            return false
        }
        
    },

    created(){
        this.currentMonth = this.getMonth()
        this.daysInThisMonth(this.getMonth())
        this.payload.id = this.$route.params.user_id
        this.payload.filter = this.year()+`-`+this.currentMonth 
        this.getAttendant(this.payload)

    
    }
}
</script>
<style>
   .progress{
        position: relative;
        margin: 4px;
        float:left;
        text-align: center;
    }
    .barOverflow{ /* Wraps the rotating .bar */
        position: relative;
        width: 200px; height: 100px; /* Half circle (overflow) */
        margin-bottom: -14px; /* bring the numbers up */
        overflow: hidden;
    }
    .bar{
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 10px solid #c9c9c9;
        border-bottom-color: #189faf;
        border-right-color: #189faf;
        transform: rotate(135deg);
    }
    .months::-webkit-scrollbar {
        height: 0px;              /* height of horizontal scrollbar ← You're missing this */
        width: 0px;               /* width of vertical scrollbar */
        border: 1px solid #d5d5d5;
    }
</style>