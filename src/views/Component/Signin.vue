<template>
    <div class="p-5 bg-white mb-5 shadow">
        <div class="flex">
            <img src="/icon/icon/smile.svg" class="mr-3">
            <div class="text-base font-medium text-primary">{{$t('2003')}}</div>
        </div>
        <div class="flex justify-center text-lg">
            <div>{{$t('2006')}}</div>
        </div>
        <div class="h-10"></div>
        <div class="flex justify-center items-center">
            <div @click="goTo('login')" class="mr-5">
                <button class="box-shadow bg-primary text-white px-10 h-10 focus:outline-none rounded-lg text-sm flex justify-center items-center">
                    <span>{{$t('2007')}}</span>
                </button>
            </div>
            <div @click="goTo('register')">
                <button class="bg-white text-black box-shadow  px-10 h-10 focus:outline-none rounded-lg text-sm flex justify-center items-center">
                    <span>{{$t('2008')}}</span>
                </button>
            </div>
        </div>

    </div>
</template>
<script>
    export default{
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