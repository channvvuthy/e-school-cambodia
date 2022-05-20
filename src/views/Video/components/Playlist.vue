<template>
    <div class="ml-5 pt-4 h-screen overflow-y-scroll pb-60 font-khmer_os bg-cover text-sm" @scroll="onScroll"
         :class="darkMode?``:`bg-white pl-4 border`">
        <div v-for="(list,index) in playlist.list" :key="index">
            <div class="flex justify-between items-center p-4 mb-3 rounded-lg mr-4"
                 :class="list.order === order?darkMode?`bg-white`:`bg-act`:darkMode?`bg-button text-textSecondary`:`bg-white border`"
                 :style="canWatch(list.free_watch)?{}:{opacity:`1`}">
                <div class="relative w-2/5 mr-3">
                    <img :src="list.thumbnail" onerror="this.onerror=null; this.src='/poster.png'"
                         class="rounded-md"
                         @click="nextVideo(list)"
                         :title="list.title"
                         :class="canWatch(list.free_watch)?`cursor-pointer`:`cursor-default`"/>
                    <div class="absolute left-0 h-1 bg-red-600 -mt-1" v-if="list.last_watch"
                         :style="{width:`${list.last_watch.percentage}%`}"></div>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div class="font-semibold mb-3 text-sm"
                         @click="nextVideo(list)"
                         :title="list.title"
                         :class="canWatch(list.free_watch)?`cursor-pointer ${darkMode && list.order != order?'text-white':darkMode?'text-youtube':''}`:`cursor-default ${darkMode && list.order != order?'text-white':''}`">
                        {{ (index + 1) + ". " + cutString(list.title, 40) }}
                    </div>
                    <div class="flex justify-between items-center text-sm items-center">
                        <div class="flex">
                            <Eye
                                    :width="20"
                                    :height="20"
                                    v-if="list.order === order"
                                    :fill="darkMode?`#181818`:`#4A4A4A`"/>
                            <Eye
                                    :width="20"
                                    :height="20"
                                    v-else
                                    :fill="darkMode?`#E5E7EB`:`#4A4A4A`"/>
                            <div class="mx-2"
                                 :class="darkMode?list.order === order?`text-black`:`text-byline`:`opacity-50`">
                                {{ kFormatter(list.view) }}
                            </div>
                            <div :class="darkMode?list.order === order?`text-youtube`:`text-byline`:`opacity-50`">
                                {{$t('1003') }}
                            </div>
                        </div>
                        <div class="flex">

                            <template v-if="canWatch(list.free_watch)">
                                <div class="cursor-pointer">
                                    <template v-if="isDownloading(list._id)">
                                        <Loading></Loading>
                                    </template>
                                </div>
                            </template>
                            <div v-else>
                                <LockIcon
                                        :width="20" :height="20"
                                        :fill="(list.order != order && darkMode)?`#E5E7EB`:darkMode?`#E5E7EB`:`#4A4A4A`"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-xs text-center" :class="darkMode?`text-gray-300`:``">{{ $t('scrolling_problem') }}</div>
        <div class="flex items-center justify-center mt-2">
            <button class="focus:outline-none text-xs rounded-full px-2 py-1"
                    :class="darkMode?`bg-pass text-white`:`bg-primary text-white`" @click="loadMore">
                <div class="flex items-center justify-center">
                    <div class="px-14 py-1" v-if="loading">
                        <div class="loader relative -top-6"></div>
                    </div>
                    <span v-else>{{ $t('load_more') }} </span>

                </div>
            </button>
        </div>
        <!-- Download option -->
        <div class="fixed flex items-center justify-center w-full h-full left-0 top-0 bg-black bg-opacity-90 z-50"
             v-if="showOpt">
            <div class="w-80 rounded-xl shadow" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <!-- Header -->
                <div class="py-3 text-center flex items-center justify-center"><span>{{ $t('choose_quality') }}</span>
                </div>
                <div class="w-full h-1 border-b" :class="darkMode?`border-button`:`border-gray-3000`"></div>
                <ul>
                    <li class="w-full text-center h-12 leading-11 flex items-center justify-center border-b cursor-pointer"
                        :class="darkMode?`border-button`:`border-gray-300`" @click="download(360)"><span>360p</span>
                    </li>
                    <li class="w-full text-center h-12 leading-11 flex items-center justify-center border-b cursor-pointer"
                        :class="darkMode?`border-button`:`border-gray-300`" @click="download(720)"><span>720p</span>
                    </li>
                </ul>
                <div class="flex items-center justify-center py-3 cursor-pointer"
                     :class="darkMode?`text-pass`:`text-heart`"
                     @click="()=>{this.showOpt = false}">
                    <span>{{ $t('1011') }}</span>
                </div>

            </div>
        </div>
        <BuyMsg
                v-if="showConfirm"
                :msg="msg"
                @cancelModal="() =>{this.showConfirm = false}"
                @yes="removeDownload"/>
    </div>
</template>

