<template>
    <div :class="darkMode ? `bg-secondary`: `bg-white`">
        <div>
            <div class="px-5 pt-7 shadow-md text-sm"
                 :class="darkMode?`bg-secondary border-t border-b border-button text-textSecondary`:`bg-white text-black`">
                <!-- Tab -->
                <div class="mt-7 px-3">
                    <div class="flex justify-start space-x-28">
                        <div @click="changeType('post')" class="cursor-pointer  w-12 text-center"
                             :class="type==`post`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{ $t('post') }}</div>
                            <div v-if="type === `post`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
                            </div>
                        </div>
                        <div @click="changeType('course')" class="cursor-pointer  w-12 text-center"
                             :class="type==`course`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{ $t('course') }}</div>
                            <div v-if="type === `course`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
                            </div>
                        </div>
                        <div @click="changeType('book')" class="cursor-pointer w-24 text-center"
                             :class="type==`book`?`text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{ $t('2202') }}</div>
                            <div v-if="type === `book`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
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
                <template v-if="type === `course`">
                    <div v-if="favoritedVideo.length == 0" class="h-screen pb-10" style="display:block;">
                        <Empty></Empty>
                    </div>
                    <div class="grid gap-5"
                         :class="isHide?'md:grid-cols-4 2xl:grid-cols-5':'md:grid-cols-3 2xl:grid-cols-4'">
                        <div v-for="(view,index) in favoritedVideo"
                             :id="view._id"
                             class="cursor-pointer rounded overflow-hidden"
                             :key="index" :class="darkMode?'text-textSecondary':'bg-white shadow'">
                            <div class="relative" @mouseover="hideAndShowDuration(view._id)"
                                 @mouseleave="hideAndShowDuration('')" @click="viewVideo(view)">
                                <div class="absolute z-30 w-full h-full flex justify-center items-center">
                                    <video :src="playWhenOver(view.video)" autoplay="autoplay"
                                           class="flex justify-center items-center"
                                           controlsList="nodownload" v-if="hideDuration===view._id" muted></video>
                                </div>
                                <img :src="view.thumbnail">
                                <div class="absolute bottom-0 left-0 bg-red-600 h-1" v-if="view.last_watch"
                                     :style="{width:Math.round(view.last_watch.percentage) + `%`}"></div>
                                <div class="absolute right-3 bottom-2 rounded px-2 py-1 bg-black text-white bg-opacity-60 text-xs"
                                     v-if="millisToMinutesAndSeconds(view.duration)">
                                    {{ millisToMinutesAndSeconds(view.duration) }}
                                </div>
                            </div>

                            <div class="flex items-center justify-start cursor-text" :class="darkMode?`py-3`:`p-3`">
                                <img :src="view.teacher.photo" class="h-10 rounded mr-3">
                                <div>
                                    <div class="text-primary text-sm" :class="darkMode?'text-white':''">
                                        {{cutString(view.title, 20) }}
                                    </div>
                                    <div class="flex font-khmer_os text-xs"
                                         :class="darkMode?`text-gray-400`:`opacity-50`">
                                        <div>{{ view.teacher.name }}</div>
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
                <template v-if="type === `book`">
                    <div v-if="favoritedBook.length == 0" class="h-screen pb-10" style="display:block;">
                        <Empty></Empty>
                    </div>
                    <div class="grid gap-4"
                         :class="isHide?'md:grid-cols-3 2xl:grid-cols-4':'md:grid-cols-2 2xl:grid-cols-3'">
                        <div v-for="(book, index) in favoritedBook" :key="index">
                            <div class="flex rounded-xl shadow p-4 relative"
                                 :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                                <img :src="book.thumbnail" class="rounded-xl max-h-36 cursor-pointer"
                                     @click="getDetail(book)"/>
                                <div class="absolute left-5 top-5" v-if="book.is_new">
                                    <NewIcon :size="22"></NewIcon>
                                </div>
                                <div class="px-3 flex flex-col justify-between">
                                    <div class="font-thin text-sm cursor-pointer" @click="getDetail(book)">
                                        <div>{{ cutString(book.title, 25) }}</div>
                                        <div v-if="book.des" class="text-xs my-3">{{ cutString(book.des, 90) }}</div>
                                    </div>
                                    <div class="text-xs"><span v-if="book.price.year">{{ $t('1006') }}:</span>
                                        <span :class="darkMode?``:`text-heart`">
                                            {{ book.price.year ? `${book.price.year}$` : `${$t('1007')}` }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-between flex-1 items-end">
                                    <div @click="confirmRemoveFavorite(book._id)" class="cursor-pointer">
                                        <FavoriteFill :fill="darkMode?`#ffffff`:`#c0272d`"/>
                                    </div>
                                    <div v-if="book.price.year" @click="addToCart(book)" class="cursor-pointer">
                                        <div v-if="!book.is_in_cart">
                                            <CartIcon :fill="darkMode?`#909090`:`#4A4A4A`"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="type === `post`">
                    <div v-if="favorites.length == 0" class="h-screen pb-10" style="display:block;">
                        <Empty></Empty>
                    </div>
                    <div v-else class="w-65">
                        <div v-for="post in favorites" :key="post._id">
                            <div
                                    :id="post._id"
                                    :data-id="post._id"
                                    :data-type="post.type"
                                    class="border mb-5"
                                    :class="darkMode ? `border-button text-lightGray` : ``">
                                <div class="px-5 pt-5">
                                    <div class="flex justify-between">
                                        <div class="flex space-x-4">
                                            <div @click="userDetail(post.user)">
                                                <Avatar :avatar-url="post.user.photo" :size="16"/>
                                            </div>
                                            <div>
                                                <div class="font-PoppinsMedium text-lg">{{ post.user.name }}</div>
                                                <div
                                                        v-if="(post.type === 52 || post.type === 51)"
                                                        class="capitalize text-primary text-sm">
                                                    { $t('sponsored') }}
                                                </div>
                                                <div
                                                        v-else
                                                        class="text-base"
                                                        :class="darkMode ? `text-gray-400` : `text-gray-500`">
                                                    {{ formatDate(post.date) }}
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Action -->
                                        <div class="relative">
                                            <div
                                                    @click="closeAction"
                                                    class="w-full h-full fixed top-0 left-0 z-40"
                                                    v-if="actionId === post._id"></div>
                                            <div @click="showAction(post)">
                                                <Action/>
                                            </div>
                                            <div
                                                    v-if="actionId === post._id"
                                                    :class="darkMode ? `bg-youtube text-lightGray`: `bg-white border-t`"
                                                    class="absolute w-60 py-5 right-0 top-10 z-50 rounded-xl shadow-md">
                                                <ActionList
                                                        @selectedAction="selectedAction($event)"
                                                        :post="post"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="post.thumbnail && post.type === 1" class="relative">
                                        <div class="absolute flex items-center h-full w-full justify-center top-0 left-0">
                                            <div class="m-auto overflow-y-scroll p-5 whitespace-pre-wrap text-center max-h-full">
                                                <div v-if="post.caption.length > 200">
                                                      <span class="less" @click="seeMore">
                                                          {{ cutString(post.caption, 200) }}
                                                          <span class="capitalize cursor-pointer font-bold">
                                                              {{ $t('see_more') }}
                                                          </span>
                                                      </span>
                                                    <span class="more hidden">{{ post.caption }}</span>
                                                </div>
                                                <div v-else>
                                                    {{ post.caption }}
                                                </div>
                                            </div>
                                        </div>
                                        <img :src="post.thumbnail.url" alt="" class="mt-4" :id="post._id">
                                        {{ setParentColor(post._id) }}
                                    </div>

                                    <!-- Caption -->
                                    <div class="font-light mt-4 whitespace-pre-wrap"
                                         v-else-if="post.caption"
                                         :class="darkMode ? `text-lightGray` : ``">
                                        <div v-if="post.caption.length > 200">
                                              <span class="less" @click="seeMore">
                                                  {{ cutString(post.caption, 200) }}
                                                  <span
                                                          class="capitalize cursor-pointer"
                                                          :class="darkMode ? `text-gray-300`: `text-primary`">
                                                      {{ $t('see_more') }}
                                                  </span>
                                              </span>
                                            <span class="more hidden">{{ post.caption }}</span>
                                        </div>
                                        <div v-else>
                                            {{ post.caption }}
                                        </div>
                                    </div>

                                    <!-- Photo -->
                                    <div v-if="post.photo && post.photo.length" class="mt-4">
                                        <PhotoGrid @itemClick="itemClickHandler"
                                                   :post="post"
                                                   :photos="post.photo"/>
                                    </div>
                                    <!--Video-->
                                    <div v-if="post.video" class="mt-4 overflow-hidden">
                                        <MediaPlayer
                                                @fullScreen="fullScreen($event)"
                                                :video-url="post.video.url" :post="post">
                                        </MediaPlayer>
                                    </div>

                                    <!-- Tool -->
                                    <div class="flex items-center pl-5 mt-4 justify-between"
                                         :class="darkMode ? `text-lightGray` : `text-primary`">
                                        <div class="flex items-center space-x-16">
                                            <div class="flex items-center space-x-2">
                                                <div class="cursor-pointer">
                                                    <div v-if="post.is_like" @click="disLikePost(post)">
                                                        <LikeFillIcon :size="22"
                                                                      :fill="darkMode ? `#909090`: `#055174`"/>
                                                    </div>
                                                    <div @click="likePost(post)" v-else>
                                                        <LikeIcon :size="22"
                                                                  :fill="darkMode ? `#909090`: `#4A4A4A`"/>
                                                    </div>

                                                </div>
                                                <div v-if="post.total && post.total.like">
                                                    {{ kFormatter(post.total.like) }}
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2"
                                                 v-if="post.total && post.total.seen">
                                                <div>
                                                    <Eye :size="30" :fill="darkMode ? `#909090`: `#4A4A4A`"/>
                                                </div>
                                                <div>
                                                    {{ kFormatter(post.total.seen) }}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                                :class="`liker-${post.liker.length}`"
                                                class="flex items-center justify-end"
                                                v-if="post.liker && post.liker.length">
                                            <div
                                                    @click="showLiker(post)"
                                                    v-if="index < 6"
                                                    :title="liker.name"
                                                    v-for="(liker, index) in post.liker"
                                                    :class="`circle-${index} ${likerClass()}`"
                                                    :key="index + Math.random()"
                                                    class="rounded-full h-11 w-11 relative bg-cover bg-center border-2 cursor-pointer bg-gray-50"
                                                    :style="{backgroundImage:`url(${liker.photo})`}"
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <!--Comment -->
                                <div class="flex h-17 border-t flex items-center w-full mt-4 px-5 space-x-5"
                                     v-if="commentDetailId !== post._id"
                                     @click="showCommentDetail(post._id)"
                                     :class="darkMode ? `border-button text-lightGray` : ``">
                                    <Avatar :avatar-url="stProfile.photo" :size="10"/>
                                    <textarea
                                            disabled
                                            readonly
                                            :placeholder="$t('2113')"
                                            class="outline-none w-full pt-6 bg-transparent cursor-pointer"
                                            style="resize: none"></textarea>
                                    <div class="whitespace-nowrap" v-if="post.total && post.total.comment">
                                        {{ post.total.comment }} {{ commentText(post.total.comment) }}
                                    </div>
                                </div>
                                <div v-if="commentDetailId === post._id">
                                    <CommentDetail :id="commentDetailId" :social="post"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <BuyMsg
                v-if="confirm"
                @cancelModal="cancelModal"
                @yes="yes" :msg="msg"/>
        <div v-if="showAds">
            <VideoADS
                    :videoUrl="videoUrl"
                    @closeAds="closeAds"
                    @lastWatchVideo="lastWatchVideo($event)"/>

        </div>
        <ReadingBook
                v-if="reading"
                @closeReading="closeReading"/>
        <ViewBook
                v-if="preview"
                @close="close"
                @readingBook="readingBook"
                @shopNow="shopNow"
                @listenAudio="listenAudio"
                @listVideo="listVideo"/>
        <LibraryAudio
                v-if="showAudio"
                :is_favorite="false"/>
        <Cart v-if="showCart"
              @closeCart="()=>{this.showCart = false}"
              @showInvoice="showInvoice"/>
        <!-- Receipt info -->
        <ReceiptInfo
                v-if="showReceipt"
                :receiptDetail="receiptDetail"
                @closeInfo="() =>{this.showReceipt = false}"/>
        <!-- Liker -->
        <template v-if="isLiker">
            <Liker :social="postDetail" @closeLiker="()=>{this.isLiker = false}"/>
        </template>

        <!-- Edit post -->
        <template v-if="isEdit">
            <CreatePost
                    :edit-detail="postDetail"
                    :is-edit="true"
                    @dismissPost="()=>{this.isEdit = false}"
                    @closeCreate="closeCreate"/>
        </template>
        <!-- Post detail -->
        <PostDetail
                @dismiss="()=>{this.isPostDetail = false}"
                :post="postDetail"
                v-if="isPostDetail"/>
        <!-- Video detail -->
        <VideoDetail
                @dismiss="()=>{this.isVideo = false}"
                :post="postDetail"
                v-if="isVideo"/>
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
    import ReceiptInfo from "@/views/MyCourse/components/ReceiptInfo";
    import VideoADS from "./../Video/ads/VideoADS.vue"
    import ReadingBook from "./../Library/components/book/ReadingBook.vue"
    import ViewBook from "./../Library/components/book/ViewBook.vue"
    import NewIcon from "./../../components/NewIcon.vue"
    import LibraryAudio from "./../Library/Audio.vue"
    import Vue from 'vue'
    import VueObserveVisibility from 'vue-observe-visibility'
    import ActionList from "../Video/components/ActionList"
    import Action from "../Video/components/Action"
    import Avatar from "../../Avatar";
    import FastAverageColor from "fast-average-color";
    import PhotoGrid from "@/views/Video/components/PhotoGrid";
    import MediaPlayer from "@/views/Video/components/MediaPlayer";
    import CommentDetail from "@/views/Video/components/CommentDetail";
    import Eye from "@/components/Eye";
    import LikeIcon from "@/components/LikeIcon";

    const fac = new FastAverageColor();
    Vue.use(VueObserveVisibility)
    import {mapState, mapActions} from "vuex"
    import moment from "moment";
    import LikeFillIcon from "@/components/LikeFillIcon";
    import CreatePost from "@/views/Component/Post/CreatePost";
    import PostDetail from "@/views/Video/components/PostDetail";
    import VideoDetail from "@/views/Video/components/VideoDetail";

    export default {
        components: {
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
            ReceiptInfo,
            ActionList,
            Action,
            Avatar,
            PhotoGrid,
            MediaPlayer,
            CommentDetail,
            Eye,
            LikeIcon,
            LikeFillIcon,
            CreatePost,
            PostDetail,
            VideoDetail

        },
        computed: {
            ...mapState('setting', ['darkMode', 'isHide']),
            ...mapState('favorite', ['loading', 'favoritedVideo', 'favoritedBook']),
            ...mapState('social', ['favorites']),
            ...mapState('library', ['details']),
            ...mapState('auth', ['stProfile'])
        },
        data() {
            return {
                title: '1109',
                type: 'post',
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
                receiptDetail: {},
                showReceipt: false,
                actionId: null,
                postDetail: {},
                isVideo: false,
                isLiker: false,
                commentDetailId: null,
                isEdit: false,
                isPostDetail: false
            }
        },
        methods: {
            ...mapActions('favorite', ['getVideoFavorite', 'getBookFavorite', 'removeFavoriteVideo', 'removeFavoriteBook']),
            ...mapActions("playVideo", ["stopWatch", "playVideo"]),
            ...mapActions('cart', ['addCart', 'getCart']),
            ...mapActions('library', ['getLibraryDetail']),
            ...mapActions('social', ['like', 'deleteLike', 'deleteSocial', 'addFavorite', 'deleteFavorite']),
            userDetail(user) {
                this.$router.push({
                    name: "user",
                    params: {
                        user_id: user._id
                    }
                })
            },
            closeCreate() {
                this.isEdit = false
            },
            disLikePost(post) {
                let payload = {
                    id: post._id,
                    type: post.type,
                    isFavorite: true
                }
                this.deleteLike(payload).then(() => {
                    payload.liker = post.liker.filter(item => item._id != this.stProfile._id)
                    this.$store.commit('social/removeLike', payload)
                })
            },
            likePost(post) {
                let payload = {
                    id: post._id,
                    type: post.type,
                    isFavorite: true
                }
                this.like(payload)
            },
            showCommentDetail(id) {
                this.commentDetailId = id
            },
            commentText(comment) {
                let text = this.$i18n.t('2114')

                if (this.$i18n.locale === 'en') {
                    if (comment > 1) {
                        text = this.$i18n.t('2114') + 's'
                    }
                }
                return text
            },
            likerClass() {
                if (this.darkMode) {
                    return "border-secondary"
                } else {
                    return "border-white"
                }
            },
            showLiker(post) {
                this.isLiker = true
                this.postDetail = post
            },
            fullScreen(data) {
                this.postDetail = data
                this.isVideo = true
            },
            itemClickHandler(data) {
                this.postDetail = data
                this.isPostDetail = true
            },
            closeAction() {
                this.actionId = null
            },
            seeMore(e) {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.classList.toggle("hidden")
            },
            showAction(post) {
                this.actionId = post._id
            },
            cutString(text, limit) {
                return helper.cutString(text, limit)
            },
            setParentColor(postIndex) {
                let interval = setInterval(() => {
                    if (document.getElementById(postIndex) != null) {
                        fac.getColorAsync(document.getElementById(postIndex))
                            .then(color => {
                                if (color.isDark) {
                                    document.getElementById(postIndex).parentElement.style.color = 'white'
                                }
                            }).catch(error => error);
                        clearInterval(interval)
                    }
                }, 100)
            },
            selectedAction(data) {
                let payload = {}
                payload.id = data.post._id
                this.reportSocial = data.post

                if (data.action.label === 'actions.delete') {
                    this.deleteSocial(payload).then(() => {
                        this.actionId = null
                    })
                }

                if (data.action.label === 'actions.add_to_favorite') {
                    this.addFavorite(payload).then(() => {
                        helper.success('0010')
                        this.actionId = null
                    })
                }

                if (data.action.label === 'actions.remove_favorite') {
                    this.deleteFavorite(payload).then(() => {
                        helper.success('0011')
                        this.actionId = null
                        document.getElementById(payload.id).remove()
                    })
                }
                if (data.action.label === 'actions.edit') {
                    this.postDetail = data.post
                    this.isEdit = true
                    this.actionId = null
                }
                if (data.action.label === 'actions.report') {
                    this.isReport = true
                    this.actionId = null
                }
                if (data.action.label === 'actions.copy_link') {
                    let payload = {
                        id: data.post._id,
                        type: data.post.type
                    }
                    this.$store.dispatch('social/copyLink', payload).then(res => {
                        if (res.data && res.data.url) {
                            this.link = res.data.url
                            setTimeout(() => {
                                let copyText = document.getElementById("copyLink")
                                copyText.select()
                                copyText.setSelectionRange(0, 99999)
                                document.execCommand("copy")
                                helper.success("Copied")
                                this.actionId = null
                            }, 100)
                        }
                    })

                }
            },
            formatDate(day) {
                let currentDate = new Date()
                let today = moment(currentDate)
                let postDay = moment(day)
                let result = today.diff(postDay, 'days')
                if (result === 1 || result === 0) {
                    return moment(day).startOf('hour').fromNow()
                } else {
                    return moment(day).format('LLL')
                }
            },
            changeType(type) {
                this.enableScroll = true
                this.type = type

                if (type === 'course') {
                    this.getVideoFavorite({
                        p: this.page,
                    })
                }
                if (type === 'book') {
                    this.getBookFavorite({
                        p: this.page,
                    })
                }
                if (type === 'post') {
                    this.$store.dispatch("social/getFavorite", {
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
            showInvoice(data) {
                this.receiptDetail = data
                this.showReceipt = true
                this.showCart = false
            },
            addToCart(book) {
                let payload = {}
                payload.id = book._id
                this.addCart(payload).then(() => {
                    this.getCart()
                })
                this.$store.commit("favorite/addToCart", book._id)
            },
            viewVideo(videoCourse) {
                videoCourse.package_id = ""
                this.$router.push({name: 'overview', params: {course: videoCourse}})
            },
            close() {
                this.preview = false
            },
            shopNow() {
                this.preview = false
                let payload = {}
                payload.id = this.details._id

                this.addCart(payload).then(() => {
                    this.getCart()
                    this.showCart = true

                })
            },
            closeReading() {
                this.reading = false
            },
            listVideo() {
                this.$router.push('library-video')
                this.close()
            },
            readingBook() {
                this.reading = true
                this.showAudio = false
                this.close()
            },
            closeAds() {
                this.showAds = false;
            },
            kFormatter(num) {
                return helper.kFormatter(num)
            },
            getDetail(library) {
                this.getLibraryDetail({id: library._id}).then(() => {
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
            confirmRemoveFavorite(id) {
                this.confirm = true
                this.id = id
            },
            cancelModal() {
                this.confirm = false
            },
            yes() {
                if (this.type === `course`) {
                    this.removeFavoriteVideo(this.id).then(() => {
                        this.confirm = false
                    })
                } else {
                    this.removeFavoriteBook(this.id).then(() => {
                        this.$store.commit('favorite/removeFavoriteBook', this.id)
                        this.confirm = false
                    })
                }

            },
            listenAudio() {
                this.showAudio = false
                setTimeout(() => {
                    this.showAudio = true
                }, 100)
                this.close()
            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page++

                    let payload = {}

                    payload.p = this.page
                    payload.paginate = 1

                    if (this.enableScroll) {
                        if (this.type === `video`) {
                            this.getVideoFavorite(payload).then(res => {
                                if (res.data.data.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        } else {
                            this.getBookFavorite(payload).then(res => {
                                if (res.data.data.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        }
                    }
                }
            },

        },
        created() {
            if (this.type == 'post') {
                this.$store.commit("favorite/loading", true)
                this.$store.dispatch('social/getFavorite', {
                    p: this.page
                }).finally(() => {
                    this.$store.commit("favorite/loading", false)
                })
            } else {
                this.getVideoFavorite({
                    p: this.page,
                })
            }
        }


    }
</script>