<template>
   <div>
       <eHeader></eHeader>
        <div class="h-screen  p-5 font-siemreap" :class="darkMode?`bg-youtube text-gray-300`:`bg-transparent`">
            <div v-if="loadingHelp" class="flex justify-center items-center h-screen relative -top-5">
                <h1 class="text-sm font-semibold font-khmer_os relative -top-10">
                    <loading></loading>
                </h1>
            </div>
            <div v-else>
                <div class="grid md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 text-sm">
                    <div class="cursor-pointer" v-for="(h,key) in help" :key="key" @click="getHelpDetail(h)">
                       <div :class="darkMode?`bg-secondary`:`bg-white shadow-lg`" class="rounded overflow-hidden">
                            <img :src="h.thumbnail">
                            <div class="p-4">{{h.title}}</div>
                       </div>
                    </div>
                </div>
            </div>
            <Detail v-if="showDetail" @closeAds="closeDetail" :youTubeId="youTubeId" :title="title"></Detail>
        </div>
   </div>
</template>

<script>
    import {mapActions, mapState} from "vuex"
    import Detail from "./components/Detail.vue"
    import Loading from "./../../components/Loading"
    import eHeader from "./../Video/components/Header.vue"
    const {ipcRenderer} = require('electron')
    export default{
        name: "Help",
        components: {
            Detail,
            Loading,
            eHeader
        },
        data(){
            return {
                showDetail: false,
                loading: true,
                youTubeId: "",
                title: "",
            }
        },
        computed: {
            ...mapState('help', ['help', 'loadingHelp']),
            ...mapState('setting', ['darkMode'])
        },

        methods: {
            ...mapActions('help', ['getHelp']),
            closeDetail(){
                this.showDetail = false
            },
            getHelpDetail(help){
                this.$store.commit("playVideo/getVideoUrl", help.video);
                this.title = help.title
                this.youTubeId = help.youtube_url
                this.showDetail = true
            }
        },
        created(){
            this.getHelp()
        }
    }
</script>