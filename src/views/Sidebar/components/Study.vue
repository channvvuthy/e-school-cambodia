<template>
    <div>
        <div class="text-primary font-semibold text-sm mt-4" :class="darkMode?'text-white':''">
            {{$t('1106')}}
        </div>
        <div class="px-3 my-3 mt-5">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><MyCourseIcon :fill="darkMode?`#909090`:`#0f3c7a`"></MyCourseIcon></div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1107')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><LibraryThinIcon :fill="darkMode?`#909090`:`#0f3c7a`"></LibraryThinIcon></div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1108')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('favorite')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `favorite`?`bg-byline`:`bg-button`}`:`${$route.name === `favorite`?`bg-primary`:`bg-gray-100`} shadow-md`">
                         <div>
                             <HeartIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `favorite`"></HeartIcon>
                             <HeartIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></HeartIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1109')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><DownloadIcon :fill="darkMode?`#909090`:`#0f3c7a`"></DownloadIcon></div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1110')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><NetworkIcon :fill="darkMode?`#909090`:`#0f3c7a`"></NetworkIcon></div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('4120')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><DocumentIcon :fill="darkMode?`#909090`:`#0f3c7a`"></DocumentIcon></div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1112')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><GalleryIcon :fill="darkMode?`#909090`:`#0f3c7a`"></GalleryIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1113')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><CertificateIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="24"></CertificateIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1114')}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import MyCourseIcon from "./../../../components/MyCourseIcon"
    import LibraryThinIcon from "./../../../components/LibraryThinIcon"
    import HeartIcon from "./../../../components/HeartIcon"
    import DownloadIcon from "./../../../components/DownloadIcon"
    import NetworkIcon from "./../../../components/NetworkIcon"
    import DocumentIcon from "./../../../components/DocumentIcon"
    import GalleryIcon from "./../../../components/GalleryIcon"
    import CertificateIcon from "./../../../components/CertificateIcon"
    export default{
        components:{
            MyCourseIcon,
            LibraryThinIcon,
            HeartIcon,
            DownloadIcon,
            NetworkIcon,
            DocumentIcon,
            GalleryIcon,
            CertificateIcon
        },
        computed: {
            ...mapState('setting', ['darkMode'])
        },
        methods:{
            goTo(page) {
                this.$router.push({ name: page });
            },
        }
    }
</script>