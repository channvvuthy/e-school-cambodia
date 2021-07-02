<template>
    <div class="mt-5" :class="darkMode?`text-gray-300`:``">
        <div v-if="friends.list && friends.list.length">
            <div v-for="(friend, index) in friends.list" :key="index" class="mb-3">
                <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                        <div class="h-12 w-12 rounded-full bg-ceover bg-white" :style="{backgroundImage:`url(${friend.photo})`}"></div>
                        <div class="ml-4 text-sm">
                            <div>
                                
                                {{friend.name}}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center cursor-pointer rounded-2xl" :class="darkMode?`bg-button`:`bg-primary`">
                        <div @click="unFriendFromList(friend)"  class="flex items-center justify-center w-10 h-6 rounded-2xl">
                            <CloseIcon :fill="darkMode?`#909090`:`#FFFFFF`" :width="16"></CloseIcon>
                        </div>
                    </div>
                </div>
                <div class="border-t mt-3" :class="darkMode?`border-button`:``">
                    
                </div>
            </div>
        </div>
         <div v-else>
            {{$t('you_do_not_have_any_friend')}}
        </div>
    </div>
</template>
<script>
import CloseIcon from "./../../components/CloseIcon.vue"
import {mapState, mapActions} from "vuex"
export default {
    props:{
        friends:{
            default:() =>{
                return []
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    components:{
        CloseIcon,
    },
    methods:{
        ...mapActions('network', ['unFriend']),
        unFriendFromList(friend){
            let payload = {id: friend._id}
            this.unFriend(payload)
        }
    }
}
</script>