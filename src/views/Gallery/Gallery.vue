<template>
    <div>
        <div
                class="fixed w-full h-full top-0 left-0 z-50 bg-black bg-opacity-80 p-5 overflow-y-scroll flex items-center justify-center"
                v-if="previewStory">
            <div class="md:w-96 2xl:w-100 text-gray-300 bg-secondary rounded-lg flex flex-col justify-between relative"
                 style="height:90%;">
                <div class="flex justify-between p-5">
                    <div class="flex items-center">¬
                        <div class="w-12 h-12 rounded-full bg-cover mr-3 bg-center"
                             v-if="storyDetail.user && storyDetail.user.photo"
                             :style="{backgroundImage:`url(${storyDetail.user.photo})`}"></div>
                        <div class="flex flex-col items-center justify-start text-left text-base">
                            <div class="text-gray-300">
                                <div v-if="storyDetail.user && storyDetail.user.name">{{ storyDetail.user.name }}</div>
                                <vue-moments-ago prefix="" suffix="ago" :date="addedDate" lang="en"/>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer" @click="() =>{this.previewStory = false}">
                        <CloseIcon fill="#FFF"/>
                    </div>
                </div>
                <div class="h-5"></div>
                <div class="overflow-y-scroll  flex-1 flex items-center justify-center">
                    <img :src="imgUrl" class="max-h-full">
                    <div class="absolute flex justify-between items-center w-full bg-transparent">
                        <!-- Left -->
                        <div
                                class="transform rotate-90 relative -left-20 cursor-pointer bg-secondary w-8 h-8
                                rounded-full flex items-center justify-center"
                                :class="previous?'visible':'invisible'" @click="previousStory">
                            <ChevronIcon fill="#909090"/>
                        </div>
                        <!-- Right -->
                        <div
                                class="transform -rotate-90 relative -right-20 cursor-pointer bg-secondary w-8 h-8
                                rounded-full flex items-center justify-center"
                                :class="next?'visible':'invisible'" @click="nextStory">
                            <ChevronIcon fill="#ffffff"/>
                        </div>
                    </div>
                </div>
                <div class="h-5"></div>
                <div class="cursor-pointer w-full flex justify-between p-3 items-center text-sm mb-2 relative z-50"
                >
                    <div class="flex items-center" @click="showUserViewer(storyDetail)">
                        <template v-if="!storyDetail.view">
                            <span>{{ $t('no_viewers_yet') }}</span>
                        </template>
                        <template v-else>
                            <span><Eye fill="#ffffff"/></span>
                            <span class="px-1"> {{ storyDetail.view }}</span>
                            <span class="pr-1">{{ $t('1004') }}</span>
                            <span><ChevronIcon fill="#ffffff" :size="18"/></span>
                        </template>

                    </div>
                    <div @click="confirmDelete(storyDetail)">
                        <DeleteIcon fill="#909090"/>
                    </div>
                </div>
                <!-- List viewer -->
                <div :class="darkMode?'bg-secondary text-textSecondary':'bg-white'"
                     class="absolute z-50 left-0 w-full h-full overflow-y-scroll  rounded-xl shadow-md"
                     @scroll="onScroll"
                     v-if="showViewer">
                    <div class="md:w-96 2xl:w-100 top-0 sticky relative flex justify-between px-3 py-9"
                         :class="darkMode?`bg-secondary`:`text-black bg-white`">
                        <div class="flex ml-5 text-xs font-semibold items-center">
                            <span><Eye :fill="darkMode?'#ffffff':'#000000'"/></span>
                            <span class="px-2"
                                  :class="darkMode?`text-white`:`text-black`"> {{ storyDetail.view }}</span>
                            <span class="pr-1" :class="darkMode?`text-white`:`text-black`">{{ $t('1004') }}</span>
                        </div>
                        <div class="cursor-pointer opacity-70 z-50 relative -top-4"
                             @click="()=>{this.showViewer = false}">
                            <close-icon :fill="darkMode?'#FFF':'#000000'"/>
                        </div>
                    </div>
                    <div>
                        <div v-for="(viewer,index) in storyDetail.viewer" :key="index"
                             class="text-black text-xs font-semibold">
                            <div class="flex items-center mb-5 px-5">
                                <div class="w-12 h-12 rounded-full bg-cover bg-gray-200 mr-5 bg-center"
                                     v-if="viewer.photo"
                                     :style="{backgroundImage:`url(${viewer.photo})`}"></div>
                                <div :class="darkMode?'text-textSecondary':''" v-if="viewer.name">{{ viewer.name }}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="grid gap-5 md:grid-cols-3 2xl:grid-cols-4 p-5 h-screen pb-40 overflow-y-scroll" v-if="loading">
            <div class="max-w-sm w-full mx-auto" v-for="i in 21" :key="i">
                <div class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-4 py-1">
                        <div class="h-4 w-3/4" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                        <div class="space-y-2">
                            <div class="h-4" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                            <div class="h-4 w-5/6" :class="darkMode?`bg-secondary`:`bg-gray-300`"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="m-5">
            <div class="h-screen pb-40 overflow-y-scroll" @scroll="getMoreGallery($event)">
                <div v-if="loading">
                    <div class="loader"></div>
                </div>
                <div>
                    <div v-if="galleries.length == 0" class="h-screen pb-10">
                        <Empty/>
                    </div>
                    <div :class="window.width <= 1315?`container-4`:`container-5`">
                        <div v-for="(gallery, index) in galleries"
                             :key="index" class="cursor-pointer"
                             :id="gallery._id"
                             @click="viewImg(gallery,index)">
                            <img :src="gallery.photo.url" v-if="gallery.photo">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BuyMsg
                v-if="isDelete"
                :msg="msg"
                @cancelModal="()=>{this.isDelete = false}"
                @yes="deleteMyStory"
        />
    </div>
