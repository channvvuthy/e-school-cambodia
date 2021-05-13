<template>
    <div class="ml-5 mt-3 h-screen overflow-y-scroll pb-60 font-khmer_os">
        <template v-if="loadingForum">
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
            <div v-for="(forum,index) in forums" :key="index" class="bg-white rounded-md shadow mb-3 hover:bg-lightBlue" @click="forumDetail(forum)">
                <div class="mb-3 flex p-5 cursor-pointer">
                    <div class="h-16 w-16 rounded-full bg-cover bg-gray-300" :style="{backgroundImage:`url(${forum.user.photo})`}"></div>
                    <div class="ml-4 flex-1 w-full">
                        <div>
                            <div class="text-base font-semibold text-primary">{{forum.user.name}}</div>
                            <div class="text-gray-500">
                                <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en" />
                            </div>
                        </div>
                        <div>{{cutString(forum.content.text,100)}}</div>
                    </div>
                </div>
                <div class="border-t border-primay h-1 my-2"></div>
                <div class="flex px-5 items-center justify-between">
                    <div class="w-10 h-10 bg-gray-500 rounded-full bg-cover" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                    <div><textarea  :placeholder="$t('2114') + `...`" class="h-10 pl-5 pt-3 focus:outline-none bg-transparent" style="resize: none;"></textarea></div>
                    <div class="flex items-center"><Eye></Eye><div class="ml-2">{{forum.view}}</div></div>
                    <div class="flex items-center ml-10 mr-5"><ChatIcon :size="20"></ChatIcon><div class="ml-2">{{forum.comment}}</div></div>
                </div>
                <div class="h-3"></div>
            </div>
        </template>
    </div>
</template>
<script>
    import {mapActions, mapState} from "vuex"
    import Eye from "./../../../components/Eye.vue"
    import ChatIcon from "./../../../components/ChatIcon.vue"
    import helper from "./../../../helper/helper"
    import VueMomentsAgo from "vue-moments-ago";
    export default{
        components:{
            VueMomentsAgo,
            Eye,
            ChatIcon
        },
        props:{
          id:{
              default:() =>{
                  return ""
              }
          }
        },
        data(){
          return{
              page: 1
          }
        },
        computed:{
            ...mapState('forum', ['forums', 'loadingForum']),
            ...mapState('auth', ['stProfile'])
        },
        methods:{
            ...mapActions('forum', ['getForum']),
            cutString(text, limit){
                return helper.cutString(text, limit)
            },
            forumDetail(forum){
                this.$emit("forumDetail",forum)
            }
        },

        created(){
            this.getForum(
                {id:this.id,p:this.page}
            ).then(response =>{
                console.log(response.data)
            })
        }
    }
</script>
<style>
    .forum{
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
</style>