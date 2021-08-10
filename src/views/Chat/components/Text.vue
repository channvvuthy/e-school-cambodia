<template>
    <div>
        <div :class="isMind?`${darkMode?`chat-bubble-right-dark`:`chat-bubble--right`}`:`${darkMode?`bubble bubble--left-dark`:`bubble--left`}`" class="relative chat-bubble" v-html="mention(message.content.text)"></div>
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {

    props:{
        isMind:{
            default:()=>{
                return  false
            }
        },
        message:{
            default:() =>{
                return {

                }
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        mention(str){
            return str.replace(/[@]\[/g, "<span class='text-fb'>").replace(/\]/g, "</span>")
        },
    }
}
</script>
<style>
    .chat-bubble:after {
        content: "";
        position: absolute;
        top: 50%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-bottom: 0;
        margin-top: -10px;
    }
    .chat-bubble--right:after {
        right: 0;
        border-left-color: #ffffff;
        border-right: 0;
        margin-right: -30px;
        
    }
    .chat-bubble-right-dark:after {
        right: 0;
        border-left-color: #383838;
        border-right: 0;
        margin-right: -30px;
        
    }
    .bubble--left-dark:after {
        left: 0;
        border-right-color: #383838;
        border-left: 0;
        margin-left: -30px;
    }
    .bubble--left:after {
        left: 0;
        border-right-color: #ffffff;
        border-left: 0;
        margin-left: -30px;
    }
</style>