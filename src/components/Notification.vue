<template>
    <div class="fixed inset-0 overflow-y-auto w-full h-full bg-black bg-opacity-90 flex items-center justify-center" style="z-index: 60">
        <div class="rounded-xl shadow-xl max-w-lg min-w-96" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex justify-between items-center p-4 border-b text-sm font-khmer_os" :class="darkMode?`border-button`:`border-bordergray-200`">
                <div class="text-left flex-1 text-center font-semibold text-sm">
                    {{$t('1012')}}
                </div>
                <div class="opacity-80 cursor-pointer" @click="closeNotification">
                    <CloseIcon  :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                </div>
            </div>
            <div class="body mt-5 flex-cols justify-start items-center font-khmer_os text-13px overflow-y-scroll" @scroll="onScroll" style="min-height:24rem;max-height:85vh">
                <div v-if="loadingNotification"
                        class="flex justify-center items-center h-screen">
                    <div class="relative" :class="window.width <= '1366'?' -top-20':' -top-56'">
                        <Loading/>
                    </div>
                </div>
                <div v-else>
                    <div v-if="notifications && notifications.length">
                        <ul>
                            <li v-for="(notification, key) in notifications" :key="key"
                                class="flex justify-start items-center px-4 h-20 cursor-pointer" :class="darkMode?`border-button ${key<(notifications.length - 1)?`border-b`:``}`:`border-gray-200 ${key<(notifications.length - 1)?`border-b`:``}`"
                                @click="readNotification(notification)">
                                <div class="h-12 w-12 rounded-full bg-primary flex justify-center items-center mr-3">
                                    <div v-if="notification.type === 1">
                                        <NotificationIcon fill="#ffffff"></NotificationIcon>
                                    </div>
                                    <div v-if="notification.type === 2">
                                        <CommentIcon fill="#ffffff"></CommentIcon>
                                    </div>
                                    <div v-if="notification.type === 3 || notification.type === 5">
                                        <ChatIcon fill="#ffffff"></ChatIcon>
                                    </div>
                                    <div v-if="notification.type === 4">
                                        <DollarIcon fill="#ffffff"></DollarIcon>
                                    </div>
                                    
                                    <div v-if="notification.type === 8">
                                        <InsuranceIcon fill="#ffffff"></InsuranceIcon>
                                    </div>
                                    <div v-if="notification.type === 9 || notification.type === 10">
                                        <RequestIcon fill="#ffffff"></RequestIcon>
                                    </div>
                                </div>
                                <div class="flex-cols justify-start items-center flex-1">
                                    <div class="font-semibold mb-1">{{cutString(notification.title, 25)}}</div>
                                    <div>{{cutString(notification.content.text, 40)}}</div>
                                </div>
                                <div class="text-right opacity-50 text-xs flex flex-col items-end justify-end ml-10 h-full">
                                   <span> {{formatDate(notification.date)}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import {mapActions, mapState} from "vuex"
    import CloseIcon from "./../components/CloseIcon"
    import ChatIcon from "./../components/ChatIcon.vue"
    import RequestIcon from "./../components/RequestIcon.vue"
    import InsuranceIcon from "./../components/InsuranceIcon.vue"
    import DollarIcon from "./../components/DollarIcon.vue"
    import CommentIcon from "./../components/CommentIcon.vue"
    import helper from "./../helper/helper"
    import moment from "moment"
    import Loading from "./Loading"
    import NotificationIcon from "./NotificationIcon"
    export default{
        name: "Notification",
        data(){
            return {
                window: {
                    width: 0,
                    height: 0
                },
                page: 1
            }
        },
        props: {
            size: {
                type: Number,
                default: () => {
                    return 96
                }
            }
        },
        components: {
            CloseIcon,
            Loading,
            NotificationIcon,
            ChatIcon,
            DollarIcon,
            RequestIcon,
            InsuranceIcon,
            CommentIcon
        },
        computed: {
            ...mapState('auth', ['loadingNotification', 'notifications']),
            ...mapState('setting', ['darkMode'])
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            ...mapActions('auth', ['getNotification', 'readingNotification']),
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

            onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page++

                    this.getNotification(this.page)

                }
            },
            readNotification(notification){
                if(notification.type == 10){
                    this.$store.commit("network/switchTab", "friend")
                    this.$router.push({
                        name:"network"
                    }).catch(err=>{err})
                }
                if(notification.type == 9){
                    this.$store.commit("network/switchTab", "friend_request")
                    this.$router.push({
                        name:"network"
                    }).catch(err=>{err})
                }

                if(notification.type == 8){
                    this.$router.push({
                        name:"insurance"
                    }).catch(err=>{err})
                }

                if(notification.type == 3){
                    this.$router.push({
                        name:"chat"
                    }).catch(err=>{err})
                }

                if(notification.type == 9 || notification.type == 8 || notification.type == 10){
                     this.$emit('closeNotification') 
                }

                this.readingNotification(notification._id).then(response =>{
                    this.$emit('readNotification', response.data.data)
                })
                
            },
            formatDate(date){
                moment.locale('en');
                return moment(date).format('DD-MM-YYYY h:mm a');
            },
            closeNotification(){
                this.$emit("closeNotification")
            },
            cutString(text, limit){
                if (text) {
                    return helper.cutString(text, limit)
                }
                return ""

            }
        },

        created(){
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            this.getNotification(1)
        }
    }
</script>