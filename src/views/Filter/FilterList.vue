<template>
    <div class="m-5 z-50">
        <div class="flex justify-between w-3/5">
            <div class="rounded flex-1 relative">
                <input type="text" :placeholder="$t('1001')"
                       v-model="s"
                       v-on:keyup.enter="filterSearch"
                       :class="localize==='en'?'text-md':'text-sm'"
                       class="bg-white rounded shadow w-full h-12 leading-12 focus:outline-none bg-transparent border border-l-0 border-r-0 border-gray-300 border-t-0 pl-10">
                <div>
                    <div v-if="s" class="absolute left-3 top-2 cursor-pointer" style="margin-top:5px;"
                         :title="$t('clear')" @click="clear">
                        <CloseIcon :width="24" :height="24"></CloseIcon>
                    </div>
                    <img src="/icon/icon/Search@2x.png" alt="" class="h-5 absolute left-3 top-2"
                         style="margin-top:5px;" v-else>
                </div>
                <div class="flex absolute right-3 cursor-pointer justify-center items-center h-12 leading-12 top-0"
                     @click="showFilter">
                    <p class="mr-2" :class="localize==='en'?'text-md':'text-sm'">
                        <span v-if="selectedFilterName==='all'">{{$t('1002')}}</span>
                        <span v-else>{{selectedFilterName}}</span>
                    </p>
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
    import {mapState, mapActions} from "vuex"
    import CloseIcon from "./../../components/CloseIcon.vue"
    export default{
        data(){
            return {
                showFilterForm: false,
                s: ""
            }
        },
        components: {
            ChevronIcon,
            List,
            CloseIcon
        },
        computed: {
            ...mapState('setting', ['localize']),
            ...mapState('home', ['filter', 'selectedFilterName', 'filter_id'])
        },
        methods: {
            ...mapActions('home', ['getList']),
            showFilter(){
                this.showFilterForm = true
            },
            closeFilter(){
                this.showFilterForm = false
            },
            clear(){
                this.s = ""
                this.$store.commit("home/receiveFilter", 'all');
                this.$store.commit("home/selectedFilterName", 'all');
                this.filterSearch()
            },
            filterSearch(){
                this.$store.commit("home/receiveS", this.s);
                this.getList({
                    s: this.s,
                    filter_id: this.filter_id
                }).then(() => {
                    this.$store.commit('setting/setPagination', 1)
                })
            }
        },
        watch: {
            s: function (val) {
                this.$store.commit("home/receiveS", val);
            }
        }
    }
</script>