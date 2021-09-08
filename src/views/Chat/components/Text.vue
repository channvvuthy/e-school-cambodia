<template>
    <div>
        <div v-if="isAdmin" :class="isAdmin?`${darkMode?`chat-bubble-right-dark`:`chat-bubble--right`}`:`${darkMode?`bubble bubble--left-dark`:`bubble--left`}`" class="relative chat-bubble" v-html="linkify(mention(message.content.text))"></div>
        <div v-else :class="isMind?`${darkMode?`chat-bubble-right-dark`:`chat-bubble--right`}`:`${darkMode?`bubble bubble--left-dark`:`bubble--left`}`" class="relative chat-bubble" v-html="linkify(mention(message.content.text))"></div>
        
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {

    props:{
        isAdmin:{
            default:()=>{
                return false
            }
        },
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
            try{
                 return str.replace(/[@]\[/g, "<span class='text-fb'>").replace(/\]/g, "</span>")
            }catch(err){
                return str
            }
        },
        linkify(inputText) {
            var replacedText, replacePattern1, replacePattern2, replacePattern3;

            //URLs starting with http://, https://, or ftp://
            replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" class="text-fb">$1</a>');

            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" class="text-fb">$2</a>');

            //Change email addresses to mailto:: links.
            replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            return replacedText
        }
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