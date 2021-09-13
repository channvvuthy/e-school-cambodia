<template>
    <div>
        <div class="text-primary font-semibold text-sm mt-4" :class="darkMode?'text-white':''">
            {{$t('1106')}}
        </div>
        <div class="px-3 my-3 mt-5">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('my-course')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`my-course`)">
                        <div>
                            <MyCourseIcon fill="#FFFFFF" :size="24"  v-if="$route.name === `my-course`"></MyCourseIcon>
                            <MyCourseIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" :size="24" v-else></MyCourseIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1107')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('my-library')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`my-library`)">
                        <div>
                            <LibraryThinIcon :size="24" fill="#FFFFFF" v-if="$route.name === `my-library`"></LibraryThinIcon>
                            <LibraryThinIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></LibraryThinIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1108')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('favorite')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`favorite`)">
                         <div>
                             <HeartIcon :size="24" fill="#FFFFFF" v-if="$route.name === `favorite`"></HeartIcon>
                             <HeartIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></HeartIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1109')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('download')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"  :class="activeClass(`download`)">
                        <div>
                            <DownloadIcon :size="24" fill="#FFFFFF" v-if="$route.name === `download` || $route.name === `download-detail`"></DownloadIcon>
                            <DownloadIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></DownloadIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1110')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('network')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`network`)">
                        <div>
                            <NetworkIcon :size="24" fill="#FFFFFF" v-if="$route.name === `network`"></NetworkIcon>
                            <NetworkIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></NetworkIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('friend')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('document')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`document`)">
                        <div>
                            <DocumentIcon :size="24" fill="#FFFFFF" v-if="$route.name === `document` || $route.name === `document-detail`"></DocumentIcon>
                            <DocumentIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></DocumentIcon>
                        </div>
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1112')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('gallery')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`gallery`)">
                        <div>
                            <GalleryIcon :size="24" fill="#FFFFFF" v-if="$route.name === `gallery`"></GalleryIcon>
                            <GalleryIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></GalleryIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1113')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('certificate')">
                    <div class="flex-col rounded flex justify-center items-center cursor-pointer h-13 w-13 rounded-full" :class="activeClass(`certificate`)">
                        <div>
                            <CertificateIcon :size="24" fill="#FFFFFF" v-if="$route.name === `certificate`"></CertificateIcon>
                            <CertificateIcon :size="24" :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else></CertificateIcon>
                        </div>

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
    import MyCourseIcon from "./../../../components/YoutubeIcon.vue"
    import LibraryThinIcon from "./../../../components/LibraryThinIcon.vue"
    import HeartIcon from "./../../../components/HeartIcon.vue"
    import DownloadIcon from "./../../../components/DownloadIcon.vue"
    import NetworkIcon from "./../../../components/NetworkIcon.vue"
    import DocumentIcon from "./../../../components/DocumentIcon.vue"
    import GalleryIcon from "./../../../components/GalleryIcon.vue"
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
                this.$router.push({ name: page }).catch((err)=>{err});
            },
            activeClass(currentRoute){
                if(this.$route.name === currentRoute){
                    if(this.darkMode){
                        return "bg-button"
                    }
                   return "bg-primary"
                }
                if(this.darkMode){
                    return "border border-roundBorder"
                }
                return "border border-roundBorder"
            }
        }
    }
</script>