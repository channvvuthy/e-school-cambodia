<template>
    <div class="w-56 rounded-lg" :class="darkMode?`bg-button text-white`:`bg-white e-shadow`">
        <div class="h-12 flex items-center cursor-pointer px-3 border-b" :class="darkMode?`border-youtube`:``" @click="reply()">{{$t('reply')}}</div>
        
        <div class="h-12 flex items-center cursor-pointer px-3 border-b" :class="darkMode?`border-youtube`:``" @click="save" v-if="message.content.file">
            {{$t('save')}}
        </div>
        <div class="h-12 flex items-center cursor-pointer px-3 border-b" :class="darkMode?`border-youtube`:``" @click="copy" v-else>
            {{$t('copy_text')}}
        </div>
        <div class="h-12 flex items-center cursor-pointer px-3" :class="darkMode?``:``" @click="deleteMessage" v-if="stProfile._id == sender(message) && isDelete()">{{$t('delete_message')}}</div>
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:{
        message:{
            default: ()=>{
                return {}
            }
        },
        contact:{
            default: ()=>{
                return {}
            }
        },

    },
    data(){
        return{
            auth: null,
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile'])
    },

    methods:{
        sender(message){
            if(this.contact.type == 0){
                if((message.is_admin == undefined || message.is_admin == 0)){
                    return this.auth
                }
            }

            if(message.sender === undefined ){
                return false
            }

            return message.sender._id
        },
        reply(){
            this.$emit("reply")
        },
        copy(){
            this.$emit("copy")
        },
        deleteMessage(){
             this.$emit("deleteMessage")
        },
        save(){
            this.$emit("save")
        },
        isDelete(){
            var today = new Date();
            var Christmas = new Date(this.message.date);
            var diffMs = (Christmas - today); // milliseconds between now & Christmas
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            if(Math.abs(diffMins) > 5){
                return false
            }
            return true
        }
    },
    created(){
        this.auth = this.stProfile._id
        this.isDelete()
    }
}
</script>