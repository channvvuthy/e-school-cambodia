<template>
    <div class="ml-5 mt-3 h-screen overflow-y-scroll pb-60 font-khmer_os">
        <div v-for="(list,index) in playlist.list" :key="index">
            <div class="flex justify-between items-center bg-white p-4 mb-3 rounded-md shadow">
                <img :src="list.thumbnail" onerror="this.onerror=null; this.src='/poster.png'" class="w-2/5 rounded-md mr-3 cursor-pointer"/>
                <div class="flex-1">
                    <div class="font-semibold text-primary cursor-pointer"> {{(index+1)+". "+cutString(list.title,40)}}</div>
                    <div class="flex mt-3 justify-between items-center">
                        <div class="flex">
                            <Eye :width="22" :height="22"></Eye>
                            <div class="mx-2 opacity-50">{{list.view}}</div>
                            <div class="opacity-50">{{$t('2107')}}</div>
                        </div>
                        <div class="flex">
                            <div class="mr-5 cursor-pointer"  @click="list.is_favorite?removeMyFavorite(list._id):addFavorite(list._id)">
                                <FavoriteFill :size="22" v-if="list.is_favorite"></FavoriteFill>
                                <FavoriteIcon :size="22" v-else></FavoriteIcon>
                            </div>
                            <div>
                                <DownloadIcon :size="20"></DownloadIcon>
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
import FavoriteIcon from "./../../../components/FavoriteIcon.vue"
import FavoriteFill from "./../../../components/FavoriteFill.vue"
import helper from "./../../../helper/helper"
import {mapActions,mapState} from "vuex"
export default {
    components:{
        Eye,
        DownloadIcon,
        FavoriteIcon,
        FavoriteFill
    },
    props:{
        playlist:{
            default:() =>{
                return []
            }
        }
    },
    computed:{
        ...mapState('favorite', ['temporaryFavorites'])
    },
    methods:{
        ...mapActions('favorite', ['add', 'removeMyFavorite','removeFavorite']),
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
    
        addFavorite(id){
            this.add(id).then(()=>{
                 
            })
        },
        removeMyFavorite(id){
            this.removeFavorite(id).then(()=>{
                
            })
        },
    }
}
</script>

<style>

</style>
