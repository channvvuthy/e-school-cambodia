<template>
    <div>
        <eHeader></eHeader>
        <div class="flex items-center h-14 text-sm px-5 mt-3" :class="darkMode?`text-gray-300 bg-secondary`:`bg-white shadow`">
            <div class="cursor-pointer" :class="active === `friend`?`font-bold ${darkMode?`text-fb`:`text-primary`}`:``" @click="switchMenu('friend')">{{$t('friend')}}</div>
            <div class="mx-10 cursor-pointer" :class="active === `friend_request`?`font-bold ${darkMode?`text-fb`:`text-primary`}`:``" @click="switchMenu('friend_request')">{{$t('friend_request')}}</div>
            <div class="cursor-pointer cursor-pointer" :class="active === `add_friend`?`font-bold ${darkMode?`text-fb`:`text-primary`}`:``" @click="switchMenu('add_friend')">{{$t('add_friend')}}</div>
            <div class="ml-10 cursor-pointer" :class="active === `your_request`?`font-bold ${darkMode?`text-fb`:`text-primary`}`:``" @click="switchMenu('your_request')">{{$t('your_request')}}</div>
        </div>
        <div class="p-5 h-screen pb-40">
            <div class="w-4/6 rounded-xl p-5 overflow-y-scroll" :class="darkMode?`bg-secondary`:`bg-white shadow`" style="height:95%">
                <div class="relative w-3/4">
                    <input type="text" class="focus:outline-none h-10 rounded-md bg-softGray pl-3 text-sm w-full" :placeholder="$t('1001')" :class="darkMode?`bg-button text-gray-300`:``">
                    <div class="absolute right-3 top-2">
                        <SearchIcon :fill="darkMode?`#FFFFFF`:`#000000`"></SearchIcon>
                    </div>
                </div>
                 <!-- Add friend -->
                <AddFriend :friendNotInContact="friendNotInContact" v-if="active === `add_friend`"></AddFriend>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import {mapState, mapActions} from "vuex"
import SearchIcon from "./../../components/SearchIcon.vue"
import AddFriend from "./AddFriend.vue"
export default {
    components:{
        eHeader,
        SearchIcon,
        AddFriend
    },
    data(){
        return{
            page: 1
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('network', ['active','friends','loading','friendNotInContact'])
    },
    methods:{
        ...mapActions('network', ['getFriend', 'getFriendNotInContact']),
        switchMenu(tap){
            this.$store.commit("network/switchTab",tap)
            if(tap === 'add_friend'){
                this.getFriendNotInContact({
                    p: this.page
                })
            }
        }
    },
    created(){
        this.getFriend({p: this.page})
    }
}
</script>