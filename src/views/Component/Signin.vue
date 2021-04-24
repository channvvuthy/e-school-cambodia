<template>
    <div class="px-5" @click="goTo('login')">
        <button class="bg-primary text-white px-3 h-11 focus:outline-none rounded text-sm flex justify-center items-center">
            <div class="mr-3">
                <KeyIcon></KeyIcon>
            </div>
            <span>{{$t('2007')}}</span>
        </button>
    </div>
</template>
<script>
    import KeyIcon from "./../../components/KeyIcon.vue"
    export default{
        components: {
            KeyIcon
        },
        methods: {
            goTo(page){
                this.$router.push({name: page})
            }
        }
    }
</script>