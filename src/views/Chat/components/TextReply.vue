<template>
    <div :class="darkMode?`text-gray-500 border-gray-500`:`text-gray-700 border-gray-700`" class="border-l-2 pl-1 mb-2 max-w-sm" @click="goToMessage(message)" v-html="mention(message.reply.text)"></div>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:{
        message:{
           default: function(){
               return {

               }
           }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        goToMessage(message){
            this.$emit("goToMessage", message)
        },
        mention(str){
            return str.replace(/[@]\[/g, "<span class='text-fb'>").replace(/\]/g, "</span>")
        },
    }
}
</script>