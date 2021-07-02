<template>
    <div class="mt-5" :class="darkMode?`text-gray-300`:``">
        <div v-if="request.list && request.list.length">
            <div v-for="(friend, index) in request.list" :key="index" class="mb-3">
                <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                        <div class="h-12 w-12 rounded-full bg-ceover bg-white" :style="{backgroundImage:`url(${friend.photo})`}"></div>
                        <div class="ml-4 text-sm">
                            <div>
                                
                                {{friend.name}}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-full cursor-pointer">
                        <div @click="cancelMyRequest(friend._id)" class="w-10 h-6 rounded-2xl items-center flex justify-center" :class="darkMode?`bg-button`:`bg-heart`">
                            <CloseIcon :fill="darkMode?`#909090`:`#FFFFFF`" :width="20"></CloseIcon>
                        </div>
                        
                    </div>
                </div>
                <div class="border-t mt-3" :class="darkMode?`border-button`:``">
                    
                </div>
            </div>
        </div>
        <div v-else>
            {{$t('no_request_to')}} <span v-if="s">({{s}})</span>
        </div>
    </div>
</template>
<script>
import CloseIcon from "./../../components/CloseIcon.vue"
import {mapState, mapActions} from "vuex"
export default {
    props:{
        request:{
            default:() =>{
                return []
            }
        },
        s:{
            default:() =>{
                return ""
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
        CloseIcon,
    },
    methods:{
        ...mapActions('network', ['addFriend','cancelRequest']),
        addUser(friend){
            let payload = {id: friend._id}
            this.addFriend(payload).then(() =>{
                 this.addedFriend.push(friend._id)
            })
        },
        cancelMyRequest(payload){
            this.cancelRequest(payload)
        }

    }
}
</script>