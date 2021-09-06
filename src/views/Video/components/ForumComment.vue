<template>
    <div>
        <template v-if="loading">
            <div class="flex mb-3 bg-white rounded-md p-3 shadow" v-for="i in 5" :key="i">
                <div class="forum w-16 h-16 rounded-full"></div>
                <div class="flex-1 ml-5">
                    <div class="h-4 w-1/2 forum mb-1"></div>
                    <div class="h-4 w-2/3 forum mb-1"></div>
                    <div class="h-4 w-full forum"></div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="relative ml-5">
                <div class="absolute bottom-40  h-40 w-full my-shadow flex justify-between px-4 items-center" :class="darkMode?`bg-youtube`:`bg-white`">
                    <div class="opacity-50 cursor-pointer" @click="choosePhoto">
                        <ImageIcon :fill="darkMode?`#e4e7eb`:`#000000`"></ImageIcon>
                    </div>
                    <form class="hidden">
                        <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"
                               accept="image/png, image/gif, image/jpeg">
                    </form>
                    <textarea
                             class="ml-5 border h-10 flex-1 resize-none leading-10 pl-5 focus:outline-none rounded-full text-sm" :class="darkMode?`bg-facebook placeholder-placeholder border-none text-gray-300`:`border-gray-400`"
                            :placeholder="$t('2112')" @keyup.enter.exact="replyTextComment(comments.forum)" v-model="text"></textarea>
                </div>
                <div class="h-screen overflow-y-scroll pb-80"  :class="darkMode?`bg-secondary`:`bg-white`" ref="feed" @scroll="onScroll">
                    <div class="px-5 pl-4 pb-4" :class="darkMode?`bg-secondary rgba`:`bg-softGray `">
                        <div class="flex pt-7">
                            <div class="w-16 h-16 bg-white rounded-full bg-cover bg-center" :style="{backgroundImage:`url(${comments.forum.user.photo})`}"></div>
                            <div class="text-primary font-semibold ml-4">
                                <div :class="darkMode?`text-gray-300`:``">{{comments.forum.user.name}}</div>
                                <div class="text-gray-500 flex items-center mt-1">
                                    <vue-moments-ago prefix="" suffix="ago" :date="comments.forum.date" lang="en" />
                                    <div class="border-l h-3 border-gray-500 w-1 mx-4"></div>
                                    <div class="bg-darkYellow rounded text-center text-xs text-black px-3 h-5 leading-5 font-normal">{{$t('2115')}}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-2" :class="darkMode?`text-gray-300`:``" v-if="comments.forum.content.text">
                            {{comments.forum.content.text}}
                        </div>
                        <div class="mt-2" v-if="comments.forum.content.photo">
                            <img :src="comments.forum.content.photo.name" class="m-auto max-w-56 rounded">
                        </div>
                    </div>
                    <div class="px-10 py-2" :class="darkMode?`bg-secondary`:`bg-white `">
                        <template v-if="comments.comment">
                            <div v-for="(comment, index) in comments.comment" :key="index">
                                <div class="flex pt-7">
                                    <div class="w-14 h-14 bg-white rounded-full bg-cover bg-center" :style="{backgroundImage:`url(${comment.user.photo})`}"></div>
                                    <div class="text-primary font-semibold ml-4">
                                        <div :class="darkMode?`text-gray-300`:``">{{comment.user.name}}</div>
                                        <div class="text-gray-500 flex items-center mt-1">
                                            <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en" />
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-1 ml-16 pl-2" :class="index >= (comments.comment.length -1)?`pb-5`:``">
                                    <p class="px-3 py-1 rounded-lg" :class="darkMode?`text-gray-300`:`bg-softGray`" v-if="comment.content.text">{{comment.content.text}}</p>
                                    <div class="mt-2" v-if="comment.content.photo">
                                        <img :src="comment.content.photo.name" class="m-auto max-w-56 rounded">

                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import VueMomentsAgo from "vue-moments-ago";
    import ImageIcon from "./../../../components/ImageIcon.vue"
    import {mapState} from "vuex"
    export default{
        components:{
            VueMomentsAgo,
            ImageIcon
        },
        props: {
            comments: {
                default: () => {
                    return []
                }
            },
            loading:{
                default:()=>{
                    return false
                }
            }
        },
        data(){
            return{
                text: "",
                page: 1,
            }
        },
        computed:{
            ...mapState('setting', ['darkMode'])
        },
        methods:{
            onSelectedPhoto(event){
                if (event.target.value) {
                    this.$emit("reply", true)
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
                    payload.p = this.page
                    payload.id = this.comments.forum._id
                    this.$emit("loadMoreComment",payload)
                }
            },
            replyTextComment(forum){
                if(this.text.length){
                    let data = {
                        id:forum._id,
                        text: this.text
                    }
                    this.$emit("replyTextComment", data)
                    this.text = ""
                    setTimeout(() =>{
                        this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight
                    },2000)

                }
            }
        }
    }
</script>