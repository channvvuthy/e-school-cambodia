<template>
    <div>
        <div class="chevron absolute bottom-4 w-10 h-10 overflow-hidden" style="left:-2.44rem;" v-if="!isMind">
            <img :src="darkMode?`chevron-dark.png`:`chevron.png`" class="absolute left-3">
        </div>
        <div class="relative">
            {{message.content.text}}
        </div>
         <div class="chevron absolute bottom-4 w-10 h-10 overflow-hidden" v-if="isMind" :style="darkMode?{right:`-2rem`}:{right:`-2.3rem`}">
            <img :src="darkMode?`chevron-right-dark.png`:`chevron-right.png`" class="absolute right-0" style="transform: rotate(-5deg);" v-if="darkMode">
            <img :src="darkMode?`chevron-right-dark.png`:`chevron-right.png`" class="absolute right-0" style="transform: rotate(-7deg);" v-else>
        </div>
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
    }
}
</script>