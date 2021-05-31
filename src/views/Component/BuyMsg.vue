<template>
    <div class="flex justify-center items-center fixed w-full h-full bg-black top-0 left-0 z-50 bg-opacity-90">
        <div class="text-base shadow font-semibold rounded-xl" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="px-5 py-4 uppercase">{{$t('please_buy_this_class_first')}}</div>
            <div class="border-b" :class="darkMode?`border-button`:``"></div>
            <div class="flex justify-between items-center px-5 h-10 font-semibold text-sm " :class="darkMode?`text-pass`:`text-primary`">
                <button class="focus:outline-none flex-1" @click="cancel">{{$t('1011')}}</button>
                <div class="border-l h-10 w-0" :class="darkMode?`border-button`:``"></div>
                <button class="focus:outline-none flex-1" @click="yes">{{$t('1008')}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
export default {
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