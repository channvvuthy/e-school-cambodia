<template>
    <div class="m-5 z-50">
        <div class="flex justify-between w-3/5">
            <div class="rounded flex-1 relative">
                <input type="text" :placeholder="$t('1001')"
                       :class="localize==='en'?'text-md':'text-sm'"
                       class="w-full h-12 leading-12 focus:outline-none bg-transparent border border-l-0 border-r-0 border-gray-300 border-t-0 pl-8">
                <div>
                    <img src="/icon/icon/Search@2x.png" alt="" class="h-5 absolute left-0 top-2"
                         style="margin-top:5px;">
                </div>
                <div class="flex absolute right-3 cursor-pointer justify-center items-center h-12 leading-12 top-0" @click="showFilter">
                    <p class="mr-2" :class="localize==='en'?'text-md':'text-sm'">{{$t('1002')}}</p>
                    <ChevronIcon/>
                </div>
            </div>
        </div>
        <List :filter="filter" v-if="showFilterForm" @closeFilter="closeFilter"></List>
    </div>
</template>
<script>
    import ChevronIcon from "./../../components/ChevronIcon"
    import List from "./components/List.vue"
    import {mapState} from "vuex"
    export default{
        data(){
            return {
                showFilterForm: false
            }
        },
        components: {
            ChevronIcon,
            List
        },
        computed: {
            ...mapState('setting', ['localize']),
            ...mapState('home', ['filter'])
        },
        methods: {
            showFilter(){
                this.showFilterForm = true
            },
            closeFilter(){
                this.showFilterForm = false
            }
        },
        mounted(){
            console.log(this.filter)
        }
    }
</script>