<template>
    <div>
        <img :src="message.reply.file.url" class="w-36 rounded-md my-2 opacity-60 cursor-pointer" @click="previewImage(message.reply.file.url)">
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
    methods:{
        previewImage(previewUrl){
            this.$emit("previewImage",previewUrl)
        }
    }
}
</script>