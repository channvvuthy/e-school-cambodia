<template>
    <div class="mt-5" :class="darkMode?`text-gray-300`:``">
        <div v-if="friendNotInContact.list && friendNotInContact.list.length">
            <div v-for="(friend, index) in friendNotInContact.list" :key="index" class="mb-3">
                <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                        <div class="h-12 w-12 rounded-full bg-ceover bg-white" :style="{backgroundImage:`url(${friend.photo})`}"></div>
                        <div class="ml-4 text-sm">
                            <div>
                                
                                {{friend.name}}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-full" :class="darkMode?`bg-fb`:`bg-primary cursor-pointer`">
                        <div @click="addFriend(friend)" v-if="!isRequested(friend)" class="px-3 py-1">
                            <AddIcon fill="#FFFFFF" :size="14"></AddIcon>
                        </div>
                        <div v-else @click="cancelFriendRequest(friend)" class="px-3 py-1">
                            <ArrowRight fill="#FFFFFF" :size="14"></ArrowRight>
                        </div>
                    </div>
                </div>
                <div class="border-t mt-3" :class="darkMode?`border-button`:``">
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AddIcon from "./../../components/AddIcon.vue"
import ArrowRight from "./../../components/ArrowRight.vue"
import {mapState} from "vuex"
export default {
    props:{
        friendNotInContact:{
            default:() =>{
                return []
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    data(){
        return{
            addedFriend: []
        }
    },
    components:{
        AddIcon,
        ArrowRight
    },
    methods:{
        addFriend(friend){
            this.addedFriend.push(friend._id)
        },
        isRequested(friend){
            for(let i = 0; i < this.addedFriend.length; i ++){
                if(this.addedFriend[i] === friend._id){
                    return true
                }
            }
            return false
        },
        cancelFriendRequest(friend){
            this.addedFriend = this.addedFriend.filter(item => item != friend._id)
        }
    }
}
</script>