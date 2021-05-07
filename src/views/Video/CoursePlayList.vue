<template>
    <div>
        <VideoHeader></VideoHeader>
        <div class="flex m-5">
            <div class="w-3/5">
                <div v-if="loading">
                    <video poster="/poster-home.png">
                        <source src=""/>
                    </video>
                </div>
                <div class="bg-white rounded-b-2xl shadow pb-2" v-else>
                    <VideoPlaylist @endedVideo="endedVideo"></VideoPlaylist>
                    <div class="mx-5 mt-6">
                        <div class="font-semibold text-primary text-base">{{ video.order }}. {{ video.title }}</div>
                            <div class="flex mt-5 text-base">
                                <div class="flex mb-3">
                                    <div class="cursor-pointer" @click="video.is_favorite?removeMyFavorite(video._id):addFavorite(video._id)">
                                        <FavoriteFill v-if="video.is_favorite" :size="24"></FavoriteFill>
                                        <FavoriteIcon v-else :size="24"></FavoriteIcon>
                                    </div>
                                    <div class="mx-3">
                                        {{$t('1109')}}
                                    </div>
                                </div>
                            <div class="flex mx-20">
                                    <div><Eye></Eye></div>
                                    <div class="mx-2">{{video.view}}</div>
                                    <div>{{$t('2107')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="flex-1">
                <div class="bg-white h-14 w-full leading-14 flex-1 ml-5 flex justify-between text-center items-center text-base font-medium">
                    <div class="flex flex-col flex-1 justify-center cursor-pointer">
                        Video   
                        <div v-if="active === 'video'" class="border border-b-4 border-gray-400"></div>
                    </div>
                    <div class="flex flex-1 justify-center cursor-pointer">
                        Document   
                    </div>
                    <div class="flex flex-1 justify-center cursor-pointer">
                        Forum   
                    </div>
                    <div class="flex flex-1 justify-center cursor-pointer">
                        Quize   
                    </div>
                
                </div>
                <Playlist :playlist="playlist" v-if="active === 'video'"  @nextVideo="nextVideo($event)"></Playlist>
            </div>
            
        </div>
    </div>
</template>
<script>
    import VideoHeader from "./components/Header.vue"
    import Playlist from "./components/Playlist.vue"
    import FavoriteIcon from "./../../components/FavoriteIcon.vue"
    import FavoriteFill from "./../../components/FavoriteFill.vue"
    import Eye from "./../../components/Eye.vue"
    import VideoPlaylist from "./ads/VideoPlaylist.vue"
    import {mapState, mapActions} from "vuex"
import { setTimeout } from 'timers';
    export default{
        data(){
            return{
                hasFree: false,
                videoUrl: "",
                video: {},
                active: "video",
                loading: false
            }
        },
        components:{
            VideoHeader,
            VideoPlaylist,
            FavoriteIcon,
            Eye,
            Playlist,
            FavoriteFill,
            
        },
        computed:{
            ...mapState('video', ['playlist'])
        },
        methods:{
            ...mapActions('video', ['getPlaylist']),
            ...mapActions('favorite', ['add','removeFavorite']),
            removeMyFavorite(id){
                this.removeFavorite(id).then(()=>{
                   this.video.is_favorite = 0 
                })
            },
            addFavorite(id){
                this.add(id).then(()=>{
                  this.video.is_favorite = 1
                })
            },
            endedVideo(){
               let nextOrder = parseInt(this.video.order) + 1
               let nextVideo = this.playlist.list.filter(item => item.order === nextOrder)
               if(nextVideo.length){
                   nextVideo = nextVideo[0]
                   if(this.canWatch(nextVideo.free_watch)){
                       this.nextVideo(nextVideo)
                   } 
               }
            },
            canWatch(free_watch){
                if((this.$route.params.course.is_buy || free_watch)){
                    return true
                }
                return false
            },
            nextVideo(event){
                this.$store.commit("video/setOrder", event.order)
                this.loading = true
                this.video = event
                this.$store.commit("playVideo/getVideoUrl", event.video);
                setTimeout(()=>{
                    this.loading = false
                },200)
               
            }
        },
        created(){
            this.loading = true
            this.getPlaylist({id:this.$route.params.course._id}).then(response =>{
                let freeVideo = response.data.data.list.filter(item => item.free_watch === 1)
                let minOrder = freeVideo.map(item => item.order)
               
                minOrder = Math.min(...minOrder)
                this.$store.commit("video/setOrder", minOrder)
                freeVideo = freeVideo.filter(item => item.order === minOrder)

                if(freeVideo.length >= 1){
                    this.hasFree = true
                    let video = freeVideo.map(item => item)[0]
                    this.video = video
                    this.$store.commit("playVideo/getVideoUrl", video.video);
                    this.loading = false
                    
                }
            })
        }

    }
</script>