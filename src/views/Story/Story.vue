<template>
    <div class="bg-white shadow">
        <div class="px-5 py-5">
            <div class="flex text-primary  text-md gap-4">
                <div>
                    <img src="/icon/icon/smile.svg" class="mr-3">
                </div>
                <div class="text-base font-medium">{{$t('2003')}} <span>
                    {{token ? stProfile.first_name + " " + stProfile.last_name : $t('1127')}}
                </span></div>
            </div>
            <div class="list mt-5">
                <div class="w-full overflow-x-scroll flex overflow-y-hidden box-list-story" @scroll="onScroll">
                    <div class="text-center text-sm mr-5 relative">
                        <div class="box-story relative h-36 bg-black w-24 rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden relative">
                            <div class="absolute w-full h-full bg-black bg-opacity-30"></div>
                            <img :src="stProfile.photo" class="max-w-full">

                        </div>
                        <div class="bg-primary w-7 h-7 rounded-full flex justify-center items-center absolute -right-2 bottom-7 cursor-pointer">
                            <AddIcon :size="16"/>
                        </div>
                        <p class="mt-3" :class="localize==='en'?'text-sm':'text-xs'">
                            {{$t('2004')}}
                        </p>
                    </div>
                    <div class="text-center text-sm mr-5 relative" v-for="(my_story,index) in story" :key="index" @click="getStoryDetail(my_story,index)">
                        <div class="w-10 h-10 border-3 border-primary rounded-full bg-cover absolute z-50 left-2 top-2 bg-white flex justify-center items-center"
                             :style="{backgroundImage:`url(${my_story.user.photo})`}"
                        >
                        </div>
                        <div class="box-story relative h-36 bg-black w-24 bg-cover rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden relative"
                             :style="{backgroundImage:`url(${my_story.photo.name})`}"
                        >
                            <div class="absolute w-full h-full bg-black bg-opacity-30"></div>
                        </div>
                        <p class="mt-3 font-medium">{{my_story.user.name}}</p>
                    </div>
                </div>
            </div>
        </div>
        <StoryDetail v-if="showStory" @closeStory="closeStory"></StoryDetail>
    </div>
</template>

<script>
    import AddIcon from "./../../components/AddIcon.vue"
    import StoryDetail from "./StoryDetail.vue"
    import {mapState, mapActions} from "vuex"
    export default{
        components: {
            AddIcon,
            StoryDetail
        },
        data(){
            return{
                page: 1,
                showStory:false
            }
        },
        computed: {
            ...mapState('setting', ['localize']),
            ...mapState('auth', ['token', 'stProfile', 'story','loadingStory'])
        },
        methods: {
            ...mapActions('auth', ['getStory','viewStory']),
            onScroll ({target: {scrollLeft, clientWidth, scrollWidth}}) {
                if (scrollLeft + clientWidth >= scrollWidth) {
                    this.page ++
                    this.getStory(this.page).then(response =>{
                        console.log(response.data.data)
                    });
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
            }
        },
        created(){
            this.getStory()
        }
    }
</script>
<style scoped>
    .box-list-story::-webkit-scrollbar {
        display: none;
    }
</style>