<template>
    <div class="fixed w-full h-full bg-black left-0 bg-opacity-80 top-0 flex items-center justify-center" style="z-index:100">
        <div class="max-w-screen-lg m-auto px-10 py-5 shadow rounded-2xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex items-center">
                <div class="absolute right-5 top-5 cursor-pointer" @click="close"><CloseIcon :fill="darkMode?`#909090`:`#000000`"></CloseIcon></div>
                <img :src="details.book.thumbnail" class="max-w-xs rounded-2xl shadow-md">
                <div class="absolute top-10 left-14 w-8 h-8 flex items-center justify-center rounded-md" :class="darkMode?`bg-secondary`:`bg-white`" v-if="is_favorite">
                    <div v-if="details.is_favorite" class="cursor-pointer" @click="removeFromFavorite(details)">
                        <FavoriteFill :fill="darkMode?`#ffffff`:`#c0272d`"/>
                    </div>
                    <div v-else class="cursor-pointer" @click="addToFavorite(details)">
                        <FavoriteIcon :fill="darkMode?`#ffffff`:`#0f3c7a`"/>
                    </div>
                </div>
                <div class="flex flex-col ml-14 justify-start">
                    <div class="text-base font-bold mb-5">{{details.book.title}}</div>
                    <template v-if="details.price.year">
                        <div class="mb-5">{{$t('1006')}}: <span class="text-heart font-bold">{{details.price.year}}$</span></div>
                    </template>
                    <template>
                        <div class="font-bold mb-5">{{$t('1007')}}</div>
                    </template>
                    <div class="border-t border-dashed mb-5"></div>
                    <div class="text-sm mb-5">{{$t('book_detail')}}</div>
                    <div class="text-sm mb-5 max-h-48 overflow-y-scroll">
                        <span v-if="details.book.des">{{details.book.des}}</span>
                        <span v-else>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                        </span>
                    </div>
                    <div class="flex text-sm">
                        <button class="h-12 rounded-lg bg-primary px-7 text-white focus:outline-none flex items-center mr-10 shadow-lg" v-if="details.book.type === `pdf`" @click="readingBook">
                            <div class="mr-3"><ReadingBookIcon fill="#ffffff"></ReadingBookIcon></div>
                            <span>{{$t('1118')}}</span>
                        </button>
                        <button class="h-12 rounded-lg bg-primary px-7 text-white focus:outline-none flex items-center mr-10 shadow-lg" v-if="details.book.type === `sound`" @click="listenAudio(details)">
                            <div class="mr-3"><HeadphoneIcon fill="#ffffff"></HeadphoneIcon></div>
                            <span>{{$t('2208')}}</span>
                        </button>
                        <button class="h-12 rounded-lg bg-primary px-7 text-white focus:outline-none flex items-center mr-10 shadow-lg whitespace-nowrap" v-if="details.book.type === `video`" @click="listVideo">
                            <div class="mr-3"><CameraVideoIcon fill="#ffffff"></CameraVideoIcon></div>
                            <span>{{$t('2209')}}</span>
                        </button>
                        <button class="h-12 rounded-lg bg-primary px-8 text-white focus:outline-none flex items-center shadow-lg whitespace-nowrap" @click="shopNow" v-if="details.price.year">
                            <span v-if="details.is_buy === 1">{{$t('renewal')}}</span>
                            <span v-else>{{$t('2206')}}</span>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
        <BuyMsg v-if="showMsg" :msg="$t(`no_audio`)" @yes="yes" @cancelModal="cancelModal"></BuyMsg>
    </div>
</template>
<script>
import {mapState,mapActions} from "vuex"
import CloseIcon from "./../../../../components/CloseIcon"
import ReadingBookIcon from "./../../../../components/ReadingBookIcon"
import HeadphoneIcon from "./../../../../components/HeadphoneIcon"
import CameraVideoIcon from "./../../../../components/CameraVideoIcon"
import BuyMsg from "./../../../../views/Component/BuyMsg.vue"
import FavoriteIcon from "./../../../../components/FavoriteIcon.vue"
import FavoriteFill from "./../../../../components/FavoriteFill.vue"

export default {
    name:"ViewBook",
    props:{
        is_favorite:{
            default:()=>{
                return false
            }
        }
    },
    data(){
        return{
            showMsg: false
        }
    },
    components:{
        CloseIcon,
        ReadingBookIcon,
        HeadphoneIcon,
        CameraVideoIcon,
        BuyMsg,
        FavoriteIcon,
        FavoriteFill,
    },
    computed:{
        ...mapState('library', ['details', 'loadingDetail']),
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('favorite', ['addFavoriteBook','removeFavoriteBook']),
        close(){
            this.$emit("close")
        },
        readingBook(){
            this.$emit("readingBook")
        },
        listenAudio(details){
            if(details.list.length){
                this.$emit('listenAudio', details)
            }else{
                this.showMsg = true
            }
        },
        yes(){
            this.showMsg = false
        },
        cancelModal(){
            this.showMsg = false
        },
        listVideo(){
            this.$emit("listVideo")
        },
        shopNow(){
            this.$emit("shopNow")
        },
        addToFavorite(book){
            this.addFavoriteBook(book._id).then(() =>{
                this.$store.commit("library/addToFavorite", book._id)
            })
        },
        removeFromFavorite(book){
            this.removeFavoriteBook(book.filter_id).then(() =>{
                this.$store.commit("library/removeFromFavorite", book._id)
            })
        },
    }
}
</script>