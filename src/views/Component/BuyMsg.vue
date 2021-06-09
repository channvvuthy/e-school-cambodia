<template>
    <div class="flex justify-center items-center fixed w-full h-full bg-black top-0 left-0 z-50 bg-opacity-95" style="z-index:57">
        <div class="text-sm shadow rounded-xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="px-5 py-4 text-center">{{$t(msg)}}</div>
            <div class="border-b" :class="darkMode?`border-button`:``"></div>
            <div class="grid grid-cols-3  items-center px-5 h-10 text-sm w-full" :class="darkMode?`text-white`:`text-primary`">
                <button class="focus:outline-none font-semibold" @click="cancel">{{$t('1011')}}</button>
                <div class="border-l h-10 w-0 m-auto" :class="darkMode?`border-button`:``"></div>
                <button class="focus:outline-none font-semibold whitespace-nowrap" @click="yes">{{$t('1008')}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
export default {
    props:{
        msg:{
            default:()=>{
                return 'please_buy_this_class_first'
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        cancel(){
            this.$emit("cancelModal")
        },
        yes(){
            this.$emit("yes")
        }
    }
}
</script>