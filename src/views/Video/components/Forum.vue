<template>
    <div class="ml-5 py-3 h-screen font-khmer_os" :class="loadingForum?`overflow-y-scroll`:darkMode?`bg-youtube rgba`:`mt-1`">
        <template v-if="loadingForum">
            <div class="flex mb-3 bg-white rounded-md p-3 shadow mx-4" v-for="i in 5" :key="i">
                <div class="forum w-16 h-16 rounded-full"></div>
                <div class="flex-1 ml-5">
                    <div class="h-4 w-1/2 forum mb-1"></div>
                    <div class="h-4 w-2/3 forum mb-1"></div>
                    <div class="h-4 w-full forum"></div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="relative h-full">
                <div class="absolute bottom-40  h-40 w-full my-shadow flex justify-between px-4 items-center" :class="darkMode?`bg-secondary`:`bg-white`">
                    <div class="opacity-50 cursor-pointer" @click="choosePhoto">
                        <ImageIcon :fill="darkMode?`#e4e7eb`:`#000000`"></ImageIcon>
                    </div>
                    <form class="hidden">
                        <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"
                               accept="image/png, image/gif, image/jpeg">
                    </form>
                    <textarea
                            class="ml-5 border h-10 flex-1 resize-none leading-10 pl-5 focus:outline-none rounded-full text-sm" :class="darkMode?`bg-facebook placeholder-placeholder border-none text-gray-300`:`border-gray-400`"
                            :placeholder="$t('2112')" @keyup.enter.exact="postComment" v-model="text"></textarea>
                </div>
                <div class="overflow-y-scroll h-4/5 pb-72" @scroll="onScroll" ref="feed" :class="forums.length?``:`${darkMode?`bg-secondary text-white flex items-center justify-center`:`bg-white flex items-center justify-center`}`">
                    <div v-if="!forums.length">
                        {{$t('there_is_no_comment_to_show') }}
                    </div>
                    <div v-for="(forum,index) in forums" :key="index"
                         class=" mb-3" :class="darkMode?`bg-secondary rounded-md`:`bg-white rounded-md shadow hover:bg-lightBlue`">
                        <div class="mb-3 flex p-5 cursor-pointer" @click="forumDetail(forum)">
                            <div class="h-16 w-16 rounded-full bg-cover bg-center bg-gray-300"
                                 :style="{backgroundImage:`url(${forum.user.photo})`}"></div>
                            <div class="ml-4 flex-1 w-full">
                                <div>
                                    <div class="text-base font-semibold" :class="darkMode?`text-byline`:`text-primary`">{{forum.user.name}}</div>
                                    <div class="text-gray-500">
                                        <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en"/>
                                    </div>
                                </div>
                                <div v-if="forum.content.photo">
                                    <img :src="forum.content.photo.name" class="max-h-40 rounded my-2">
                                </div>
                                <div v-if="forum.content.text" :class="darkMode?`text-byline`:``">{{cutString(forum.content.text, 100)}}</div>
                            

                            </div>
                        </div>
                        <div class="h-1 my-2" :class="darkMode?`rgba`:`border-t border-primay `"></div>
                        <div class="flex px-5 items-center justify-between">
                            <div class="w-10 h-10 bg-gray-500 rounded-full bg-cover bg-center"
                                 :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                            <div>
                                <textarea  :placeholder="$t('2114') + `...`"
                                          class="pl-5 h-10 pt-3 focus:outline-none bg-transparent"
                                          :class="darkMode?`placeholder-gray-300 text-gray-300`:``"
                                          style="resize: none;"
                                          :style="darkMode?`caret-color: #e5e7eb`:``"
                                          @keyup.enter.exact="UserReplyComment($event,forum)" :id="forum._id"></textarea></div>
                            <div class="flex items-center">
                                <Eye :fill="darkMode?`#E5E7EB`:``"></Eye>
                                <div class="ml-2" :class="darkMode?`text-gray-300`:``">{{forum.view}}</div>
                            </div>
                            <div class="flex items-center ml-10 mr-5">
                                <ChatIcon :size="20" :fill="darkMode?`#E5E7EB`:``"></ChatIcon>
                                <div class="ml-2" :class="darkMode?`text-gray-300`:``">{{forum.comment}}</div>
                            </div>
                        </div>
                        <div class="h-3"></div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import {mapActions, mapState} from "vuex"
    import Eye from "./../../../components/Eye.vue"
    import ChatIcon from "./../../../components/ChatIcon.vue"
    import ImageIcon from "./../../../components/ImageIcon.vue"
    import helper from "./../../../helper/helper"
    import VueMomentsAgo from "vue-moments-ago";
    export default{
        components: {
            VueMomentsAgo,
            Eye,
            ChatIcon,
            ImageIcon,
        },

        props: {
            id: {
                default: () => {
                    return ""
                }
            }
        },
        data(){
            return {
                page: 1,
                text: "",
                page: 1
            }
        },
        computed: {
            ...mapState('forum', ['forums', 'loadingForum']),
            ...mapState('auth', ['stProfile']),
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            ...mapActions('forum', ['getForum', 'getForumPagination', 'replyComment']),
            cutString(text, limit){
                return helper.cutString(text, limit)
            },
            forumDetail(forum){
                this.$emit("forumDetail", forum)
            },
            postComment(){
                if (this.text) {
                    this.$emit("postComment", this.text)
                }
                this.text = ""
                this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight
                
            },
            UserReplyComment(event, forum){
                let text = event.target.value
                let id = forum._id
                let payload = {id,text}
                if(text.length){
                    this.replyComment(payload).then(res =>{
                        document.getElementById(`${id}`).value = ""
                        this.forumDetail(forum);

                    })
                }
            },

            onSelectedPhoto(event){
                if (event.target.value) {
                    this.$emit("noReply", false)
                    this.$emit("openModal", event)
                    
                }
            },
            choosePhoto(){
                this.$refs.photo.click()
            },
            onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page ++ 
                    let payload = {}
                    let id = document.getElementById("video").value
                    payload.id = id

                    payload.p = this.page
                    this.getForumPagination(payload);
                }
            },
        },

        created(){
            this.getForum(
                {id: this.id, p: this.page}
            )
            
        }
    }
</script>
<style>
    .rgba{
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .forum {
        animation: box 1s infinite;
        background-color: #dfdfdf;
    }

    @keyframes box {
        0% {
            opacity: 0.5;
        }

        50% {
            opacity: 1;
        }

        100% {
            opacity: 0.5;
        }
    }

    .my-shadow {
        box-shadow: 0px -1px 129px rgba(0, 0, 0, 0.2);
    }
</style>