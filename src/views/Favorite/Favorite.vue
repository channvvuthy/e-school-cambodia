<template>
    <div>
       <div class="mt-3">
           <div class="px-5 pt-7 shadow-md text-sm" :class="darkMode?`bg-secondary border-t border-b border-button text-textSecondary`:`bg-white text-black`">
                <!-- Tab -->
                <div class="mt-7 px-3">
                    <div class="flex justify-start">
                        <div @click="changeType('video')" class="cursor-pointer  w-12 text-center" :class="type==`video`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{$t('2108')}}</div>
                            <div v-if="type === `video`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"></BorderBottom>
                            </div>
                        </div>
                        <div @click="changeType('book')" class="cursor-pointer ml-20 w-24 text-center" :class="type==`book`?`text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{$t('2202')}}</div>
                            <div v-if="type === `book`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"></BorderBottom>
                            </div>
                        </div>
                        
                    </div>
                </div>
           </div>
       </div>
       <div class="p-5">
           <div v-if="loading">
               <Loading></Loading>
           </div>
           
           <div v-else class="h-screen pb-72 overflow-y-scroll" @scroll="onScroll">
               
               <!-- Video -->
                <template v-if="type === `video`">
                     <div v-if="favoritedVideo.length == 0" class="h-screen pb-10" style="display:block;">
                        <Empty></Empty>
                    </div>
                    <div class="grid gap-4" :class="isHide?'md:grid-cols-4 2xl:grid-cols-5':'md:grid-cols-3 2xl:grid-cols-4'">
                            <div v-for="(view,index) in favoritedVideo" class="cursor-pointer rounded overflow-hidden" :key="index" :class="darkMode?'text-textSecondary':'bg-white shadow'">
                            <div class="relative" @mouseover="hideAndShowDuration(view._id)" @mouseleave="hideAndShowDuration('')" @click="viewVideo(view)">
                                    <div class="absolute z-30 w-full h-full flex justify-center items-center">
                                        <video :src="playWhenOver(view.video)" autoplay="autoplay"
                                            class="flex justify-center items-center"
                                            controlsList="nodownload" v-if="hideDuration===view._id" muted></video>
                                    </div>
                                    <img :src="view.thumbnail">
                                    <div class="absolute bottom-0 left-0 bg-red-600 h-1" v-if="view.last_watch" :style="{width:Math.round(view.last_watch.percentage) + `%`}"></div>
                                    <div class="absolute right-3 bottom-2 rounded px-2 py-1 bg-black text-white bg-opacity-60 text-xs"
                                    v-if="millisToMinutesAndSeconds(view.duration)">
                                    {{millisToMinutesAndSeconds(view.duration)}}
                                    </div>
                            </div>
                                
                                <div class="flex items-center justify-start cursor-text" :class="darkMode?`py-3`:`p-3`">
                                    <img :src="view.teacher.photo" class="h-10 rounded mr-3">
                                    <div>
                                        <div class="text-primary text-sm" :class="darkMode?'text-white':''">{{cutString(view.title,20)}}</div>
                                        <div class="flex font-khmer_os text-xs" :class="darkMode?`text-gray-400`:`opacity-50`">
                                            <div>{{view.teacher.name}}</div>
                                            <div class="ml-7">{{ kFormatter(view.view) }} view</div>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="float-right cursor-pointer">
                                            <div @click="confirmRemoveFavorite(view._id)">
                                                <FavoriteFill :fill="darkMode?`#ffffff`:`#c0272d`"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </template>
                <!-- Book -->
                <template v-else>
                    <div v-if="favoritedBook.length == 0" class="h-screen pb-10" style="display:block;">
                        <Empty></Empty>
                    </div>
                    <div class="grid gap-4" :class="isHide?'md:grid-cols-3 2xl:grid-cols-4':'md:grid-cols-2 2xl:grid-cols-3'">
                        <div v-for="(book, index) in favoritedBook" :key="index">
                            <div class="flex rounded-xl shadow p-4 relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                                <img :src="book.thumbnail" class="rounded-xl max-h-36 cursor-pointer" @click="getDetail(book)"/>
                                <div class="absolute left-5 top-5" v-if="book.is_new"><NewIcon :size="22"></NewIcon></div>
                                <div class="px-3 flex flex-col justify-between">
                                    <div class="font-thin text-sm cursor-pointer" @click="getDetail(book)">
                                        <div>{{cutString(book.title,25)}}</div>
                                        <div v-if="book.des" class="text-xs my-3">{{cutString(book.des,90)}}</div>
                                    </div>
                                    <div class="text-xs"><span v-if="book.price.year">{{$t('1006')}}:</span><span :class="darkMode?``:`text-heart`">{{book.price.year?`${book.price.year}$`:`${$t('1007')}`}}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-between flex-1 items-end">
                                    <div @click="confirmRemoveFavorite(book._id)" class="cursor-pointer">
                                        <FavoriteFill :fill="darkMode?`#ffffff`:`#c0272d`"/>
                                    </div>
                                    <div v-if="book.price.year" @click="addToCart(book)" class="cursor-pointer">
                                        <div v-if="!book.is_in_cart"><CartIcon :fill="darkMode?`#909090`:`#4A4A4A`"></CartIcon></div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <BuyMsg v-if="confirm" @cancelModal="cancelModal" @yes="yes" :msg="msg"></BuyMsg>
         <div v-if="showAds">
            <VideoADS :videoUrl="videoUrl" @closeAds="closeAds" @lastWatchVideo="lastWatchVideo($event)"></VideoADS>
        </div>
        <ReadingBook v-if="reading" @closeReading="closeReading"></ReadingBook>
        <ViewBook v-if="preview" @close="close" @readingBook="readingBook" @shopNow="shopNow" @listenAudio="listenAudio" @listVideo="listVideo"></ViewBook>
        <LibraryAudio v-if="showAudio" :is_favorite="false"></LibraryAudio>
        <Cart v-if="showCart" @closeCart="()=>{this.showCart = false}" @showInvoice="showInvoice"></Cart>
        <!-- Receipt info -->
        <ReceiptInfo v-if="showReceipt" :receiptDetail="receiptDetail" @closeInfo="() =>{this.showReceipt = false}"></ReceiptInfo>
    </div>
