<template>
    <div class="mt-3 overflow-y-scroll h-screen text-sm pb-72">
        <div class="px-5 pt-7 shadow-md" :class="darkMode?`bg-secondary border-t border-b border-button text-textSecondary`:`bg-white text-black`">
            <FilterData></FilterData>
            <!-- Tab -->
            <div class="mt-7 pb-3" v-if="!showList">
                <div class="flex justify-start">
                    <div @click="changeType('pdf')" class="cursor-pointer" :class="type==`pdf`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                        <span class="">{{$t('2202')}}</span>
                    </div>
                    <div @click="changeType('sound')" class="cursor-pointer ml-20" :class="type==`sound`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                        <span>{{$t('2204')}}</span>
                    </div>
                    <div @click="changeType('video')" class="cursor-pointer ml-20" :class="type==`video`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                        <span>{{$t('2205')}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filter list -->
        <div class="mx-5">
            <FilterList v-if="showList" @filterLibrary="filterLibrary($event)"></FilterList>
        </div>
        <!-- Membership -->
        <div class="mt-5" :class="darkMode?`bg-youtube`:`transparent`">
            <div class="flex justify-center items-center"> 
                <div class="text-base" :class="darkMode?`text-gray-300`:`text-primary`">{{$t('2201')}}</div>
            </div>
            <div class="mt-10">
                <Membership></Membership>
            </div>
        </div>
        <div class="border-t border-dashed w-full my-10" :class="darkMode?`border-button`:`border-gray-300`"></div>
        <!-- Loading -->
        <div class="px-5" v-if="loading">
            <Loading></Loading>
        </div>
        <!-- Book -->
        <div class="mx-5" v-else>
            <div class="flex items-center justify-center text-base mb-10" :class="darkMode?`text-gray-300`:`text-primary`" v-if="type == `pdf`">{{$t('2202')}}</div>
            <div class="flex items-center justify-center text-base mb-10" :class="darkMode?`text-gray-300`:`text-primary`" v-if="type == `sound`">{{$t('2204')}}</div>
            <div class="flex items-center justify-center text-base mb-10" :class="darkMode?`text-gray-300`:`text-primary`" v-if="type == `video`">{{$t('2205')}}</div>
            <div class="grid grid-cols-4 gap-6">
                <div v-for="(book, index) in libraries.list" :key="index">
                    <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="rounded-b-xl shadow-md pb-3">
                        <div>
                            <img :src="book.thumbnail" class="rounded-t-xl">
                        </div>
                        <div class="mt-5 px-3">
                            <div :class="darkMode?`text-white`:``">{{book.title}}</div>
                            <div class="flex justify-between items-center mt-3">
                                <div>{{$t('1006')}}: {{book.price.year}}</div>
                                <div><CartIcon :fill="darkMode?`#909090`:`#000000`"></CartIcon></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import FilterData from "./components/Filter.vue"
import FilterList from "./components/FilterList.vue"
import Membership from "./components/Membership.vue"
import CartIcon from "./../../components/CartIcon.vue"
import Loading from "./../../components/Loading.vue"
export default {
    components:{
        FilterData,
        Membership,
        FilterList,
        CartIcon,
        Loading
    },
    data(){
        return{
            type: 'pdf',
            filter_id: null
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('library', ['loading', 'libraries','showList'])
    },
    methods:{
        ...mapActions('library', ['getLibrary']),
        filterLibrary(library){
            this.filter_id = library._id
            let filter = {
                type: this.type
            }

            if(library){
                filter.filter_id = library._id
            }

            this.getLibrary(filter).then(() =>{
                this.$store.commit("library/showFilterList",this.showList)
            })
        },

        changeType(type){
            this.type = type
            let filter = {
                type: this.type
            }
            
            if(this.filter_id != null){
                filter.filter_id = this.filter_id
            }

            this.getLibrary(filter)
            
        }
    },
    created(){
        this.getLibrary({
            type: this.type
        })
    }
}
</script>