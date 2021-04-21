<template>
    <div class="m-5">

        <div class="grid gap-4" :class="isHide?'grid-cols-4':'grid-cols-3'">
            <div v-for="i in 30" class="bg-white shadow cursor-pointer">
                <img src="https://images.unsplash.com/photo-1618844481544-33630a9c1418?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80">
                <div class="flex p-3 items-center justify-start">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" class="h-10 rounded mr-3">
                    <div>
                        <div class="text-primary text-md">How the Derivative Works</div>
                        <div class="flex font-khmer_os text-xs opacity-50">
                            <div>លោកគ្រូ ចាន់ វុទ្ធី</div>
                            <div class="ml-7">1.6k view</div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="float-right">
                            <HeartIcon/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import HeartIcon from "./../../components/HeartIcon.vue"
    import {mapState} from "vuex"
    export default{
        components: {
            HeartIcon
        },
        computed: {
            ...mapState('setting', ['isHide'])
        }
    }
</script>