</template>

<script>
import eHeader from "./../Video/components/Header.vue"
import BorderBottom from "./../../components/BorderBottom.vue"
import Loading from "./../../components/Loading.vue"
import CartIcon from "./../../components/CartIcon.vue"
import FavoriteFill from "./../../components/FavoriteFill.vue";
import helper from "./../../helper/helper"
import BuyMsg from "./../Component/BuyMsg.vue"
import Empty from "./../Component/Empty.vue"
import Cart from "./../Component/Cart.vue"
import ReceiptInfo from "./..//MyCourse/components/ReceiptInfo.vue"
import VideoADS from "./../Video/ads/VideoADS.vue"
import ReadingBook from "./../Library/components/book/ReadingBook.vue"
import ViewBook from "./../Library/components/book/ViewBook.vue"
import NewIcon from "./../../components/NewIcon.vue"
import LibraryAudio from "./../Library/Audio.vue"

import {mapState, mapActions} from "vuex"
export default {
    components:{
        eHeader,
        BorderBottom,
        Loading,
        FavoriteFill,
        BuyMsg,
        VideoADS,
        CartIcon,
        ReadingBook,
        ViewBook,
        NewIcon,
        LibraryAudio,
        Cart,
        Empty,
        ReceiptInfo
    },
    computed:{
        ...mapState('setting', ['darkMode','isHide']),
        ...mapState('favorite' ,['loading', 'favoritedVideo', 'favoritedBook']),
        ...mapState('library', ['details']),
    },
    data(){
        return{
            title: '1109',
            type:'video',
            page: 1,
            enableScroll: true,
            confirm: false,
            id: null,
            msg: "delete",
            preview: false,
            hideDuration: "",
            showAds: false,
            videoUrl: "",
            reading: false,
            showAudio: false,
            showCart: false,
            receiptDetail:{},
            showReceipt: false
        }
    },
    methods:{
        ...mapActions('favorite', ['getVideoFavorite', 'getBookFavorite','removeFavoriteVideo', 'removeFavoriteBook']),
        ...mapActions("playVideo", ["stopWatch", "playVideo"]),
        ...mapActions('cart', ['addCart','getCart']),
        ...mapActions('library', ['getLibraryDetail']),

        changeType(type){
            this.enableScroll = true
            this.type = type

            if(type === 'video'){
                this.getVideoFavorite({
                    p: this.page,
                })
            }else{
                this.getBookFavorite({
                    p: this.page,
                })
            }
        },
        playWhenOver(video) {
            if (typeof video === "object") {
                let len = video.length - 1;
                return video[len]["url"];
            }
            return false;
        },
         lastWatchVideo(event) {
            event.id = this.id;
            this.stopWatch(event);
        },
         showInvoice(data){
            this.receiptDetail = data
            this.showReceipt = true
            this.showCart = false
        },
        addToCart(book){
            let payload = {}
            payload.id = book._id
            this.addCart(payload).then(() =>{
                this.getCart()
            })
            this.$store.commit("favorite/addToCart",book._id)
        },
        viewVideo(video) {
            this.id = video._id;
            this.playVideo(this.id);
            this.showAds = true;

            if(video.last_watch){
                this.$store.commit('playVideo/setLastWatched',video.last_watch.mark)
            }

            this.$store.commit("playVideo/getVideoUrl", video.video);
        },
        close(){
            this.preview = false
        },
        shopNow(){
            this.preview = false
            let payload = {}
            payload.id = this.details._id

            this.addCart(payload).then(() =>{
                this.getCart()
                this.showCart = true
                
            })
        },
        closeReading(){
            this.reading = false
        },
        listVideo(){
            this.$router.push('library-video')
            this.close()
        },
        readingBook(){
            this.reading = true
            this.showAudio = false
            this.close()
        },
        closeAds() {
            this.showAds = false;
        },
        kFormatter(num){
            return helper.kFormatter(num)
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        getDetail(library){
            this.getLibraryDetail({id:library._id}).then(() =>{
                this.preview = true
            })
        },
        hideAndShowDuration(id = "") {
            this.hideDuration = id;
        },
        millisToMinutesAndSeconds(millis) {
            if (millis !== undefined) {
                let minutes = Math.floor(millis / 60000);
                let seconds = ((millis % 60000) / 1000).toFixed(0);
                return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            }
            return false;
        },
        confirmRemoveFavorite(id){
            this.confirm = true
            this.id = id
        },
        cancelModal(){
            this.confirm = false
        },
        yes(){
            if(this.type === `video`){
                this.removeFavoriteVideo(this.id).then(() =>{
                    this.confirm = false
                })
            }else{
                this.removeFavoriteBook(this.id).then(() =>{
                    this.$store.commit('favorite/removeFavoriteBook',this.id)
                    this.confirm = false
                })
            }
            
        },
        listenAudio(){
            this.showAudio = false
            setTimeout(()=>{
                this.showAudio = true
            },100)
            this.close()
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= scrollHeight) {
                this.page ++ 

                let payload = {}

                payload.p = this.page
                payload.paginate = 1

                if(this.enableScroll){
                    if(this.type === `video`){
                        this.getVideoFavorite(payload).then(res =>{
                            if(res.data.data.length <= 0){
                                this.enableScroll = false
                            }
                        })
                    }else{
                        this.getBookFavorite(payload).then(res =>{
                            if(res.data.data.length <= 0){
                                this.enableScroll = false
                            }
                        })
                    }
                }
            }
        },

    },
    created(){
        this.getVideoFavorite({
            p: this.page,
        })
    }

    
}
</script>