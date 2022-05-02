<template>
    <div class="bg-white overflow-y-scroll">
        <div v-if="loadingOther" class="flex justify-center items-center h-screen relative -top-5">
            <h1 class="text-sm font-semibold font-khmer_os relative top-0">
                <loading></loading>
            </h1>
        </div>
        <div v-else class="relative">
            <div class="w-full absolute h-10 left-0 top-0 flex items-center bg-transparent z-50">
                <div class="h-10 w-10 cursor-pointer bg-red-4000" @click="back"></div>
            </div>
            <iframe id="otherFrame" class="w-full h-screen pb-20" :srcdoc="other" ref="iframeContent"></iframe>
        </div>

    </div>
</template>

<script>
    import {mapActions, mapState} from "vuex"
    import Loading from "./../../components/Loading"
    export default{
        name: "Other",
        components: {
            Loading
        },
        computed: {
            ...mapState('other', ['other', 'loadingOther'])
        },
        methods: {
            ...mapActions('other', ['getOther']),
            back(){
                this.$router.push({
                    name:"other-refresh"
                }).catch(err=>{err})
            }
        },
        created(){
            this.getOther()
        },
    }
</script>