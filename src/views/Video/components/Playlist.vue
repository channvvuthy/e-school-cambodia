<template>
    <div class="ml-5 pt-3 px-3 h-screen overflow-y-scroll pb-60 font-khmer_os bg-cover mt-1 bg-img-primary " @scroll="onScroll">
        <div v-for="(list,index) in playlist.list" :key="index">
            <div class="flex justify-between items-center p-4 mb-3 rounded-md shadow"
            :class="list.order === order?`bg-gray-200`:darkMode?`bg-secondary text-textSecondary`:`bg-white`"
             :style="canWatch(list.free_watch)?{}:{opacity:`1`}">
                <div class="relative w-2/5 mr-3">
                    <img :src="list.thumbnail" onerror="this.onerror=null; this.src='/poster.png'" class="rounded-md "
                    @click="nextVideo(list)"
                    :title="list.title"
                    :class="canWatch(list.free_watch)?`cursor-pointer`:`cursor-default`"/>
                    <div class="absolute left-0 h-1 bg-red-600 -mt-1" v-if="list.last_watch" :style="{width:`${list.last_watch.percentage}%`}"></div>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div class="font-semibold text-primary mb-3" 
                     @click="nextVideo(list)"
                     :title="list.title"
                    :class="canWatch(list.free_watch)?`cursor-pointer ${darkMode && list.order != order?'text-skyBlue':''}`:`cursor-default ${darkMode && list.order != order?'text-skyBlue':''}`">
                        {{(index+1)+". "+cutString(list.title,40)}}
                     </div>
                    <div class="flex justify-between items-center text-sm items-center">
                        <div class="flex">
                            <Eye :width="20" :height="20" :fill="(list.order != order && darkMode)?`#afb0b4`:`#4A4A4A`"></Eye>
                            <div class="mx-2 opacity-50">{{list.view}}</div>
                            <div class="opacity-50">{{$t('1003')}}</div>
                        </div>
                        <div class="flex">
                            
                            <template v-if="canWatch(list.free_watch)">
                                <div class="mr-5 cursor-pointer"  @click="list.is_favorite?removeMyFavorite(list._id):addFavorite(list._id)">
                                    <FavoriteFill :size="20" v-if="list.is_favorite"></FavoriteFill>
                                    <FavoriteIcon :size="20" v-else :fill="(list.order != order && darkMode)?`#afb0b4`:`#4A4A4A`"></FavoriteIcon>
                                </div>
                                <div>
                                    <DownloadIcon :size="18" :fill="(list.order != order && darkMode)?`#afb0b4`:`#4A4A4A`"></DownloadIcon>
                                </div>
                            </template>
                            <div v-else>
                                <LockIcon :width="20" :height="20" :fill="(list.order != order && darkMode)?`#afb0b4`:`#4A4A4A`"></LockIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Eye from "./../../../components/Eye.vue"
import DownloadIcon from "./../../../components/DownloadIcon.vue"
import LockIcon from "./../../../components/LockIcon.vue"
import FavoriteIcon from "./../../../components/FavoriteIcon.vue"
import FavoriteFill from "./../../../components/FavoriteFill.vue"
import helper from "./../../../helper/helper"
import {mapActions,mapState} from "vuex"
export default {
    components:{
        Eye,
        DownloadIcon,
        FavoriteIcon,
        FavoriteFill,
        LockIcon
    },
    data(){
        return{
            page: 1,
        }
    },
    computed:{
        ...mapState('favorite', ['temporaryFavorites']),
        ...mapState('video', ['order','playlist']),
        ...mapState('setting', ['darkMode']),
    },
    methods:{
        ...mapActions('favorite', ['add','removeFavorite']),
        ...mapActions('video', ['getPlaylistWithPagination']),
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
    
        addFavorite(id){
            this.add(id).then(()=>{
                 this.$store.commit("video/addFavoriteVideo", id)
            })
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            let map = this.playlist.list.map(item =>item.order)
            let lastOrder = Math.max(...map)
            if (scrollTop + clientHeight >= scrollHeight) {
                this.page ++
                if(this.playlist.list !== undefined){                    
                    this.getPlaylistWithPagination({
                        p: this.page,
                        id: this.$route.params.course._id,
                        order: lastOrder
                    })
                }
            }
        },
        removeMyFavorite(id){
            this.removeFavorite(id).then(()=>{
                this.$store.commit("video/removeFavoriteVideo", id)
            })
        },
        nextVideo(video){
            if(this.canWatch(video.free_watch)){
                this.$emit("nextVideo", video);
            }
            
        },
        canWatch(free_watch){
            if((this.$route.params.course.is_buy || free_watch)){
                return true
            }
            return false
        },
        
    },
}
</script>

<style>

</style>
