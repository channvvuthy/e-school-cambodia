<template>
    <div class="mt-3 overflow-y-scroll pb-40 h-screen bg-white" ref="feed" id="feed">
        <template v-if="token">
            <Story></Story>
            <!-- What's on your mind -->
            <div class="bg-white p-5 border-b">
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
            <!-- List -->
            <div class="bg-white px-5 mt-5">
                <div class="w-3/4 border py-3 px-8">
                    <!-- Header -->
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="w-14 h-14 rounded-full bg-cover bg-center" style="background-image:url('profile.png')"></div>
                            <div class="text-sm ml-3">
                                <div class="text-lg">
                                    So Ji Sub
                                </div>
                                <div class="text-xs text-gray-500 text-thin">
                                    Just now
                                </div>
                            </div>
                        </div>
                        <div class="cursor-pointer">
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <div class="w-1 h-1 rounded-full bg-gray-400 my-1"></div>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                        </div>
                    </div>
                    <!-- End header -->
                    <!-- Content -->
                    <div>
                        <div class="my-3">កំណែគីមីវិទ្យា ថ្នាក់ទី៧</div>
                        <div class="flex flex-col items-center bg-gray-300">
                            <img src="http://staging-admin.e-schoolcambodia.com/files/img/202008z5ec27d8281768d3272313b9cm1596441033m7628.jpg">
                        </div>
                    </div>
                    <!-- End content -->
                    <!-- Footer -->
                    <div class="flex justify-between mt-3">
                        <div class="flex items-center">
                            <div class="flex items-center">
                                <div>
                                    <FavoriteFill></FavoriteFill>
                                </div>
                                <div class="text-primary ml-2">
                                    1.2k
                                </div>
                            </div>
                            <div class="flex items-center ml-20">
                                <div>
                                    <ViewIcon></ViewIcon>
                                </div>
                                <div class="ml-2">
                                    1.2k
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End footer -->
                </div>
            </div>
            <!-- End of list -->
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
    import FavoriteFill from "./../components/FavoriteFill.vue"
    import ViewIcon from "./../components/ViewIcon.vue"

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
            VideoPlayerIcon,
            FavoriteFill,
            ViewIcon
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

