<template>
    <div class="fixed w-full h-full bg-black left-0 bg-opacity-80 top-0 flex items-center justify-center" style="z-index:100">
        <div class="max-w-screen-md m-auto px-10 py-5 shadow rounded-2xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex justify-between items-center">
                <div class="absolute right-5 top-5 cursor-pointer" @click="close"><CloseIcon :fill="darkMode?`#909090`:`#000000`"></CloseIcon></div>
                <img :src="details.book.thumbnail" class="max-h-96 rounded-2xl shadow-md max-w-96">
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
                        <button class="h-12 rounded-lg bg-primary px-7 text-white focus:outline-none flex items-center mr-10 shadow-lg" v-if="details.book.type === `sound`" @click="listenAudio">
                            <div class="mr-3"><HeadphoneIcon fill="#ffffff"></HeadphoneIcon></div>
                            <span>{{$t('2208')}}</span>
                        </button>
                        <button class="h-12 rounded-lg bg-primary px-7 text-white focus:outline-none flex items-center mr-10 shadow-lg" v-if="details.book.type === `video`" @click="listVideo">
                            <div class="mr-3"><CameraVideoIcon fill="#ffffff"></CameraVideoIcon></div>
                            <span>{{$t('2209')}}</span>
                        </button>
                        <button class="h-12 rounded-lg bg-primary px-8 text-white focus:outline-none flex items-center shadow-lg">
                            <span>{{$t('2206')}}</span>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"
import CloseIcon from "./../../../../components/CloseIcon"
import ReadingBookIcon from "./../../../../components/ReadingBookIcon"
import HeadphoneIcon from "./../../../../components/HeadphoneIcon"
import CameraVideoIcon from "./../../../../components/CameraVideoIcon"

export default {
    components:{
        CloseIcon,
        ReadingBookIcon,
        HeadphoneIcon,
        CameraVideoIcon
    },
    computed:{
        ...mapState('library', ['details', 'loadingDetail']),
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        close(){
            this.$emit("close")
        },
        readingBook(){
            this.$emit("readingBook")
        },
        listenAudio(){
            this.$emit('listenAudio')
        },
        listVideo(){
            this.$emit("listVideo")
        }
    }
}
</script>