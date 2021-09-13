<template>
    <div class="p-5 mb-5 shadow" :class="darkMode?`bg-youtube text-gray-300`:`bg-white `">
        <div class="flex">
            <div class="mr-3"><SmileIcon :fill="darkMode?`#ffffff`:`#055174`"></SmileIcon></div>
            <div class="text-base font-medium uppercase" :class="darkMode?`text-white`:`text-primary`">{{$t('2003')}}</div>
        </div>
        <div class="flex justify-center text-lg">
            <div>{{$t('2006')}}</div>
        </div>
        <div class="h-10"></div>
        <div class="flex justify-center items-center">
            <div @click="goTo('login')" class="mr-5">
                <button class="px-10 h-10 focus:outline-none rounded-lg text-sm flex justify-center items-center text-white" :class="darkMode?`bg-button`:`box-shadow bg-primary`">
                    <span>{{$t('2007')}}</span>
                </button>
            </div>
            <div @click="goTo('register')">
                <button class="px-10 h-10 focus:outline-none rounded-lg text-sm flex justify-center items-center" :class="darkMode?`bg-button text-white`:`bg-white text-black box-shadow `">
                    <span>{{$t('2008')}}</span>
                </button>
            </div>
        </div>

    </div>
</template>
<script>
    import {mapState} from "vuex"
    import SmileIcon from "./../../components/SmileIcon.vue"

    export default{
        components:{
            SmileIcon
        },
        computed:{
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            goTo(page){
                this.$router.push({name: page})
            }
        }
    }
</script>
<style>
    .box-shadow {
        box-shadow: 4px 4px 6px #E5E7EB;
        position: relative;
    }

    .box-shadow:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        box-shadow: -1px -1px 6px #E5E7EB;
        border-radius: 0.5rem;
    }
</style>