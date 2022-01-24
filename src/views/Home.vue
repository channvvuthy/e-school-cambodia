<template>
    <div class="mt-3 overflow-y-scroll pb-40 h-screen" ref="feed" id="feed">
        <template v-if="token">
            <Story></Story>
            <!-- What's on your mind -->
            <div class="bg-white p-5">
                <div class="flex justify-between">
                    <div class="flex items-center text-sm">
                        <div class="w-14 h-14 rounded-full shadow bg-cenver bg-cover" 
                        :style="stProfile.photo?{backgroundImage:`url(${stProfile.photo})`}:{backgroundImage:`url(${defaultProfile})`}"></div>
                        <textarea :placeholder="$t('say_something')" class="h-14 ml-5 pt-5 outline-none w-96" style="resize: none;"></textarea>
                    </div>
                    <div class="flex items-center">
                        <div class="bg-softGray rounded-full w-11 h-11 flex items-center justify-center cursor-pointer">
                            <VideoPlayerIcon></VideoPlayerIcon>
                        </div>
                        <div class="bg-softGray rounded-full w-11 h-11 flex items-center justify-center cursor-pointer mx-5">
                            <ImageIcon fill="#055174" :size="24"></ImageIcon>
                        </div>
                        <div class="bg-softGray text-primary text-sm rounded-full w-11 h-11 flex items-center justify-center cursor-pointer">
                            Live
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of mind -->
        </template>
        <template v-else>
            <Signin></Signin>
        </template>
    </div>
</template>
<script>
    import Story from "./Story/Story.vue"
    import {mapActions, mapState} from "vuex"
    import Signin from "./Component/Signin.vue"
    import ImageIcon from "./../components/ImageIcon.vue"
    import VideoPlayerIcon from "./../components/VideoPlayerIcon.vue"

    export default {
        name: 'Home',
        data(){
            return {
               defaultProfile: "profile.png"
            }
        },
        components: {
            Story,
            Signin,
            ImageIcon,
            VideoPlayerIcon
        },
        computed: {
            ...mapState('home', ['filter_id', 's']),
            ...mapState('setting', ['page']),
            ...mapState('auth', ['token','stProfile'])
        },
        methods: {
            ...mapActions('home', ['getList']),
        },
        created(){
            this.getList({
                filter_id: this.filter_id
            })
        }
    }
</script>

