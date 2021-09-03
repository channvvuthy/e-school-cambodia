<template>
    <div>
        <eHeader :title="'4120'"></eHeader>
        <div class="p-5">
            <div v-if="loadingStory">
                <Loading></Loading>
            </div>
            <div v-else>
                <div class="h-screen pb-40 overflow-y-scroll" @scroll="onScroll">
                    <div class="grid gap-5" :class="isHide?`md:grid-cols-6 2xl:grid-cols-8`:`md:grid-cols-5 2xl:grid-cols-6`">
                        <div v-for="(st, index) in story" :key="index" class="cursor-pointer relative rounded-xl overflow-hidden" @click="getStoryDetail(st, index)">
                            <div class="w-11 h-11 border-3 rounded-full bg-cover absolute z-40 left-2 top-2 flex justify-center items-center bg-white"
                                :class="darkMode?`border-fb`:`border-fb`"
                                :style="{backgroundImage:`url(${st.user.photo})`}">
                            </div>
                            <div class="h-64 w-full bg-cover bg-center"  :style="{backgroundImage:`url(${st.photo.name})`}"></div>
                            <div class="mt-3 whitespace-nowrap absolute bottom-0 left-0 w-full bg-gradient-to-t from-black h-full text-white flex justify-start items-end text-sm p-3" :title="st.user.name">{{cutString(st.user.name,15)}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <StoryDetail v-if="showStory" @closeStory="closeStory"></StoryDetail>
    </div>
</template>
<script>
import eHeader from "./components/eHeader.vue"
import Loading from "./../../components/Loading.vue"
import {mapState, mapActions} from "vuex"
import helper from "./../../helper/helper"
import StoryDetail from "./../Story/StoryDetail.vue"
export default {
    components:{
        eHeader,
        Loading,
        StoryDetail
    },
    computed: {
        ...mapState('setting', ['localize','darkMode','isHide']),
        ...mapState('auth', ['token', 'stProfile', 'story'])
    },
    data(){
        return{
             window:{
                width: null
            },
            enableScroll: true,
            page: 1,
            showStory: false,
            loadingStory: false
        }
    },
    methods: {
        ...mapActions('auth', ['getStory','viewStory','addMyStory']),
        handleResize() {
            this.window.width = window.innerWidth;
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                this.page ++ 
            
                if(this.enableScroll){
                    this.getStory(this.page).then(res =>{
                        if(res.data.data.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
        getStoryDetail(story,index = 0){
            let payload = {id:story._id}
            this.$store.commit("auth/setStoryIndex", index);
            this.viewStory(payload).then(()=>{
                this.showStory = true
            });
        },
        closeStory(){
            this.showStory = false
        },
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    created(){
        this.loadingStory = true
        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        this.getStory().then(()=>{
            this.loadingStory = false
        })
    }
}
</script>