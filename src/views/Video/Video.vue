<template>
    <div class="overflow-y-scroll h-screen">
        <BoxFilter></BoxFilter>
        <div class="mt-5 px-5">
            <div v-if="loading">
                <Loading></Loading>
            </div>
            <div v-else>
                <div class="grid gap-4" :class="isHide?`grid-cols-4`:`grid-cols-3`">
                    <div v-for="(video, index) in videos.list" :key="index">
                        <div class="relative rounded-2xl" :class="darkMode?`bg-secondary text-textSecondary`:`bg-white shadow`">
                            <img :src="video.thumbnail" class="rounded-t-2xl" onerror="this.onerror=null; this.src='http://staging-admin.e-schoolcambodia.com/files/img/202007z5ec27d8281768d3272313b9cm1594720414m9181.png'"/>
                            <div class="flex flex-col relative w-full justify-center items-center -top-10 px-5">
                               <div class="w-14 h-14 rounded-md bg-cover bg-gray-300" :style="{backgroundImage:`url(${video.teacher.photo})`}"></div>
                               <div class="text-sm font-semibold mt-2">{{video.teacher.name}} ({{ video.title }})</div>
                               <div class="w-full flex justify-between">
                                   <div><YoutubeIcon :fill="darkMode?`#afb0b4`:`#000000`"></YoutubeIcon></div>
                                   <div><YoutubeIcon></YoutubeIcon></div>
                                   <div><YoutubeIcon></YoutubeIcon></div>
                                   <div><CertificateIcon></CertificateIcon></div>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BoxFilter from "./components/Filter.vue"
import Loading from "./../../components/Loading.vue"
import CertificateIcon from "./../../components/CertificateIcon.vue"
import YoutubeIcon from "./../../components/YoutubeIcon.vue"
import {mapState, mapActions} from "vuex"
export default {
    components:{
        BoxFilter,
        Loading,
        CertificateIcon,
        YoutubeIcon
    },
    computed:{
        ...mapState("video", ["videos", "loading"]),
        ...mapState("setting", ["darkMode","isHide"]),
    },
    methods:{
        ...mapActions('video', ['getVideo'])
    },

    created(){
        this.getVideo({filter_id:""}).then(response =>{
            console.log(response.data.data)
        })
    }

}
</script>

<style>

</style>
