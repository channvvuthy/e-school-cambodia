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
                <div class="rounded-b-2xl shadow pb-2" :class="darkMode?`bg-secondary text-textSecondary`:`bg-white `" v-else>
                    <VideoPlaylist @endedVideo="endedVideo" @lastWatchVideo="lastWatchVideo($event)"></VideoPlaylist>
                    <div class="mx-5 mt-6">
                        <div class="font-semibold text-base" :class="darkMode?`text-skyBlue`:`text-primary`">{{ video.order }}. {{ video.title }}</div>
                            <div class="flex mt-5 text-base">
                                <div class="flex mb-3">
                                    <div class="cursor-pointer" @click="video.is_favorite?removeMyFavorite(video._id):addFavorite(video._id)">
                                        <FavoriteFill v-if="video.is_favorite" :size="24"></FavoriteFill>
                                        <FavoriteIcon v-else :size="24" :fill="darkMode?`#afb0b4`:`#4A4A4A`"></FavoriteIcon>
                                    </div>
                                    <div class="mx-3">
                                        {{$t('1109')}}
                                    </div>
                                </div>
                            <div class="flex mx-20">
                                    <div><Eye :fill="darkMode?`#afb0b4`:`#4A4A4A`"></Eye></div>
                                    <div class="mx-2">{{video.view}}</div>
                                    <div>{{$t('1003')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="flex-1">
                <div class="h-14 w-full leading-14 flex-1 ml-5 flex justify-between text-center items-center text-base font-medium" :class="darkMode?`bg-secondary text-textSecondary`:`bg-white`">
                    <div @click="switchMenu('video')" class="flex flex-col flex-1 justify-center cursor-pointer relative h-full" :class="active === 'video'?darkMode?`text-skyBlue`:`text-primary`:``" >
                        {{ $t('2108') }}   
                        <div v-if="active === 'video'" class="m-auto w-full rounded absolute bottom-0 h-1">
                            <div class="h-full h-1 w-10/12 m-auto" :class="active === 'video'?darkMode?`bg-skyBlue`:`bg-primary`:``"></div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 justify-center cursor-pointer relative h-full" @click="switchMenu('document')" :class="active === 'document'?darkMode?`text-skyBlue`:`text-primary`:``">
                        {{ $t('1112') }}   
                        <div v-if="active === 'document'" class="m-auto w-full rounded absolute bottom-0 h-1">
                            <div class="h-full h-1 w-10/12 m-auto" :class="active === 'document'?darkMode?`bg-skyBlue`:`bg-primary`:``"></div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 justify-center cursor-pointer relative h-full" @click="switchMenu('forum')" :class="active === 'forum'?darkMode?`text-skyBlue`:`text-primary`:``">
                        {{ $t('2110') }} 
                        <div v-if="active === 'forum'" class="m-auto w-full rounded absolute bottom-0 h-1">
                            <div class="h-full h-1 w-10/12 m-auto" :class="active === 'forum'?darkMode?`bg-skyBlue`:`bg-primary`:``"></div>
                        </div>  
                    </div>
                    <div class="flex flex-col flex-1 justify-center cursor-pointer relative h-full" @click="switchMenu('quiz')" :class="active === 'quiz'?darkMode?`text-skyBlue`:`text-primary`:``">
                        {{ $t('2111') }}
                        <div v-if="active === 'quiz'" class="m-auto w-full rounded absolute bottom-0 h-1">
                            <div class="h-full h-1 w-10/12 m-auto" :class="active === 'quiz'?darkMode?`bg-skyBlue`:`bg-primary`:``"></div>
                        </div>   
                    </div>
                
                </div>
                <Playlist v-if="active === 'video'"  @nextVideo="nextVideo($event)"></Playlist>
                <Document v-if="active === 'document'" :id="video._id"></Document>
            </div>
            
        </div>
    </div>
</template>
<script>
    import VideoHeader from "./components/Header.vue"
    import Playlist from "./components/Playlist.vue"
    import Document from "./components/Document.vue"
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
            Document
            
        },
        computed:{
            ...mapState('video', ['playlist']),
            ...mapState('setting', ['darkMode']),
        },
        methods:{
            ...mapActions('video', ['getPlaylist']),
            ...mapActions('playVideo', ['playVideo','stopWatch']),
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
                if(event.order === this.video.order){
                    return
                }

                if(event.last_watch){
                    this.$store.commit("playVideo/setLastWatched", event.last_watch.mark)
                }else{
                    this.$store.commit("playVideo/setLastWatched", 0)
                }

                this.$store.commit("video/setOrder", event.order)
                this.loading = true
                this.video = event
                this.$store.commit("playVideo/getVideoUrl", event.video);
                setTimeout(()=>{
                    this.loading = false
                },200)
               
            },
            lastWatchVideo(event){
                event.id = this.video._id
                this.stopWatch(event).then(() =>{
                    let percentage = (event.mark*100)/event.duration 
                    percentage = Math.round(percentage)
                    event.percentage = percentage
                    this.$store.commit("video/updatingProgressbar", event)
                })
            },
            switchMenu(active){
                this.active = active
            }
        },
        created(){
            this.loading = true

            this.getPlaylist({id:this.$route.params.course._id}).then(response =>{
                let freeVideo = response.data.data.list.filter(item => item.free_watch === 1)
                let order
                if(this.$route.params.course.last_watch){
                    order = this.$route.params.course.last_watch.order
                    this.$store.commit("playVideo/setLastWatched", this.$route.params.course.last_watch.mark)
                }else{
                    order = freeVideo.map(item => item.order)
                    order = Math.min(...order)
                    this.$store.commit("playVideo/setLastWatched", 0)

                }
                this.$store.commit("video/setOrder", order)
                freeVideo = freeVideo.filter(item => item.order === order)

                if(freeVideo.length >= 1){
                    this.hasFree = true
                    let video = freeVideo.map(item => item)[0]
                    this.video = video
                    this.$store.commit("playVideo/getVideoUrl", video.video);
                    this.loading = false
                    this.playVideo(this.video._id)
                    
                }
            })
        }

    }
</script>