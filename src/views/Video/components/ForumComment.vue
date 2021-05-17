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
            <div class="ml-5">
                <div class="px-5 bg-softGray pl-4 pb-4">
                    <div class="flex pt-7">
                        <div class="w-16 h-16 bg-white rounded-full bg-cover" :style="{backgroundImage:`url(${comments.forum.user.photo})`}"></div>
                        <div class="text-primary font-semibold ml-4">
                            <div>{{comments.forum.user.name}}</div>
                            <div class="text-gray-500 flex items-center mt-1">
                                <vue-moments-ago prefix="" suffix="ago" :date="comments.forum.date" lang="en" />
                                <div class="border-l h-3 border-gray-500 w-1 mx-4"></div>
                                <div class="bg-darkYellow rounded text-center text-xs text-black px-3 h-5 leading-5 font-normal">{{$t('2115')}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2">
                        {{comments.forum.content.text}}
                    </div>
                </div>
                <div class="bg-white px-10 py-2 h-screen">
                    <template v-if="comments.comment">
                        <div v-for="(comment, index) in comments.comment" :key="index">
                            <div class="flex pt-7">
                                <div class="w-14 h-14 bg-white rounded-full bg-cover" :style="{backgroundImage:`url(${comment.user.photo})`}"></div>
                                <div class="text-primary font-semibold ml-4">
                                    <div>{{comment.user.name}}</div>
                                    <div class="text-gray-500 flex items-center mt-1">
                                        <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en" />
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 ml-16 pl-2">
                                <span class="rounded-md bg-softGray px-2">{{comment.content.text}}sds</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import VueMomentsAgo from "vue-moments-ago";
    export default{
        components:{
            VueMomentsAgo
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
    }
</script>