<script>
    import Eye from "./../../../components/Eye.vue"
    import Loading from "./../../../components/LoadingWhite.vue"
    import DownloadIcon from "./../../../components/DownloadIcon.vue"
    import LockIcon from "./../../../components/LockIcon.vue"
    import CloseIcon from "./../../../components/CloseIcon.vue"
    import FavoriteIcon from "./../../../components/FavoriteIcon.vue"
    import FavoriteFill from "./../../../components/FavoriteFill.vue"
    import helper from "./../../../helper/helper"
    import BuyMsg from "./../../Component/BuyMsg.vue"
    import {mapActions, mapState} from "vuex"

    const {ipcRenderer} = require('electron')
    export default {
        components: {
            Eye,
            DownloadIcon,
            FavoriteIcon,
            FavoriteFill,
            LockIcon,
            Loading,
            CloseIcon,
            BuyMsg
        },
        data() {
            return {
                page: 1,
                showOpt: false,
                list: null,
                downloading: [],
                showConfirm: false,
                id: null,
                msg: "delete",
                loading: false
            }
        },
        computed: {
            ...mapState('favorite', ['temporaryFavorites']),
            ...mapState('video', ['order', 'playlist']),
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            ...mapActions('favorite', ['add', 'removeFavorite']),
            ...mapActions('video', ['getPlaylistWithPagination']),
            cutString(text, limit) {
                return helper.cutString(text, limit)
            },

            addFavorite(id) {
                this.add(id).then(() => {
                    this.$store.commit("video/addFavoriteVideo", id)
                })
            },
            kFormatter(num) {
                return helper.kFormatter(num)
            },
            loadMore() {
                this.loading = true
                let map = this.playlist.list.map(item => item.order)
                let lastOrder = Math.max(...map)
                this.page++
                if (this.playlist.list !== undefined) {
                    this.getPlaylistWithPagination({
                        p: this.page,
                        id: this.$route.params.course._id,
                        order: lastOrder
                    }).then(response => {
                        this.loading = false
                        if (response.data.data.list != `undefined` && response.data.data.list.length <= 0) {
                            helper.success('no_more_result')
                        }
                    })
                }
            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                let map = this.playlist.list.map(item => item.order)
                let lastOrder = Math.max(...map)
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page++
                    if (this.playlist.list !== undefined) {
                        this.getPlaylistWithPagination({
                            p: this.page,
                            id: this.$route.params.course._id,
                            order: lastOrder
                        })
                    }
                }
            },
            removeMyFavorite(id) {
                this.removeFavorite(id).then(() => {
                    this.$store.commit("video/removeFavoriteVideo", id)
                })
            },
            nextVideo(video) {

                if (this.canWatch(video.free_watch)) {
                    this.$emit("nextVideo", video);

                } else {
                    this.$emit("buyNow", video)
                }

            },
            canWatch(free_watch) {
                if ((this.playlist.is_buy || free_watch)) {
                    return true
                }
                return false
            },
            showOptionDownload(list) {
                this.showOpt = true
                list.teacher = this.$route.params.course.teacher
                list.has_certificate = this.$route.params.course.has_certificate
                list.has_support = this.$route.params.course.has_support
                list.is_buy = this.$route.params.course.is_buy
                list.is_in_cart = this.$route.params.course.is_in_cart
                list.is_new = this.$route.params.course.is_new
                list.total_pdf = this.$route.params.course.total_pdf
                this.list = list

            },
            isDownloading(_id) {
                if (this.downloading.length) {
                    for (let i = 0; i < this.downloading.length; i++) {
                        if (this.downloading[i] === _id) {
                            return true
                        }
                    }
                }
                return false
            },
            isDownloaded(_id) {
                let videos = localStorage.getItem("videos")
                if (videos != null) {
                    videos = JSON.parse(videos)
                    for (let i = 0; i < videos.length; i++) {
                        if (videos[i]._id === _id) {
                            return true
                        }
                    }
                }

                return false
            },
            confirmRemoveDownload(_id) {
                this.id = _id
                this.showConfirm = true
            },
            removeDownload() {
                let videos = localStorage.getItem("videos")
                if (videos != null) {
                    videos = JSON.parse(videos)
                    videos = videos.filter(item => item._id != this.id)
                    localStorage.setItem("videos", JSON.stringify(videos))
                    this.showConfirm = false
                    ipcRenderer.send("removeDownload", this.id)
                }
            },
            download(qty) {
                let videos = localStorage.getItem("videos")

                if (videos === null) {
                    videos = []
                    videos.push(this.list)
                    localStorage.setItem("videos", JSON.stringify(videos))
                } else {
                    videos = JSON.parse(videos)
                    videos.push(this.list)
                    localStorage.setItem("videos", JSON.stringify(videos))
                }
                this.downloading.push(this.list._id)

                let videoUrl = this.list.video.filter(item => item.quality === `${qty}p`)[0]['url']

                let arg = {
                    videoUrl: videoUrl,
                    quality: qty,
                    _id: this.list._id
                }

                ipcRenderer.send('download', arg)

                this.showOpt = false
            }

        },
        created() {
            ipcRenderer.on('downloaded', (event, arg) => {
                helper.success('download_video_success')
                this.downloading = this.downloading.filter(item => item != arg._id)
            })

            ipcRenderer.on('fail', (event, arg) => {
                helper.errorMessage("download_problem")
                this.downloading = this.downloading.filter(item => item != arg._id)
            })


        }
    }
</script>
