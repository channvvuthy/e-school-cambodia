<template>
    <div>
        <img :src="message.reply.file.url" class="w-40 rounded-md my-2 opacity-70">
    </div>
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
}
</script>