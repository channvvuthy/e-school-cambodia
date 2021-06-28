<template>
    <div>
        
        <eHeader :title="'1113'"></eHeader>
        <div class="fixed w-full h-full top-0 left-0 z-50 bg-black bg-opacity-95 p-5 overflow-y-scroll flex items-center justify-center" v-if="previewStory">
            <div class="md:w-96 2xl:w-100 text-gray-300 bg-secondary rounded-lg flex flex-col justify-between relative" style="height:90%;">
                <div class="flex justify-between p-5">
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-cover mr-3" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                        <div class="flex flex-col items-center justify-start text-left text-base">
                        <div>
                            <div>{{stProfile.first_name}}  {{stProfile.last_name}}</div>
                            <vue-moments-ago prefix="" suffix="ago" :date="addedDate" lang="en" />
                        </div>
                    </div>
                    </div>
                    <div class="cursor-pointer" @click="() =>{this.previewStory = false}">
                         <CloseIcon fill="#FFF"></CloseIcon>
                    </div>
                </div>
                <div class="h-5"></div>
                <div class="overflow-y-scroll  flex-1 flex items-center justify-center">
                    <img :src="imgUrl" class="max-h-full">
                </div>
                <div class="h-5"></div>
                <div class="cursor-pointer w-full flex justify-start px-3  items-end text-sm mb-2 relative z-50"
                    >
                    <div class="flex items-center mb-4" @click="showUserViewer(gallery)">
                        <template v-if="!countView(storyDetail.viewer)">
                            <span>{{$t('no_viewers_yet')}}</span>
                        </template>
                        <template v-else>
                            <span><Eye fill="#ffffff"></Eye></span>
                            <span class="px-1"> {{countView(storyDetail.viewer)}}</span>
                            <span class="pr-1">{{$t('1004')}}</span>
                            <span><ChevronIcon fill="#ffffff" :size="18"></ChevronIcon></span>
                        </template>
                        
                    </div>
                </div>
                <!-- List viewer -->
                <div :class="darkMode?'bg-secondary text-textSecondary':'bg-white'" class="absolute z-50 left-0 w-full h-full overflow-y-scroll  rounded-xl shadow-md" @scroll="onScroll" v-if="showViewer">
                    <div class="md:w-96 2xl:w-100 top-0 sticky relative flex justify-between px-3 py-9" :class="darkMode?`bg-secondary`:`text-black bg-white`"> 
                        <div class="flex ml-5 text-xs font-semibold items-center">
                            <span><Eye :fill="darkMode?'#ffffff':'#000000'"></Eye></span>
                            <span class="px-2" :class="darkMode?`text-white`:`text-black`"> {{countView(storyDetail.viewer)}}</span>
                            <span class="pr-1" :class="darkMode?`text-white`:`text-black`">{{$t('1004')}}</span>
                        </div>
                        <div class="cursor-pointer opacity-70 z-50 relative -top-4" @click="()=>{this.showViewer = false}">
                            <close-icon :fill="darkMode?'#FFF':'#000000'"></close-icon>
                        </div>
                    </div>
                    <div>
                        <div v-for="(viewer,index) in storyDetail.viewer" :key="index" class="text-black text-xs font-semibold">
                            <div class="flex items-center mb-5 px-5">
                                <div class="w-12 h-12 rounded-full bg-cover bg-gray-200 mr-5" :style="{backgroundImage:`url(${viewer.photo})`}"></div>
                                <div :class="darkMode?'text-textSecondary':''">{{viewer.name}}</div>
                            </div>
                                
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="grid gap-5 md:grid-cols-3 2xl:grid-cols-4 p-5 h-screen pb-40 overflow-y-scroll" v-if="loading">
           <div class="max-w-sm w-full mx-auto" v-for="i in 21" :key="i">
                <div class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-4 py-1">
                        <div class="h-4 w-3/4" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                        <div class="space-y-2">
                            <div class="h-4" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                            <div class="h-4 w-5/6" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="m-5">
            <div class="h-screen pb-40 overflow-y-scroll"  @scroll="getMoreGallery($event)">
                <div :class="window.width <= 1315?`container-4`:`container-5`">
                    <div v-for="(gallery, index) in galleries" :key="index" class="cursor-pointer" @click="viewImg(gallery)">
                        <img :src="gallery.photo.name">
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import {mapState, mapActions} from "vuex"
import Loading from "./../../components/Loading.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
import Eye from "./../../components/Eye.vue"
import VueMomentsAgo from "vue-moments-ago";
import Template from '../Story/<template>.vue'

export default {
    data(){
        return{
            previewStory: false,
            imgUrl: "",
            addedDate: "",
            showViewer: false,
            id: "",
            page: 1,
            window:{
                width: null
            }
        }
    },
    components:{
        eHeader,
        Loading,
        CloseIcon,
        VueMomentsAgo,
        ChevronIcon,
        Eye,
        Template
    },
    computed:{
        ...mapState('gallery', ['loading', 'galleries']),
        ...mapState('setting',['darkMode','isHide']),
        ...mapState('auth', ['stProfile','storyDetail'])
    },
    methods:{
        ...mapActions('gallery', ['getGallery']),
        ...mapActions('auth', ['viewStory']),
         showUserViewer(gallery){
             if(this.countView(this.storyDetail.viewer)){
                this.showViewer = true
                this.id = gallery._id;
             }
            
        },
        getMoreGallery({target: {scrollTop, clientHeight, scrollHeight}}) {
             if (scrollTop + clientHeight >= scrollHeight - 1) {
                this.page ++ 
                let payload = {
                    p:this.page
                }
               payload.id = this.stProfile._id
               this.getGallery(payload)
            }
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= scrollHeight - 1 ) {
                this.page ++ 
                let payload = {
                    id:this.id,
                    p:this.page
                }

                this.viewStory(payload)
            }
        },
        countView(viewer) {
            if (typeof viewer === "object") {
                if (viewer.length) {
                return viewer.length;
                }
            }
            return false;
        },
        viewImg(gallery){
            this.id = gallery._id
            this.imgUrl = gallery.photo.name
            this.previewStory = true
            this.addedDate = gallery.date
            this.viewStory({
                id: gallery._id
            })

        },
        handleResize() {
            this.window.width = window.innerWidth;
        },
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    created(){
       
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        
        this.getGallery({
            id: this.stProfile._id
        })
    }

    
}
</script>
<style lang="scss">
    .container-5{
        columns: 5;
        img{
            width:100%;
            margin-bottom:15px;
            border-radius: 1rem;
        }
    }
    .container-4{
        columns: 4;
        img{
            width:100%;
            margin-bottom:15px;
            border-radius: 1rem;
        }
    }
    
</style>