</template>
<script>
    import eHeader from "./../Video/components/Header.vue"
    import {mapState, mapActions} from "vuex"
    import Loading from "./../../components/Loading.vue"
    import CloseIcon from "./../../components/CloseIcon.vue"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import Eye from "./../../components/Eye.vue"
    import Empty from "./../Component/Empty.vue"
    import VueMomentsAgo from "vue-moments-ago";
    import DeleteIcon from "../MyCourse/components/DeleteIcon";
    import BuyMsg from "../Component/BuyMsg";
    import helper from "../../helper/helper";

    export default {
        data() {
            return {
                previewStory: false,
                deletedStory: {},
                isDelete: false,
                imgUrl: "",
                addedDate: "",
                showViewer: false,
                id: "",
                page: 1,
                window: {
                    width: null
                },
                next: true,
                previous: true,
                order: 0,
                msg: "007",
            }
        },
        components: {
            BuyMsg,
            DeleteIcon,
            eHeader,
            Loading,
            CloseIcon,
            VueMomentsAgo,
            ChevronIcon,
            Eye,
            Empty
        },
        computed: {
            ...mapState('gallery', ['loading', 'galleries']),
            ...mapState('setting', ['darkMode', 'isHide']),
            ...mapState('auth', ['stProfile', 'storyDetail']),
            ...mapState('story', ['currentStory'])
        },
        methods: {
            ...mapActions('gallery', ['getGallery']),
            ...mapActions('auth', ['viewStory']),
            deleteMyStory() {
                if (this.currentStory.hasOwnProperty('photo')) {
                    if (this.deletedStory.photo.url == this.currentStory.photo.url) {
                        this.$store.commit("story/setStory", {})
                        localStorage.removeItem("currentStory")
                    }
                }

                this.isDelete = false
                this.deletedStory.id = this.deletedStory._id
                this.$store.dispatch("story/deleteStory", this.deletedStory).then(res => {
                    if (res.msg) {
                        helper.errorMessage(res.msg)
                    }

                    if (res.data) {
                        helper.success('008')
                    }

                    this.previewStory = false
                    document.getElementById(this.deletedStory._id).remove()
                })
            },
            confirmDelete(story) {
                this.deletedStory = story
                this.isDelete = true
            },
            showUserViewer(gallery) {
                if (this.storyDetail.view) {
                    this.showViewer = true
                    this.id = gallery._id;
                }

            },
            getMoreGallery({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight - 1) {
                    this.page++
                    let payload = {
                        p: this.page
                    }
                    payload.id = this.stProfile._id
                    this.getGallery(payload)
                }
            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight - 1) {
                    this.page++
                    let payload = {
                        id: this.id,
                        p: this.page
                    }

                    this.viewStory(payload)
                }
            },
            previousStory() {
                this.order--
                if (this.order <= 0) {
                    this.previous = false
                }
                this.next = true

                this.viewImg(this.galleries[this.order], this.order)
            },
            nextStory() {
                this.previous = true
                if (this.order < (this.galleries.length - 1)) {
                    this.order++
                    this.viewImg(this.galleries[this.order], this.order)
                } else {
                    this.next = false
                }
            },
            countView(viewer) {
                if (typeof viewer === "object") {
                    if (viewer.length) {
                        return viewer.length;
                    }
                }
                return false;
            },
            viewImg(gallery, index) {
                this.order = index
                this.id = gallery._id
                this.imgUrl = gallery.photo.url
                this.previewStory = true
                this.addedDate = gallery.date
                this.viewStory({
                    id: gallery._id
                })

            },
            handleResize() {
                this.window.width = window.innerWidth;
            },
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        created() {

            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            this.getGallery({
                id: this.$route.params.id
            })
        }


    }
</script>
<style lang="scss">
    .container-5 {
        columns: 5;

        img {
            width: 100%;
            margin-bottom: 15px;
            border-radius: 1rem;
        }
    }

    .container-4 {
        columns: 4;

        img {
            width: 100%;
            margin-bottom: 15px;
            border-radius: 1rem;
        }
    }

</style>