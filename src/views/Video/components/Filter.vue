<template>
    <div class="relative">
        <div class="p-5 mb-1" :class="darkMode?'bg-secondary border border-l-2':'bg-white shadow'">
            <div class="flex justify-between w-3/5 ">
                <div class="flex-1 relative">
                    <input type="text"  v-on:keyup.enter="filterSearch" :placeholder="$t('1001')" v-model="s" :class="darkMode?'text-gray-300 border-gray-700':'border-gray-300'" class="w-full h-12 leading-12 focus:outline-none bg-transparent border border-l-0 border-r-0 border-t-0 pl-8">
                    <div>
                        <div v-if="s" class="absolute left-0 top-4 cursor-pointer"
                            :title="$t('clear')" @click="clear">
                            <CloseIcon :width="20" :height="20" :fill="darkMode?'#afb0b4':'#000000'"></CloseIcon>
                        </div>
                        <div class="h-5 absolute left-0 top-4" v-else>
                            <SearchIcon :fill="darkMode?'#afb0b4':'#000000'"></SearchIcon>
                        </div>
                        <!-- <img src="/icon/icon/Search@2x.png" alt="" class="h-5 absolute left-0 top-2"
                            style="margin-top:5px;" v-else> -->
                    </div>
                    <div class="flex absolute right-0 cursor-pointer justify-center items-center h-12 leading-12 top-0"
                    
                        @click="showFilter">
                        <p class="mr-2" :class="localize==='en'?'text-md':'text-sm'">
                            <span v-if="selectedFilterName==='all'" :class="darkMode?'text-gray-300':''">{{$t('1002')}}</span>
                            <span :class="darkMode?'text-gray-300':''" v-else>{{selectedFilterName}}</span>
                        </p>
                        <ChevronIcon :fill="darkMode?'#afb0b4':'#000000'"/>
                    </div>
                </div>
            </div>
        </div>
        <List :filter="filter" v-if="showFilterForm" @closeFilter="closeFilter"/>
    </div>
</template>

<script>
    import ChevronIcon from "./../../../components/ChevronIcon"
    import SearchIcon from "./../../../components/SearchIcon.vue"
    import List from "./List.vue"
    import {mapState, mapActions} from "vuex"
    import CloseIcon from "./../../../components/CloseIcon.vue"
    export default{
        name:"BoxFilter",
        data(){
            return {
                showFilterForm: false,
                s: ""
            }
        },
        components: {
            ChevronIcon,
            SearchIcon,
            List,
            CloseIcon
        },
        computed: {
            ...mapState('setting', ['localize','darkMode']),
            ...mapState('home', ['filter', 'selectedFilterName', 'filter_id'])
        },
        methods: {
            ...mapActions('video', ['getVideo']),
            showFilter(){
                this.showFilterForm = !this.showFilterForm
            },
            closeFilter(){
                this.showFilterForm = false
                let payload = {}

                if(this.s.length){
                    payload.s = this.s 
                }
            
                if(this.filter_id !== "all"){
                    payload.filter_id = this.filter_id
                }

                this.getVideo(payload);
            },
            clear(){
                this.s = ""
                this.$store.commit("home/receiveFilter", 'all');
                this.$store.commit("home/selectedFilterName", 'all');
                this.filterSearch()
            },
            filterSearch(){
                this.$store.commit("home/receiveS", this.s);
                let payload = {}
                payload.s = this.s 

                if(this.filter_id !== "all"){
                    payload.filter_id = this.filter_id
                }

                this.getVideo(payload);
                this.$emit("enableUserScroll", true)
            }
        },
        watch: {
            s: function (val) {
                this.$store.commit("home/receiveS", val);
            }
        }
    }
</script>

<style>

</style>
