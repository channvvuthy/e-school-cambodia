<template>
    <div>
        <div class="h-screen pb-40 overflow-y-scroll p-5">
            <div v-if="loading">
                <loading/>
            </div>
            <div v-if="certificate.length == 0" class="h-screen pb-40 flex items-center justify-center w-full">
                <Empty/>
            </div>
            <div class="grid md:grid-cols-2 2xl:grid-cols-3 gap-5" v-else>
                <div v-for="(cer, index) in certificate" :key="index">
                    <div class="rounded-xl relative shadow overflow-hidden" @click="viewCertificate(cer)">
                        <img :src="cer.url" class="rounded-xl cursor-pointer">
                        <div class="absolute h-20 w-full left-0 bottom-0   shadow rounded-b-xl bg-opacity-90 flex  flex-col justify-center px-5 text-lg"
                             :class="darkMode?`bg-secondary text-gray-300`:`bg-white text-primary`"
                             style="box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.1);">
                            <div class="font-black">
                                {{$t('certificate_of_education')}}
                            </div>
                            <div class="text-base mt-2">
                                {{cer.title}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed w-full h-full top-0 left-0 p-10 overflow-y-scroll flex items-center justify-center bg-black z-50 text-gray-300"
             v-if="imgUrl">
            <div class="absolute top-5 right-5 cursor-pointer" @click="() => {this.imgUrl = ''}">
                <CloseIcon :fill="`#FFF`"></CloseIcon>
            </div>
            <div v-if="isLoaded === false" class="flex items-center justify-center fixed w-full h-full top-0 left-0">
                <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-gray-300 h-3 w-3"></div>
                    <div class="rounded-full bg-gray-300 h-3 w-3"></div>
                    <div class="rounded-full bg-gray-300 h-3 w-3"></div>

                </div>
            </div>
            <div style="max-height:90%;">
                <img :src="imgUrl" class="rounded" style="max-height:100%;" @load="onImgLoad">
            </div>
        </div>
    </div>
</template>
<script>
    import eHeader from "./../Video/components/Header.vue"
    import {mapActions, mapState} from "vuex"
    import CloseIcon from "./../../components/CloseIcon.vue"
    import Loading from "./../../components/Loading.vue"
    import Empty from "./../Component/Empty.vue"

    export default {
        computed: {
            ...mapState('setting', ['darkMode']),
        },
        components: {
            eHeader,
            CloseIcon,
            Loading,
            Empty
        },
        data() {
            return {
                certificate: [],
                loading: false,
                imgUrl: "",
                isLoaded: false,
            }
        },
        methods: {
            ...mapActions('certificate', ['getCertificate']),
            viewCertificate(certificate) {
                this.imgUrl = certificate.url
            },
            onImgLoad() {
                this.isLoaded = true
            }
        },
        created() {
            this.loading = true
            this.getCertificate().then(response => {
                this.loading = false
                this.certificate = response.data.data
            }).catch(err => {
                console.log(err)
            })
        }

    }
</script>