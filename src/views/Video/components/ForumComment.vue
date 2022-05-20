<template>
    <div class="ml-5 flex flex-col justify-between border border-t-0"
         :class="darkMode ? `bg-secondary text-textSecondary border-secondary `: `bg-white`"
         :style="{height:`${windowHeight}px`}">
        <template v-if="loading">
            <div class="p-5">
                <div v-for="i in 6" class="h-36 w-full box-loading" :key="i">
                    <div class="flex flex-col justify-between">
                        <div class="line-1"></div>
                        <div class="line-2 mt-3"></div>
                        <div class="line-3 mt-3"></div>
                        <div class="line-4 mt-3"></div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <!--Comment list -->
            <div class="h-full overflow-y-scroll" ref="feed" @scroll="onScroll">
                <!-- Parent comment -->
                <div :class="darkMode ?`bg-youtube`: `bg-forum`" class="py-5 px-4">
                    <div class="flex">
                        <div class="w-16 h-16 bg-white rounded-full bg-cover bg-center"
                             :style="{backgroundImage:`url(${comments.forum.user.photo})`}">
                        </div>

                        <div class="text-primary ml-4">
                            <div :class="darkMode?`text-gray-300`:``" class="font-bold">{{ comments.forum.user.name }}
                            </div>
                            <div class="text-gray-500 flex items-center text-sm mt-1">
                                <vue-moments-ago prefix="" suffix="ago" :date="comments.forum.date" lang="en"/>
                                <div class="border-l h-3 border-gray-500 w-1 mx-4"></div>
                                <div class="bg-darkYellow rounded text-center text-xs text-black px-3 h-5 leading-5 font-normal">
                                    {{ $t('2115') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4">
                        {{ comments.forum.content.text }}
                    </div>
                </div>
                <!-- End parent comment -->

                <!-- Child comment -->
                <div>
                    <template v-if="comments.comment">
                        <div v-for="(comment, index) in comments.comment" :key="index" class="px-5 flex my-5">
                            <div class="w-14 h-14">
                                <div class="w-14 h-14 bg-white rounded-full bg-cover bg-center"
                                     :style="{backgroundImage:`url(${comment.user.photo})`}">
                                </div>
                            </div>
                            <div class="ml-5 rounded-xl px-4 py-3" :class="darkMode ? `bg-youtube` : `bg-forum`">
                                <div class="font-bold" :class="darkMode ? `` : `text-primary`">
                                    {{ comment.user.name }}
                                </div>
                                <div v-if="comment.content.text">{{ comment.content.text }}</div>
                                <div class="mt-2" v-if="comment.content.photo">
                                    <img :src="comment.content.photo.name || comment.content.photo.url"
                                         class="m-auto max-w-56 rounded">
                                </div>
                                <div v-if="comment.content.sticker">
                                    <img :src="comment.content.sticker.name" class="m-auto max-w-xs rounded">
                                </div>
                                <div class="text-gray-500 text-sm">
                                    <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>


            </div>
            <div v-if="sticker._id"
                 :class="darkMode ? `border-button` : `bg-white`"
                 class="px-4 py-3 border-t">
                <div class="w-24 flex items-center justify-center rounded-lg relative p-2"
                     :class="darkMode ? `` : `bg-forum`">
                    <div
                            @click="()=>{this.sticker ={};}"
                            class="absolute cursor-pointer -right-2 -top-2 w-5 h-5 bg-primary flex items-center justify-center shadow rounded-full">
                        <CloseIcon :width="18" fill="#fff"/>
                    </div>
                    <img :src="sticker.sticker.name" :alt="sticker._id">
                </div>
            </div>
            <div :class="darkMode ? `bg-youtube`: `bg-forum`"
                 class="flex justify-between h-17 px-5 items-center"
            >
                <div class="h-12 w-12 cursor-pointer">
                    <div
                            class="rounded-full flex items-center justify-center h-12 w-12"
                            :class="darkMode ? `comment-dark`: `comment-light`" @click="choosePhoto">
                        <ImageIcon :fill="darkMode?`#909090`:`#055174`" :size="25"/>
                    </div>
                </div>

                <div class="w-full">
                    <div class="mx-5">
                        <form class="hidden">
                            <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"
                                   accept="image/png, image/gif, image/jpeg">
                        </form>
                        <textarea
                                ref="message"
                                :placeholder="$t('say_something')" v-model="text"
                                @keyup.enter.exact="replyTextComment(comments.forum)"
                                class="w-full bg-transparent py-7 outline-none h-17"
                                style="resize: none"></textarea>
                    </div>
                </div>
                <div class="mr-5 cursor-pointer" @click="()=>{this.isSticker =! this.isSticker}">
                    <SmileEmoji :size="45" :fill="darkMode ?`#909090`: `#979797`"/>
                </div>
                <div class="h-12 w-12 cursor-pointer">
                    <div
                            @click="replyTextComment(comments.forum)"
                            class="rounded-full flex items-center justify-center h-12 w-12"
                            :class="darkMode ? `comment-dark`: `comment-light`">
                        <SendMessageIcon :fill="darkMode?`#909090`:`#055174`" :size="25"/>
                    </div>
                </div>

            </div>
        </template>
        <template v-if="isSticker">
            <Sticker @selectSticker="selectSticker($event)"/>
        </template>
    </div>
</template>
<script>
    import VueMomentsAgo from "vue-moments-ago";
    import ImageIcon from "./../../../components/ImageIcon.vue"
    import SendMessageIcon from "@/components/SendMessageIcon";
    import {mapState} from "vuex"
    import SmileEmoji from "@/views/Video/components/SmileEmoji";
    import Sticker from "@/views/Video/components/Sticker";
    import CloseIcon from "@/components/CloseIcon";

    export default {
        components: {
            VueMomentsAgo,
            ImageIcon,
            SendMessageIcon,
            SmileEmoji,
            Sticker,
            CloseIcon
        },
        props: {
            comments: {
                default: () => {
                    return []
                }
            },
            loading: {
                default: () => {
                    return false
                }
            }
        },
        data() {
            return {
                sticker: {},
                isSticker: false,
                text: "",
                page: 1,
                windowHeight: 0,
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            selectSticker(sticker) {
                this.sticker = sticker
                this.isSticker = false
            },
            onSelectedPhoto(event) {
                if (event.target.value) {
                    this.$emit("reply", true)
                    this.$emit("openModal", event)
                }
            },
            choosePhoto() {
                this.$refs.photo.click()
            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page++
                    let payload = {}
                    payload.p = this.page
                    payload.id = this.comments.forum._id
                    this.$emit("loadMoreComment", payload)
                }
            },
            replyTextComment(forum) {
                if (this.text.length || this.sticker._id) {
                    let data = {
                        id: forum._id,
                        text: this.text
                    }
                    if (this.sticker._id) {
                        data.sticker = this.sticker._id
                    }
                    this.$emit("replyTextComment", data)
                    this.text = ""
                    this.sticker = {}
                    setTimeout(() => {
                        this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight
                    }, 2000)

                } else {
                    this.$refs.message.focus()
                }
            }
        },
        mounted() {
            this.windowHeight = screen.height - 300
        }
    }
</script>